from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..auth import get_current_user, get_optional_user
from ..database import get_db
from ..models import Book, Review, User
from ..schemas import BookOut, ReviewCreate, ReviewOut
from ..services import ai_service

router = APIRouter()


@router.get("/", response_model=List[BookOut])
def list_books(
    mood: Optional[str] = Query(None),
    genre: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 24,
    db: Session = Depends(get_db),
):
    q = db.query(Book)
    if mood:
        q = q.filter(Book.moods.ilike(f"%{mood}%"))
    if genre:
        q = q.filter(Book.genre.ilike(f"%{genre}%"))
    if search:
        q = q.filter((Book.title.ilike(f"%{search}%")) | (Book.author.ilike(f"%{search}%")))
    return q.offset(skip).limit(limit).all()


@router.get("/{book_id}", response_model=BookOut)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@router.get("/{book_id}/summary")
def get_summary(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    if book.ai_summary:
        return {"summary": book.ai_summary, "cached": True}

    summary = ai_service.generate_book_summary(
        title=book.title,
        author=book.author,
        genre=book.genre or "",
        description=book.description or "",
    )
    book.ai_summary = summary
    db.commit()
    return {"summary": summary, "cached": False}


@router.get("/{book_id}/reviews", response_model=List[ReviewOut])
def get_reviews(book_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.book_id == book_id).all()


@router.post("/{book_id}/reviews", response_model=ReviewOut)
def add_review(
    book_id: int,
    body: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not db.query(Book).filter(Book.id == book_id).first():
        raise HTTPException(status_code=404, detail="Book not found")
    existing = (
        db.query(Review)
        .filter(Review.user_id == current_user.id, Review.book_id == book_id)
        .first()
    )
    if existing:
        for k, v in body.model_dump().items():
            setattr(existing, k, v)
        db.commit()
        db.refresh(existing)
        return existing
    review = Review(user_id=current_user.id, book_id=book_id, **body.model_dump())
    db.add(review)
    db.commit()
    db.refresh(review)
    return review
