"""
AI features powered by Gemini (Google).
All calls gracefully degrade if GEMINI_API_KEY is not set.
"""
import json
import re
from typing import List, Optional

from ..config import settings

_NO_KEY_MSG = (
    "AI features require a GEMINI_API_KEY. "
    "Add it to your .env file to unlock summaries, mood journaling, and the librarian."
)


def _client():
    if not settings.gemini_api_key:
        return None
    try:
        import google.generativeai as genai
        genai.configure(api_key=settings.gemini_api_key)
        return genai.GenerativeModel("gemini-1.5-flash")
    except ImportError:
        return None


def _ask(system: str, user: str, max_tokens: int = 600, history: list = None) -> str:
    model = _client()
    if not model:
        return _NO_KEY_MSG

    # Combine system + history + user into a single prompt for Gemini
    parts = [f"[SYSTEM]\n{system}\n\n"]

    if history:
        for msg in history:
            role = "User" if msg["role"] == "user" else "Assistant"
            parts.append(f"[{role}]\n{msg['content']}\n\n")

    parts.append(f"[User]\n{user}")
    full_prompt = "".join(parts)

    response = model.generate_content(
        full_prompt,
        generation_config={"max_output_tokens": max_tokens},
    )
    return response.text


# ── Book Summary ──────────────────────────────────────────────────────────────

def generate_book_summary(title: str, author: str, genre: str, description: str) -> str:
    system = (
        "You are a literary curator who writes compelling, spoiler-free 2-minute read summaries. "
        "Your tone is warm, atmospheric, and makes readers want to pick up the book immediately."
    )
    user = f"""Write a 2-minute read summary for "{title}" by {author}.

Genre: {genre}
Known details: {description}

Structure:
1. Opening hook (1 sentence about the feeling/world)
2. Core premise (2-3 sentences, no spoilers)
3. Themes (bullet list: max 4)
4. Perfect for readers who... (1 sentence)

Keep it under 200 words total."""
    return _ask(system, user, max_tokens=400)


# ── Mood-based Semantic Recommendations ──────────────────────────────────────

def semantic_mood_recommend(mood: str, genre: Optional[str], books_json: str) -> List[int]:
    """
    Uses Gemini to semantically match a mood to books.
    Returns a list of book IDs ordered by relevance.
    """
    model = _client()
    if not model:
        return []

    system = (
        "You are a book matchmaker who understands emotional resonance deeply. "
        "Return ONLY a JSON array of book IDs, nothing else."
    )
    user = f"""Mood I'm feeling: {mood}
{"Preferred genre: " + genre if genre else "No genre preference."}

Books available (ID | Title | Author | Genre | Moods):
{books_json}

Return the 6 book IDs that best match this mood semantically (consider emotional resonance, not just tags).
Respond with ONLY a JSON array, e.g.: [3, 12, 7, 1, 19, 5]"""

    raw = _ask(system, user, max_tokens=80)
    try:
        match = re.search(r"\[[\d,\s]+\]", raw)
        if match:
            return json.loads(match.group())
    except Exception:
        pass
    return []


# ── Mood Journal → Book Recommendations ───────────────────────────────────────

def analyze_mood_journal(journal_text: str, books_json: str) -> dict:
    system = (
        "You are an empathetic AI librarian who reads between the lines of what people write "
        "and recommends books that meet them exactly where they are emotionally. "
        "Respond ONLY with valid JSON."
    )
    user = f"""A reader shared this today:
"{journal_text}"

Available books (ID | Title | Author | Moods):
{books_json}

Respond with this exact JSON structure:
{{
  "mood_analysis": "2-sentence empathetic interpretation of their emotional state",
  "detected_moods": ["mood1", "mood2"],
  "book_ids": [id1, id2, id3, id4],
  "recommendation_reason": "1-2 sentences on why these books fit their state right now"
}}"""

    raw = _ask(system, user, max_tokens=400)
    try:
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception:
        pass
    return {
        "mood_analysis": "I can sense the depth of your feelings. Here are some books that might resonate.",
        "detected_moods": [],
        "book_ids": [],
        "recommendation_reason": "These stories mirror complex human emotions.",
    }


# ── AI Librarian Chat ─────────────────────────────────────────────────────────

def librarian_chat(message: str, history: list, books_json: str) -> dict:
    system = f"""You are the MoodReads AI Librarian — warm, knowledgeable, and intuitive.
You curate books from this collection:
{books_json}

When recommending books, embed a JSON block at the very end of your response (on its own line):
BOOK_IDS:[id1,id2,id3]

Be conversational, cite specific books by title, and give brief reasons why each fits."""

    raw = _ask(system, message, max_tokens=600, history=history)

    book_ids = []
    clean_text = raw
    id_match = re.search(r"BOOK_IDS:\[([\d,\s]*)\]", raw)
    if id_match:
        try:
            book_ids = [int(x.strip()) for x in id_match.group(1).split(",") if x.strip()]
            clean_text = raw[: id_match.start()].strip()
        except Exception:
            pass

    return {"response": clean_text, "book_ids": book_ids}