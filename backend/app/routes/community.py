"""
Community routes — book discussion rooms.
Each room is tied to a Book. Anyone can post; users need to be logged in.
"""
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Session, relationship

from ..database import Base, get_db
from ..models import User
from ..auth import get_current_user, get_optional_user

router = APIRouter(prefix="/community", tags=["community"])


# ── Models (add these to models.py too) ──────────────────────────────────────

class DiscussionRoom(Base):
    __tablename__ = "discussion_rooms"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    messages = relationship("DiscussionMessage", back_populates="room", cascade="all, delete")
    book = relationship("Book")


class DiscussionMessage(Base):
    __tablename__ = "discussion_messages"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("discussion_rooms.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    room = relationship("DiscussionRoom", back_populates="messages")
    user = relationship("User")


# ── Schemas ───────────────────────────────────────────────────────────────────

class MessageOut(BaseModel):
    id: int
    content: str
    created_at: datetime
    user_name: str
    user_id: int

    class Config:
        from_attributes = True


class MessageIn(BaseModel):
    content: str


class RoomOut(BaseModel):
    id: int
    book_id: int
    book_title: str
    book_author: str
    message_count: int

    class Config:
        from_attributes = True


# ── Routes ────────────────────────────────────────────────────────────────────

@router.get("/rooms", response_model=List[dict])
def list_active_rooms(db: Session = Depends(get_db)):
    """Returns all rooms that have at least 1 message, sorted by activity."""
    rooms = db.query(DiscussionRoom).all()
    result = []
    for room in rooms:
        msg_count = len(room.messages)
        if msg_count == 0:
            continue
        result.append({
            "id": room.id,
            "book_id": room.book_id,
            "book_title": room.book.title if room.book else "",
            "book_author": room.book.author if room.book else "",
            "book_cover": room.book.cover_url if room.book else "",
            "message_count": msg_count,
            "last_active": room.messages[-1].created_at.isoformat() if room.messages else room.created_at.isoformat(),
        })
    result.sort(key=lambda x: x["last_active"], reverse=True)
    return result


@router.get("/rooms/{book_id}", response_model=dict)
def get_or_create_room(book_id: int, db: Session = Depends(get_db)):
    """Get (or auto-create) the discussion room for a book."""
    room = db.query(DiscussionRoom).filter(DiscussionRoom.book_id == book_id).first()
    if not room:
        room = DiscussionRoom(book_id=book_id)
        db.add(room)
        db.commit()
        db.refresh(room)

    messages = []
    for m in room.messages[-100:]:  # last 100 messages
        messages.append({
            "id": m.id,
            "content": m.content,
            "created_at": m.created_at.isoformat(),
            "user_name": m.user.name if m.user else "Reader",
            "user_id": m.user_id,
        })

    return {
        "id": room.id,
        "book_id": book_id,
        "messages": messages,
    }


@router.post("/rooms/{book_id}/messages", response_model=dict)
def post_message(
    book_id: int,
    body: MessageIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not body.content.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    if len(body.content) > 1000:
        raise HTTPException(status_code=400, detail="Message too long (max 1000 chars).")

    room = db.query(DiscussionRoom).filter(DiscussionRoom.book_id == book_id).first()
    if not room:
        room = DiscussionRoom(book_id=book_id)
        db.add(room)
        db.flush()

    msg = DiscussionMessage(
        room_id=room.id,
        user_id=current_user.id,
        content=body.content.strip(),
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    return {
        "id": msg.id,
        "content": msg.content,
        "created_at": msg.created_at.isoformat(),
        "user_name": current_user.name,
        "user_id": current_user.id,
    }


@router.delete("/messages/{message_id}", response_model=dict)
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    msg = db.query(DiscussionMessage).filter(DiscussionMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found.")
    if msg.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own messages.")
    db.delete(msg)
    db.commit()
    return {"deleted": True}