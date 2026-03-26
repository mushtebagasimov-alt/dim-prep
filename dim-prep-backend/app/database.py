import aiosqlite
import os

DATABASE_PATH = os.environ.get("DATABASE_PATH", "/data/app.db")

# Fallback to local path if /data doesn't exist (dev mode)
if not os.path.exists("/data"):
    DATABASE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "app.db")


async def get_db():
    db = await aiosqlite.connect(DATABASE_PATH)
    db.row_factory = aiosqlite.Row
    await db.execute("PRAGMA journal_mode=WAL")
    await db.execute("PRAGMA foreign_keys=ON")
    try:
        yield db
    finally:
        await db.close()


async def init_db():
    db = await aiosqlite.connect(DATABASE_PATH)
    await db.execute("PRAGMA journal_mode=WAL")
    await db.execute("PRAGMA foreign_keys=ON")

    await db.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            exam_group TEXT NOT NULL DEFAULT 'I',
            avatar_url TEXT,
            total_xp INTEGER DEFAULT 0,
            weekly_xp INTEGER DEFAULT 0,
            current_streak INTEGER DEFAULT 0,
            longest_streak INTEGER DEFAULT 0,
            last_study_date TEXT,
            total_tests_completed INTEGER DEFAULT 0,
            total_questions_answered INTEGER DEFAULT 0,
            correct_answers INTEGER DEFAULT 0,
            total_study_time_minutes INTEGER DEFAULT 0,
            is_premium INTEGER DEFAULT 0,
            premium_expires_at TEXT,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS subjects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            icon TEXT NOT NULL DEFAULT '📚',
            color TEXT NOT NULL DEFAULT '#4F46E5'
        );

        CREATE TABLE IF NOT EXISTS topics (
            id TEXT PRIMARY KEY,
            subject_id TEXT NOT NULL,
            name TEXT NOT NULL,
            FOREIGN KEY (subject_id) REFERENCES subjects(id)
        );

        CREATE TABLE IF NOT EXISTS questions (
            id TEXT PRIMARY KEY,
            subject_id TEXT NOT NULL,
            topic_id TEXT,
            type TEXT NOT NULL DEFAULT 'closed',
            text TEXT NOT NULL,
            options TEXT,
            correct_answer INTEGER NOT NULL DEFAULT 0,
            explanation TEXT,
            difficulty INTEGER NOT NULL DEFAULT 1,
            points INTEGER NOT NULL DEFAULT 8,
            FOREIGN KEY (subject_id) REFERENCES subjects(id),
            FOREIGN KEY (topic_id) REFERENCES topics(id)
        );

        CREATE TABLE IF NOT EXISTS test_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            subject_id TEXT NOT NULL,
            topic_id TEXT,
            total_questions INTEGER NOT NULL,
            correct_count INTEGER NOT NULL,
            wrong_count INTEGER NOT NULL,
            unanswered_count INTEGER NOT NULL DEFAULT 0,
            score REAL NOT NULL,
            max_score REAL NOT NULL,
            percentage REAL NOT NULL,
            time_spent_seconds INTEGER DEFAULT 0,
            xp_earned INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (subject_id) REFERENCES subjects(id)
        );

        CREATE TABLE IF NOT EXISTS test_answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            test_result_id INTEGER NOT NULL,
            question_id TEXT NOT NULL,
            selected_option INTEGER,
            is_correct INTEGER NOT NULL DEFAULT 0,
            time_spent_seconds INTEGER DEFAULT 0,
            FOREIGN KEY (test_result_id) REFERENCES test_results(id),
            FOREIGN KEY (question_id) REFERENCES questions(id)
        );

        CREATE TABLE IF NOT EXISTS badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            badge_id TEXT NOT NULL,
            unlocked_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE(user_id, badge_id)
        );

        CREATE TABLE IF NOT EXISTS daily_activity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            questions_answered INTEGER DEFAULT 0,
            tests_completed INTEGER DEFAULT 0,
            xp_earned INTEGER DEFAULT 0,
            study_time_minutes INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE(user_id, date)
        );
    """)

    await db.commit()
    await db.close()
