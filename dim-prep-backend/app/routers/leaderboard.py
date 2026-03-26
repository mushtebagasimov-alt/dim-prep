from fastapi import APIRouter, Depends, Query
import aiosqlite
from app.database import get_db
from app.models.schemas import LeaderboardResponse, LeaderboardEntry
from app.dependencies import get_current_user_id

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])


@router.get("", response_model=LeaderboardResponse)
async def get_leaderboard(
    period: str = Query(default="weekly", pattern="^(daily|weekly|monthly|allTime)$"),
    limit: int = Query(default=50, le=100),
    user_id: int = Depends(get_current_user_id),
    db: aiosqlite.Connection = Depends(get_db),
):
    if period == "allTime":
        xp_field = "total_xp"
    else:
        xp_field = "weekly_xp"

    # Get top users
    cursor = await db.execute(
        f"""SELECT id, name, exam_group, avatar_url, {xp_field} as xp, current_streak
            FROM users
            ORDER BY {xp_field} DESC
            LIMIT ?""",
        (limit,),
    )
    rows = [dict(row) for row in await cursor.fetchall()]

    entries = []
    user_rank = None
    for i, row in enumerate(rows):
        entry = LeaderboardEntry(
            rank=i + 1,
            user_id=row["id"],
            name=row["name"],
            exam_group=row["exam_group"],
            avatar_url=row["avatar_url"],
            xp=row["xp"],
            streak=row["current_streak"],
        )
        entries.append(entry)
        if row["id"] == user_id:
            user_rank = entry

    # If user not in top list, find their rank
    if user_rank is None:
        cursor = await db.execute(
            f"""SELECT COUNT(*) + 1 as rank FROM users
                WHERE {xp_field} > (SELECT {xp_field} FROM users WHERE id = ?)""",
            (user_id,),
        )
        rank_row = dict(await cursor.fetchone())

        cursor = await db.execute(
            f"""SELECT id, name, exam_group, avatar_url, {xp_field} as xp, current_streak
                FROM users WHERE id = ?""",
            (user_id,),
        )
        user_row = await cursor.fetchone()
        if user_row:
            user_row = dict(user_row)
            user_rank = LeaderboardEntry(
                rank=rank_row["rank"],
                user_id=user_row["id"],
                name=user_row["name"],
                exam_group=user_row["exam_group"],
                avatar_url=user_row["avatar_url"],
                xp=user_row["xp"],
                streak=user_row["current_streak"],
            )

    return LeaderboardResponse(
        period=period,
        entries=entries,
        user_rank=user_rank,
    )
