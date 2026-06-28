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
        return genai.GenerativeModel("gemini-2.5-flash")
    except ImportError:
        return None


def _ask(system: str, user: str, max_tokens: int = 800, history: list = None) -> str:
    model = _client()
    if not model:
        return _NO_KEY_MSG

    parts = [f"[SYSTEM]\n{system}\n\n"]

    if history:
        for msg in history:
            role = "User" if msg["role"] == "user" else "Assistant"
            parts.append(f"[{role}]\n{msg['content']}\n\n")

    parts.append(f"[User]\n{user}")
    full_prompt = "".join(parts)

    response = model.generate_content(
        full_prompt,
        generation_config={
            "temperature": 0.7,
            "max_output_tokens": max_tokens,
        },
    )

    print(response)

    return response.text



# ── Book Summary ──────────────────────────────────────────────────────────────

def generate_book_summary(title: str, author: str, genre: str, description: str) -> str:
    system = """
You are MoodReads' senior literary editor.

Your job is to write immersive, spoiler-free summaries that make readers excited to start the book.

Rules:
- ALWAYS produce ALL sections below.
- NEVER stop after the opening sentence.
- NEVER mention spoilers.
- Write between 180 and 220 words.
- Use Markdown.
- Be vivid, specific and engaging—not generic.
"""

    user = f"""
Book:
Title: {title}
Author: {author}
Genre: {genre}

Known description:
{description}

Return EXACTLY this format:

## 🌌 Atmosphere
(1-2 evocative sentences describing the feeling of reading this book.)

## 📖 Premise
(3-4 spoiler-free sentences explaining the story.)

## ✨ Why It Stands Out
(2-3 sentences describing the writing style, characters, pacing, or worldbuilding.)

## 🎭 Themes
- Theme 1
- Theme 2
- Theme 3
- Theme 4

## ❤️ Perfect For Readers Who...
(1-2 sentences describing who would enjoy this book.)

Ensure every section is present.
"""

    return _ask(system, user, max_tokens=900)


# ── Mood-based Semantic Recommendations ──────────────────────────────────────

def semantic_mood_recommend(mood: str, genre: Optional[str], books_json: str) -> List[int]:
    model = _client()
    if not model:
        return []

    system = (
        "You are a book matchmaker who understands emotional resonance deeply. "
        "Return ONLY a JSON array of book IDs, nothing else. No explanation."
    )
    user = f"""Mood I'm feeling: {mood}
{"Preferred genre: " + genre if genre else "No genre preference."}

Books available (ID | Title | Author | Genre | Moods):
{books_json}

Return exactly 8 book IDs that best match this mood semantically.
Consider emotional resonance, themes, and atmosphere — not just mood tags.
Respond with ONLY a JSON array, e.g.: [3, 12, 7, 1, 19, 5, 22, 8]"""

    raw = _ask(system, user, max_tokens=100)
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
        "Be perceptive, warm, and specific. Respond ONLY with valid JSON."
    )
    user = f"""A reader shared this today:
"{journal_text}"

Available books (ID | Title | Author | Moods):
{books_json}

Respond with this exact JSON structure:
{{
  "mood_analysis": "2-sentence empathetic interpretation — be specific about what you sense in their words",
  "detected_moods": ["mood1", "mood2", "mood3"],
  "book_ids": [id1, id2, id3, id4, id5],
  "recommendation_reason": "2 sentences on why these specific books fit their emotional state right now"
}}"""

    raw = _ask(system, user, max_tokens=500)
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
    system = f"""You are the MoodReads AI Librarian — deeply well-read, witty, and perceptive.
You have intimate knowledge of every book in this collection:
{books_json}

Give rich, nuanced answers. Reference specific characters, plot structures, writing style,
and emotional impact. Compare to other books when relevant. Be specific, never generic.
If someone asks about tone, mood, or whether to read something — give a real opinion.
Keep responses under 200 words but make them count.

When recommending specific books from the collection, end your response with:
BOOK_IDS:[id1,id2,id3]"""

    raw = _ask(system, message, max_tokens=1000, history=history)

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


# ── Reading Compatibility Score ───────────────────────────────────────────────

def reading_compatibility(user_books: list, other_books: list, user_name: str, other_name: str) -> dict:
    system = (
        "You are a book taste analyst. Analyze two readers' shelves and find their compatibility. "
        "Respond ONLY with valid JSON."
    )
    user_prompt = f"""
{user_name}'s books: {', '.join(user_books[:15])}
{other_name}'s books: {', '.join(other_books[:15])}

Respond with this JSON:
{{
  "score": <0-100 integer>,
  "shared_taste": "1 sentence describing what they both love",
  "you_might_love": ["book title 1", "book title 2", "book title 3"],
  "conversation_starter": "1 fun question they could discuss together"
}}"""

    raw = _ask(system, user_prompt, max_tokens=300)
    try:
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception:
        pass
    return {"score": 50, "shared_taste": "You both love great stories.", "you_might_love": [], "conversation_starter": "What's your all-time favourite book?"}