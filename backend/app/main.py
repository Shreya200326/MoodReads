import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes import auth, books, users, ai

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MoodReads API", version="1.0.0", docs_url="/api/docs")

# Allow both local dev and your deployed frontend URL.
# Set FRONTEND_URL env var in production (e.g. https://moodreads.onrender.com)
FRONTEND_URL = os.getenv("FRONTEND_URL", "")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]
if FRONTEND_URL:
    origins.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,  prefix="/auth",  tags=["Auth"])
app.include_router(books.router, prefix="/books", tags=["Books"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(ai.router,    prefix="/ai",    tags=["AI"])


@app.get("/")
def root():
    return {"message": "MoodReads API is running ✨", "docs": "/api/docs"}
