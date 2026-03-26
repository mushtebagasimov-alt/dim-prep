from fastapi import APIRouter, Depends, HTTPException
import aiosqlite
import json
from datetime import date
from app.database import get_db
from app.models.schemas import TestResultSubmit, TestResultResponse
from app.dependencies import get_current_user_id

router = APIRouter(prefix="/api/tests", tags=["tests"])

# XP rewards
XP_CORRECT_ANSWER = 10
XP_TEST_COMPLETED = 25
XP_PERFECT_TEST = 50
XP_DAILY_GOAL = 30
XP_STREAK_BONUS = 5


@router.post("/submit", response_model=TestResultResponse)
async def submit_test_result(
    data: TestResultSubmit,
    user_id: int = Depends(get_current_user_id),
    db: aiosqlite.Connection = Depends(get_db),
):
    total_questions = len(data.answers)
    correct_count = sum(1 for a in data.answers if a.is_correct)
    wrong_count = sum(1 for a in data.answers if a.selected_option is not None and not a.is_correct)
    unanswered_count = sum(1 for a in data.answers if a.selected_option is None)

    # DIM scoring: correct = +points, wrong = -25% penalty
    max_score = 0.0
    score = 0.0
    for answer in data.answers:
        cursor = await db.execute(
            "SELECT points FROM questions WHERE id = ?", (answer.question_id,)
        )
        row = await cursor.fetchone()
        points = row["points"] if row else 8
        max_score += points
        if answer.is_correct:
            score += points
        elif answer.selected_option is not None:
            score -= points * 0.25  # -25% penalty for wrong answers

    score = max(0, score)  # Score can't go below 0
    percentage = (score / max_score * 100) if max_score > 0 else 0

    # Calculate XP earned
    xp_earned = XP_TEST_COMPLETED
    xp_earned += correct_count * XP_CORRECT_ANSWER
    if correct_count == total_questions:
        xp_earned += XP_PERFECT_TEST

    # Save test result
    cursor = await db.execute(
        """INSERT INTO test_results
           (user_id, subject_id, topic_id, total_questions, correct_count,
            wrong_count, unanswered_count, score, max_score, percentage,
            time_spent_seconds, xp_earned)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            user_id, data.subject_id, data.topic_id, total_questions,
            correct_count, wrong_count, unanswered_count, score, max_score,
            percentage, data.time_spent_seconds, xp_earned,
        ),
    )
    test_result_id = cursor.lastrowid

    # Save individual answers
    for answer in data.answers:
        await db.execute(
            """INSERT INTO test_answers
               (test_result_id, question_id, selected_option, is_correct, time_spent_seconds)
               VALUES (?, ?, ?, ?, ?)""",
            (
                test_result_id, answer.question_id, answer.selected_option,
                1 if answer.is_correct else 0, answer.time_spent_seconds,
            ),
        )

    # Update user stats
    today = date.today().isoformat()

    # Get current user data
    cursor = await db.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = dict(await cursor.fetchone())

    new_total_xp = user["total_xp"] + xp_earned
    new_weekly_xp = user["weekly_xp"] + xp_earned
    new_tests = user["total_tests_completed"] + 1
    new_questions = user["total_questions_answered"] + total_questions
    new_correct = user["correct_answers"] + correct_count
    new_study_time = user["total_study_time_minutes"] + (data.time_spent_seconds // 60)

    # Update streak
    last_study = user["last_study_date"]
    current_streak = user["current_streak"]
    longest_streak = user["longest_streak"]

    if last_study != today:
        yesterday = str(date.today().toordinal() - 1)
        if last_study == str(date.fromordinal(date.today().toordinal() - 1)):
            current_streak += 1
        elif last_study != today:
            current_streak = 1

        if current_streak > longest_streak:
            longest_streak = current_streak

        # Streak bonus XP
        if current_streak > 1:
            streak_xp = XP_STREAK_BONUS * current_streak
            new_total_xp += streak_xp
            new_weekly_xp += streak_xp
            xp_earned += streak_xp

    await db.execute(
        """UPDATE users SET
           total_xp = ?, weekly_xp = ?, current_streak = ?,
           longest_streak = ?, last_study_date = ?,
           total_tests_completed = ?, total_questions_answered = ?,
           correct_answers = ?, total_study_time_minutes = ?,
           updated_at = datetime('now')
           WHERE id = ?""",
        (
            new_total_xp, new_weekly_xp, current_streak, longest_streak,
            today, new_tests, new_questions, new_correct, new_study_time,
            user_id,
        ),
    )

    # Update daily activity
    cursor = await db.execute(
        "SELECT * FROM daily_activity WHERE user_id = ? AND date = ?",
        (user_id, today),
    )
    existing = await cursor.fetchone()

    if existing:
        await db.execute(
            """UPDATE daily_activity SET
               questions_answered = questions_answered + ?,
               tests_completed = tests_completed + 1,
               xp_earned = xp_earned + ?,
               study_time_minutes = study_time_minutes + ?
               WHERE user_id = ? AND date = ?""",
            (total_questions, xp_earned, data.time_spent_seconds // 60, user_id, today),
        )
    else:
        await db.execute(
            """INSERT INTO daily_activity
               (user_id, date, questions_answered, tests_completed, xp_earned, study_time_minutes)
               VALUES (?, ?, ?, 1, ?, ?)""",
            (user_id, today, total_questions, xp_earned, data.time_spent_seconds // 60),
        )

    await db.commit()

    return TestResultResponse(
        id=test_result_id,
        user_id=user_id,
        subject_id=data.subject_id,
        topic_id=data.topic_id,
        total_questions=total_questions,
        correct_count=correct_count,
        wrong_count=wrong_count,
        unanswered_count=unanswered_count,
        score=score,
        max_score=max_score,
        percentage=percentage,
        time_spent_seconds=data.time_spent_seconds,
        xp_earned=xp_earned,
        created_at=today,
    )


@router.get("/history", response_model=list[TestResultResponse])
async def get_test_history(
    limit: int = 20,
    subject_id: str | None = None,
    user_id: int = Depends(get_current_user_id),
    db: aiosqlite.Connection = Depends(get_db),
):
    if subject_id:
        cursor = await db.execute(
            """SELECT * FROM test_results
               WHERE user_id = ? AND subject_id = ?
               ORDER BY created_at DESC LIMIT ?""",
            (user_id, subject_id, limit),
        )
    else:
        cursor = await db.execute(
            """SELECT * FROM test_results
               WHERE user_id = ?
               ORDER BY created_at DESC LIMIT ?""",
            (user_id, limit),
        )

    results = [dict(row) for row in await cursor.fetchall()]
    return [
        TestResultResponse(
            id=r["id"],
            user_id=r["user_id"],
            subject_id=r["subject_id"],
            topic_id=r["topic_id"],
            total_questions=r["total_questions"],
            correct_count=r["correct_count"],
            wrong_count=r["wrong_count"],
            unanswered_count=r["unanswered_count"],
            score=r["score"],
            max_score=r["max_score"],
            percentage=r["percentage"],
            time_spent_seconds=r["time_spent_seconds"],
            xp_earned=r["xp_earned"],
            created_at=r["created_at"],
        )
        for r in results
    ]
