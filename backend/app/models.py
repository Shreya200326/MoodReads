from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    shelf_items = relationship("UserBook", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    genre = Column(String)
    cover_url = Column(String)
    description = Column(Text)
    mood_tags = Column(JSON)       # ["Dreamy", "Romantic"]  — used by frontend
    moods = Column(String)         # "Dreamy,Romantic"       — fast LIKE filtering
    isbn = Column(String)
    pages = Column(Integer)
    year = Column(Integer)
    ai_summary = Column(Text)      # cached AI-generated summary

    shelf_items = relationship("UserBook", back_populates="book")
    reviews = relationship("Review", back_populates="book")


class UserBook(Base):
    __tablename__ = "user_books"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    status = Column(String, default="want_to_read")
    added_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="shelf_items")
    book = relationship("Book", back_populates="shelf_items")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    review_text = Column(Text)
    comfort_score = Column(Integer, default=0)
    adventure_score = Column(Integer, default=0)
    romance_score = Column(Integer, default=0)
    tear_score = Column(Integer, default=0)
    mind_blown_score = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="reviews")
    book = relationship("Book", back_populates="reviews")
