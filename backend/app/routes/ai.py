from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Book
from ..schemas import BookOut, LibrarianRequest, MoodJournalRequest, RecommendRequest
from ..services import ai_service

router = APIRouter()


def _books_csv(books: List[Book]) -> str:
    return "\n".join(
        f"{b.id} | {b.title} | {b.author} | {b.genre} | {b.moods}"
        for b in books
    )


@router.post("/recommend")
def recommend(body: RecommendRequest, db: Session = Depends(get_db)):
    all_books = db.query(Book).all()
    books_csv = _books_csv(all_books)

    # Try semantic AI matching first
    ids = ai_service.semantic_mood_recommend(body.mood, body.genre, books_csv)

    if ids:
        ordered = {b.id: b for b in all_books}
        results = [ordered[i] for i in ids if i in ordered]
    else:
        # Fallback: tag-based filter
        q = db.query(Book).filter(Book.moods.ilike(f"%{body.mood}%"))
        if body.genre:
            q = q.filter(Book.genre.ilike(f"%{body.genre}%"))
        results = q.limit(6).all()

    return [BookOut.model_validate(b) for b in results]


@router.post("/mood-journal")
def mood_journal(body: MoodJournalRequest, db: Session = Depends(get_db)):
    all_books = db.query(Book).all()
    books_csv = _books_csv(all_books)

    result = ai_service.analyze_mood_journal(body.journal_text, books_csv)

    book_ids = result.get("book_ids", [])
    book_map = {b.id: b for b in all_books}
    books = [BookOut.model_validate(book_map[i]) for i in book_ids if i in book_map]

    return {
        "mood_analysis": result.get("mood_analysis", ""),
        "detected_moods": result.get("detected_moods", []),
        "recommendation_reason": result.get("recommendation_reason", ""),
        "books": books,
    }


@router.post("/librarian")
def librarian(body: LibrarianRequest, db: Session = Depends(get_db)):
    all_books = db.query(Book).all()
    books_csv = _books_csv(all_books)

    result = ai_service.librarian_chat(body.message, body.history or [], books_csv)

    book_ids = result.get("book_ids", [])
    book_map = {b.id: b for b in all_books}
    books = [BookOut.model_validate(book_map[i]) for i in book_ids if i in book_map]

    return {"response": result["response"], "books": books}
