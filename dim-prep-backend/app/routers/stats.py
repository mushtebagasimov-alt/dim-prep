from fastapi import APIRouter, Depends, Query
import aiosqlite
from app.database import get_db
from app.models.schemas import UserStatsResponse, TestResultResponse, DailyActivityResponse
from app.dependencies import get_current_user_id

router = APIRouter(prefix="/api/stats", tags=["stats"])

# Level definitions
LEVELS = [
    {"level": 1, "name": "Başlanğıc", "min_xp": 0},
    {"level": 2, "name": "Şagird", "min_xp": 100},
    {"level": 3, "name": "Tələbə", "min_xp": 300},
    {"level": 4, "name": "Bilikli", "min_xp": 600},
    {"level": 5, "name": "Bacarıqlı", "min_xp": 1000},
    {"level": 6, "name": "Mütəxəssis", "min_xp": 1500},
    {"level": 7, "name": "Ekspert", "min_xp": 2200},
    {"level": 8, "name": "Ustad", "min_xp": 3000},
    {"level": 9, "name": "Professor", "min_xp": 4000},
    {"level": 10, "name": "Çempion", "min_xp": 5500},
]


def get_level_info(total_xp: int) -> tuple[int, str, int]:
    level = 1
    level_name = LEVELS[0]["name"]
    xp_for_next = LEVELS[1]["min_xp"] if len(LEVELS) > 1 else 0

    for i, lv in enumerate(LEVELS):
        if total_xp >= lv["min_xp"]:
            level = lv["level"]
            level_name = lv["name"]
            if i + 1 < len(LEVELS):
                xp_for_next = LEVELS[i + 1]["min_xp"]
            else:
                xp_for_next = lv["min_xp"]

    return level, level_name, xp_for_next


@router.get("", response_model=UserStatsResponse)
async def get_user_stats(
    user_id: int = Depends(get_current_user_id),
    db: aiosqlite.Connection = Depends(get_db),
):
    # Get user data
    cursor = await db.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = dict(await cursor.fetchone())

    total_xp = user["total_xp"]
    level, level_name, xp_for_next = get_level_info(total_xp)

    accuracy = 0.0
    if user["total_questions_answered"] > 0:
        accuracy = (user["correct_answers"] / user["total_questions_answered"]) * 100

    # Get recent tests
    cursor = await db.execute(
        """SELECT * FROM test_results
           WHERE user_id = ?
           ORDER BY created_at DESC LIMIT 10""",
        (user_id,),
    )
    recent = [dict(row) for row in await cursor.fetchall()]
    recent_tests = [
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
        for r in recent
    ]

    # Get badges
    cursor = await db.execute(
        "SELECT badge_id FROM badges WHERE user_id = ?", (user_id,)
    )
    badges = [row["badge_id"] for row in await cursor.fetchall()]

    return UserStatsResponse(
        total_xp=total_xp,
        weekly_xp=user["weekly_xp"],
        current_streak=user["current_streak"],
        longest_streak=user["longest_streak"],
        total_tests_completed=user["total_tests_completed"],
        total_questions_answered=user["total_questions_answered"],
        correct_answers=user["correct_answers"],
        accuracy=round(accuracy, 1),
        total_study_time_minutes=user["total_study_time_minutes"],
        level=level,
        level_name=level_name,
        xp_for_next_level=xp_for_next,
        recent_tests=recent_tests,
        badges=badges,
    )


@router.get("/daily", response_model=list[DailyActivityResponse])
async def get_daily_activity(
    days: int = Query(default=30, le=90),
    user_id: int = Depends(get_current_user_id),
    db: aiosqlite.Connection = Depends(get_db),
):
    cursor = await db.execute(
        """SELECT * FROM daily_activity
           WHERE user_id = ?
           ORDER BY date DESC LIMIT ?""",
        (user_id, days),
    )
    activities = [dict(row) for row in await cursor.fetchall()]
    return [
        DailyActivityResponse(
            date=a["date"],
            questions_answered=a["questions_answered"],
            tests_completed=a["tests_completed"],
            xp_earned=a["xp_earned"],
            study_time_minutes=a["study_time_minutes"],
        )
        for a in activities
    ]
