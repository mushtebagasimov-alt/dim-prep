from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# Auth schemas
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    exam_group: str = "I"


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    exam_group: str
    avatar_url: Optional[str] = None
    total_xp: int = 0
    weekly_xp: int = 0
    current_streak: int = 0
    longest_streak: int = 0
    total_tests_completed: int = 0
    total_questions_answered: int = 0
    correct_answers: int = 0
    total_study_time_minutes: int = 0
    is_premium: bool = False
    created_at: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    exam_group: Optional[str] = None
    avatar_url: Optional[str] = None


# Question schemas
class QuestionResponse(BaseModel):
    id: str
    subject_id: str
    topic_id: Optional[str] = None
    type: str = "closed"
    text: str
    options: Optional[list[str]] = None
    correct_answer: int = 0
    explanation: Optional[str] = None
    difficulty: int = 1
    points: int = 8


class SubjectResponse(BaseModel):
    id: str
    name: str
    icon: str
    color: str
    question_count: int = 0
    topics: list["TopicResponse"] = []


class TopicResponse(BaseModel):
    id: str
    subject_id: str
    name: str
    question_count: int = 0


# Test schemas
class TestAnswerSubmit(BaseModel):
    question_id: str
    selected_option: Optional[int] = None
    is_correct: bool = False
    time_spent_seconds: int = 0


class TestResultSubmit(BaseModel):
    subject_id: str
    topic_id: Optional[str] = None
    answers: list[TestAnswerSubmit]
    time_spent_seconds: int = 0


class TestResultResponse(BaseModel):
    id: int
    user_id: int
    subject_id: str
    topic_id: Optional[str] = None
    total_questions: int
    correct_count: int
    wrong_count: int
    unanswered_count: int = 0
    score: float
    max_score: float
    percentage: float
    time_spent_seconds: int = 0
    xp_earned: int = 0
    created_at: Optional[str] = None


# Leaderboard schemas
class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    name: str
    exam_group: str
    avatar_url: Optional[str] = None
    xp: int = 0
    streak: int = 0


class LeaderboardResponse(BaseModel):
    period: str
    entries: list[LeaderboardEntry]
    user_rank: Optional[LeaderboardEntry] = None


# Stats schemas
class UserStatsResponse(BaseModel):
    total_xp: int = 0
    weekly_xp: int = 0
    current_streak: int = 0
    longest_streak: int = 0
    total_tests_completed: int = 0
    total_questions_answered: int = 0
    correct_answers: int = 0
    accuracy: float = 0.0
    total_study_time_minutes: int = 0
    level: int = 1
    level_name: str = "Başlanğıc"
    xp_for_next_level: int = 100
    recent_tests: list[TestResultResponse] = []
    badges: list[str] = []


class DailyActivityResponse(BaseModel):
    date: str
    questions_answered: int = 0
    tests_completed: int = 0
    xp_earned: int = 0
    study_time_minutes: int = 0


# Badge schema
class BadgeResponse(BaseModel):
    badge_id: str
    unlocked_at: Optional[str] = None
