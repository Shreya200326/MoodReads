from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ── Auth ──────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ── Books ─────────────────────────────────────────────────────────────────────

class BookOut(BaseModel):
    id: int
    title: str
    author: str
    genre: Optional[str] = None
    cover_url: Optional[str] = None
    description: Optional[str] = None
    mood_tags: Optional[List[str]] = None
    isbn: Optional[str] = None
    pages: Optional[int] = None
    year: Optional[int] = None

    model_config = {"from_attributes": True}


# ── Shelf ─────────────────────────────────────────────────────────────────────

class UserBookCreate(BaseModel):
    book_id: int
    status: str = "want_to_read"


class UserBookUpdate(BaseModel):
    status: str


class UserBookOut(BaseModel):
    id: int
    book_id: int
    status: str
    added_at: datetime
    book: BookOut

    model_config = {"from_attributes": True}


# ── Reviews ───────────────────────────────────────────────────────────────────

class ReviewCreate(BaseModel):
    review_text: Optional[str] = None
    comfort_score: int = 0
    adventure_score: int = 0
    romance_score: int = 0
    tear_score: int = 0
    mind_blown_score: int = 0


class ReviewOut(BaseModel):
    id: int
    user_id: int
    book_id: int
    review_text: Optional[str] = None
    comfort_score: int
    adventure_score: int
    romance_score: int
    tear_score: int
    mind_blown_score: int
    created_at: datetime

    model_config = {"from_attributes": True}


# ── AI ────────────────────────────────────────────────────────────────────────

class MoodJournalRequest(BaseModel):
    journal_text: str


class LibrarianRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []


class RecommendRequest(BaseModel):
    mood: str
    genre: Optional[str] = None
