from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.seed_data import seed_database
from app.routers import auth, questions, tests, leaderboard, stats


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database and seed data
    await init_db()
    await seed_database()
    yield


app = FastAPI(title="DIM Prep API", version="1.0.0", lifespan=lifespan)

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(auth.router)
app.include_router(questions.router)
app.include_router(tests.router)
app.include_router(leaderboard.router)
app.include_router(stats.router)


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
