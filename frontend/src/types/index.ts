export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string | null;
  cover_url: string | null;
  description: string | null;
  mood_tags: string[] | null;
  isbn: string | null;
  pages: number | null;
  year: number | null;
}

export interface UserBook {
  id: number;
  book_id: number;
  status: ShelfStatus;
  added_at: string;
  book: Book;
}

export interface Review {
  id: number;
  user_id: number;
  book_id: number;
  review_text: string | null;
  comfort_score: number;
  adventure_score: number;
  romance_score: number;
  tear_score: number;
  mind_blown_score: number;
  created_at: string;
}

export type ShelfStatus = 'want_to_read' | 'reading' | 'finished' | 'might_read';

export type Mood =
  | 'Happy'
  | 'Sad'
  | 'Heartbroken'
  | 'Motivated'
  | 'Dreamy'
  | 'Peaceful'
  | 'Adventurous'
  | 'Thrilling'
  | 'Romantic'
  | 'Mystery';

export const MOODS: { label: Mood; emoji: string; desc: string; color: string }[] = [
  { label: 'Happy',       emoji: '😊', desc: 'Lighthearted & joyful',   color: 'from-yellow-400/20 to-orange-400/20 border-yellow-400/30 text-yellow-300' },
  { label: 'Sad',         emoji: '😭', desc: 'Need a good cry',         color: 'from-blue-400/20 to-cyan-400/20 border-blue-400/30 text-blue-300' },
  { label: 'Heartbroken', emoji: '💔', desc: 'Mending a broken heart',  color: 'from-red-400/20 to-pink-400/20 border-red-400/30 text-red-300' },
  { label: 'Motivated',   emoji: '🔥', desc: 'Ready to conquer',        color: 'from-orange-400/20 to-red-400/20 border-orange-400/30 text-orange-300' },
  { label: 'Dreamy',      emoji: '🌌', desc: 'Lost in wonder',          color: 'from-purple-400/20 to-violet-400/20 border-purple-400/30 text-purple-300' },
  { label: 'Peaceful',    emoji: '🧘', desc: 'Calm & reflective',       color: 'from-teal-400/20 to-green-400/20 border-teal-400/30 text-teal-300' },
  { label: 'Adventurous', emoji: '⚔️', desc: 'Craving epic journeys',   color: 'from-amber-400/20 to-yellow-400/20 border-amber-400/30 text-amber-300' },
  { label: 'Thrilling',   emoji: '😱', desc: 'On the edge of your seat',color: 'from-red-500/20 to-orange-500/20 border-red-500/30 text-red-300' },
  { label: 'Romantic',    emoji: '❤️', desc: 'In the mood for love',    color: 'from-pink-400/20 to-rose-400/20 border-pink-400/30 text-pink-300' },
  { label: 'Mystery',     emoji: '🕵️', desc: 'Solving secrets',         color: 'from-slate-400/20 to-zinc-400/20 border-slate-400/30 text-slate-300' },
];
