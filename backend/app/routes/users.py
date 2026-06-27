from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..database import get_db
from ..models import Book, User, UserBook
from ..schemas import UserBookCreate, UserBookOut, UserBookUpdate

router = APIRouter()


@router.get("/me/shelf", response_model=List[UserBookOut])
def get_shelf(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(UserBook)
        .filter(UserBook.user_id == current_user.id)
        .all()
    )


@router.post("/me/shelf", response_model=UserBookOut)
def add_to_shelf(
    body: UserBookCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not db.query(Book).filter(Book.id == body.book_id).first():
        raise HTTPException(status_code=404, detail="Book not found")

    existing = (
        db.query(UserBook)
        .filter(UserBook.user_id == current_user.id, UserBook.book_id == body.book_id)
        .first()
    )
    if existing:
        existing.status = body.status
        db.commit()
        db.refresh(existing)
        return existing

    entry = UserBook(user_id=current_user.id, book_id=body.book_id, status=body.status)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.put("/me/shelf/{book_id}", response_model=UserBookOut)
def update_shelf(
    book_id: int,
    body: UserBookUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = (
        db.query(UserBook)
        .filter(UserBook.user_id == current_user.id, UserBook.book_id == book_id)
        .first()
    )
    if not entry:
        raise HTTPException(status_code=404, detail="Not on shelf")
    entry.status = body.status
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/me/shelf/{book_id}")
def remove_from_shelf(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = (
        db.query(UserBook)
        .filter(UserBook.user_id == current_user.id, UserBook.book_id == book_id)
        .first()
    )
    if not entry:
        raise HTTPException(status_code=404, detail="Not on shelf")
    db.delete(entry)
    db.commit()
    return {"detail": "Removed from shelf"}
