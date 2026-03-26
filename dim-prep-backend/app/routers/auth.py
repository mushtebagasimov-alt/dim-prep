from fastapi import APIRouter, Depends, HTTPException, status
import aiosqlite
from app.database import get_db
from app.models.schemas import UserRegister, UserLogin, TokenResponse, UserResponse, UserUpdate
from app.services.auth import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user_id

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
async def register(data: UserRegister, db: aiosqlite.Connection = Depends(get_db)):
    # Check if email already exists
    cursor = await db.execute("SELECT id FROM users WHERE email = ?", (data.email,))
    existing = await cursor.fetchone()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu email artıq qeydiyyatdan keçib",
        )

    # Validate exam group
    valid_groups = ["I", "II", "III", "IV", "V"]
    if data.exam_group not in valid_groups:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Yanlış qrup seçimi",
        )

    # Create user
    password_hash = hash_password(data.password)
    cursor = await db.execute(
        """INSERT INTO users (name, email, password_hash, exam_group)
           VALUES (?, ?, ?, ?)""",
        (data.name, data.email, password_hash, data.exam_group),
    )
    await db.commit()
    user_id = cursor.lastrowid

    # Get created user
    cursor = await db.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = dict(await cursor.fetchone())

    token = create_access_token(user_id)
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            exam_group=user["exam_group"],
            avatar_url=user["avatar_url"],
            total_xp=user["total_xp"],
            weekly_xp=user["weekly_xp"],
            current_streak=user["current_streak"],
            longest_streak=user["longest_streak"],
            total_tests_completed=user["total_tests_completed"],
            total_questions_answered=user["total_questions_answered"],
            correct_answers=user["correct_answers"],
            total_study_time_minutes=user["total_study_time_minutes"],
            is_premium=bool(user["is_premium"]),
            created_at=user["created_at"],
        ),
    )


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, db: aiosqlite.Connection = Depends(get_db)):
    cursor = await db.execute("SELECT * FROM users WHERE email = ?", (data.email,))
    user = await cursor.fetchone()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email və ya şifrə yanlışdır",
        )

    user = dict(user)
    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email və ya şifrə yanlışdır",
        )

    token = create_access_token(user["id"])
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            exam_group=user["exam_group"],
            avatar_url=user["avatar_url"],
            total_xp=user["total_xp"],
            weekly_xp=user["weekly_xp"],
            current_streak=user["current_streak"],
            longest_streak=user["longest_streak"],
            total_tests_completed=user["total_tests_completed"],
            total_questions_answered=user["total_questions_answered"],
            correct_answers=user["correct_answers"],
            total_study_time_minutes=user["total_study_time_minutes"],
            is_premium=bool(user["is_premium"]),
            created_at=user["created_at"],
        ),
    )


@router.get("/me", response_model=UserResponse)
async def get_me(
    user_id: int = Depends(get_current_user_id),
    db: aiosqlite.Connection = Depends(get_db),
):
    cursor = await db.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = await cursor.fetchone()
    if user is None:
        raise HTTPException(status_code=404, detail="İstifadəçi tapılmadı")
    user = dict(user)
    return UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        exam_group=user["exam_group"],
        avatar_url=user["avatar_url"],
        total_xp=user["total_xp"],
        weekly_xp=user["weekly_xp"],
        current_streak=user["current_streak"],
        longest_streak=user["longest_streak"],
        total_tests_completed=user["total_tests_completed"],
        total_questions_answered=user["total_questions_answered"],
        correct_answers=user["correct_answers"],
        total_study_time_minutes=user["total_study_time_minutes"],
        is_premium=bool(user["is_premium"]),
        created_at=user["created_at"],
    )


@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    user_id: int = Depends(get_current_user_id),
    db: aiosqlite.Connection = Depends(get_db),
):
    updates = []
    values = []
    if data.name is not None:
        updates.append("name = ?")
        values.append(data.name)
    if data.exam_group is not None:
        valid_groups = ["I", "II", "III", "IV", "V"]
        if data.exam_group not in valid_groups:
            raise HTTPException(status_code=400, detail="Yanlış qrup seçimi")
        updates.append("exam_group = ?")
        values.append(data.exam_group)
    if data.avatar_url is not None:
        updates.append("avatar_url = ?")
        values.append(data.avatar_url)

    if updates:
        updates.append("updated_at = datetime('now')")
        values.append(user_id)
        await db.execute(
            f"UPDATE users SET {', '.join(updates)} WHERE id = ?",
            values,
        )
        await db.commit()

    cursor = await db.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = dict(await cursor.fetchone())
    return UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        exam_group=user["exam_group"],
        avatar_url=user["avatar_url"],
        total_xp=user["total_xp"],
        weekly_xp=user["weekly_xp"],
        current_streak=user["current_streak"],
        longest_streak=user["longest_streak"],
        total_tests_completed=user["total_tests_completed"],
        total_questions_answered=user["total_questions_answered"],
        correct_answers=user["correct_answers"],
        total_study_time_minutes=user["total_study_time_minutes"],
        is_premium=bool(user["is_premium"]),
        created_at=user["created_at"],
    )
