from fastapi import APIRouter, Depends, HTTPException, Query
import aiosqlite
import json
from app.database import get_db
from app.models.schemas import QuestionResponse, SubjectResponse, TopicResponse
from app.dependencies import get_current_user_id

router = APIRouter(prefix="/api/questions", tags=["questions"])


@router.get("/subjects", response_model=list[SubjectResponse])
async def get_subjects(db: aiosqlite.Connection = Depends(get_db)):
    cursor = await db.execute("SELECT * FROM subjects ORDER BY id")
    subjects = [dict(row) for row in await cursor.fetchall()]

    result = []
    for subject in subjects:
        # Get topics for this subject
        cursor = await db.execute(
            "SELECT * FROM topics WHERE subject_id = ? ORDER BY id",
            (subject["id"],),
        )
        topics = [dict(row) for row in await cursor.fetchall()]

        # Get question counts
        cursor = await db.execute(
            "SELECT COUNT(*) as cnt FROM questions WHERE subject_id = ?",
            (subject["id"],),
        )
        total_count = (await cursor.fetchone())["cnt"]

        topic_responses = []
        for topic in topics:
            cursor = await db.execute(
                "SELECT COUNT(*) as cnt FROM questions WHERE topic_id = ?",
                (topic["id"],),
            )
            topic_count = (await cursor.fetchone())["cnt"]
            topic_responses.append(
                TopicResponse(
                    id=topic["id"],
                    subject_id=topic["subject_id"],
                    name=topic["name"],
                    question_count=topic_count,
                )
            )

        result.append(
            SubjectResponse(
                id=subject["id"],
                name=subject["name"],
                icon=subject["icon"],
                color=subject["color"],
                question_count=total_count,
                topics=topic_responses,
            )
        )

    return result


@router.get("/by-subject/{subject_id}", response_model=list[QuestionResponse])
async def get_questions_by_subject(
    subject_id: str,
    topic_id: str | None = None,
    limit: int = Query(default=20, le=50),
    db: aiosqlite.Connection = Depends(get_db),
):
    if topic_id:
        cursor = await db.execute(
            "SELECT * FROM questions WHERE subject_id = ? AND topic_id = ? ORDER BY RANDOM() LIMIT ?",
            (subject_id, topic_id, limit),
        )
    else:
        cursor = await db.execute(
            "SELECT * FROM questions WHERE subject_id = ? ORDER BY RANDOM() LIMIT ?",
            (subject_id, limit),
        )

    questions = [dict(row) for row in await cursor.fetchall()]
    result = []
    for q in questions:
        options = json.loads(q["options"]) if q["options"] else None
        result.append(
            QuestionResponse(
                id=q["id"],
                subject_id=q["subject_id"],
                topic_id=q["topic_id"],
                type=q["type"],
                text=q["text"],
                options=options,
                correct_answer=q["correct_answer"],
                explanation=q["explanation"],
                difficulty=q["difficulty"],
                points=q["points"],
            )
        )
    return result


@router.get("/random", response_model=list[QuestionResponse])
async def get_random_questions(
    subject_id: str | None = None,
    count: int = Query(default=10, le=30),
    db: aiosqlite.Connection = Depends(get_db),
):
    if subject_id:
        cursor = await db.execute(
            "SELECT * FROM questions WHERE subject_id = ? ORDER BY RANDOM() LIMIT ?",
            (subject_id, count),
        )
    else:
        cursor = await db.execute(
            "SELECT * FROM questions ORDER BY RANDOM() LIMIT ?",
            (count,),
        )

    questions = [dict(row) for row in await cursor.fetchall()]
    result = []
    for q in questions:
        options = json.loads(q["options"]) if q["options"] else None
        result.append(
            QuestionResponse(
                id=q["id"],
                subject_id=q["subject_id"],
                topic_id=q["topic_id"],
                type=q["type"],
                text=q["text"],
                options=options,
                correct_answer=q["correct_answer"],
                explanation=q["explanation"],
                difficulty=q["difficulty"],
                points=q["points"],
            )
        )
    return result
