import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, PenLine, Send, Loader2 } from 'lucide-react';
import api from '../api/client';
import { Book, Mood, MOODS, ShelfStatus, UserBook } from '../types';
import BookCard from '../components/BookCard';
import MoodCard from '../components/MoodCard';
import { useAuth } from '../context/AuthContext';

const GENRES = ['Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Literary Fiction', 'Historical Fiction', 'Memoir', 'Thriller', 'Mythology'];

export default function Discover() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [shelf, setShelf] = useState<UserBook[]>([]);
  const [shelfUpdating, setShelfUpdating] = useState<number | null>(null);

  // Journal mode
  const [journalMode, setJournalMode] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [journalResult, setJournalResult] = useState<{ mood_analysis: string; recommendation_reason: string; detected_moods: string[] } | null>(null);
  const [journalLoading, setJournalLoading] = useState(false);

  // Load shelf for logged-in users
  useEffect(() => {
    if (user) api.get('/users/me/shelf').then(r => setShelf(r.data)).catch(() => {});
  }, [user]);

  const shelfStatusFor = useCallback((bookId: number) =>
    shelf.find(s => s.book_id === bookId)?.status ?? null, [shelf]);

  // Fetch books when filters change
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        if (selectedMood && !search) {
          // AI semantic recommendation
          const { data } = await api.post('/ai/recommend', { mood: selectedMood, genre: selectedGenre || null });
          setBooks(data);
        } else {
          const params: Record<string, string> = {};
          if (selectedMood) params.mood = selectedMood;
          if (selectedGenre) params.genre = selectedGenre;
          if (search) params.search = search;
          const { data } = await api.get('/books/', { params });
          setBooks(data);
        }
      } catch {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [selectedMood, selectedGenre, search]);

  const handleShelfAction = async (bookId: number, status: ShelfStatus) => {
    if (!user) { window.location.href = '/login'; return; }
    setShelfUpdating(bookId);
    try {
      const current = shelfStatusFor(bookId);
      if (current === status) {
        await api.delete(`/users/me/shelf/${bookId}`);
        setShelf(p => p.filter(s => s.book_id !== bookId));
      } else {
        const { data } = await api.post('/users/me/shelf', { book_id: bookId, status });
        setShelf(p => [...p.filter(s => s.book_id !== bookId), data]);
      }
    } finally { setShelfUpdating(null); }
  };

  const handleJournal = async () => {
    if (!journalText.trim()) return;
    setJournalLoading(true);
    try {
      const { data } = await api.post('/ai/mood-journal', { journal_text: journalText });
      setJournalResult(data);
      setBooks(data.books);
    } finally { setJournalLoading(false); }
  };

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 pt-6">
        <h1 className="font-display text-4xl md:text-5xl text-space-200 mb-3">
          How are you feeling?
        </h1>
        <p className="text-space-600 text-lg">Pick a mood and we'll find your perfect read.</p>
      </motion.div>

      {/* Toggle: Mood grid vs Journal */}
      <div className="flex justify-center gap-2 mb-8">
        <button onClick={() => setJournalMode(false)}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${!journalMode ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30' : 'text-space-600 hover:text-space-200 hover:bg-white/5'}`}>
          Mood Grid
        </button>
        <button onClick={() => setJournalMode(true)}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${journalMode ? 'bg-accent-pink/20 text-accent-pink border border-accent-pink/30' : 'text-space-600 hover:text-space-200 hover:bg-white/5'}`}>
          <PenLine size={14} /> Mood Journal
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!journalMode ? (
          <motion.div key="mood-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Mood cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
              {MOODS.map(m => (
                <MoodCard key={m.label} mood={m} selected={selectedMood === m.label}
                  onClick={mood => setSelectedMood(p => p === mood ? null : mood)} />
              ))}
            </div>

            {/* Genre + Search filters */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-space-600" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search title or author…"
                  className="input-field pl-9" />
              </div>
              <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}
                className="input-field max-w-[180px] cursor-pointer">
                <option value="">All Genres</option>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </motion.div>
        ) : (
          <motion.div key="journal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto mb-8">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-accent-pink" />
                <span className="text-space-200 font-medium text-sm">Tell Claude how you're feeling</span>
              </div>
              <textarea value={journalText} onChange={e => setJournalText(e.target.value)}
                placeholder="Today I feel like everything is overwhelming and I just want to escape into another world for a while..."
                rows={4} className="input-field resize-none mb-3 text-sm" />
              <button onClick={handleJournal} disabled={journalLoading}
                className="btn-primary flex items-center gap-2 w-full justify-center">
                {journalLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                {journalLoading ? 'Analyzing your mood…' : 'Get My Book Matches'}
              </button>
            </div>

            {journalResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-5 mt-4">
                <p className="text-space-200 text-sm mb-2">{journalResult.mood_analysis}</p>
                <p className="text-space-600 text-xs">{journalResult.recommendation_reason}</p>
                {journalResult.detected_moods.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {journalResult.detected_moods.map(m => (
                      <span key={m} className="tag-mood">{m}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results header */}
      {(selectedMood || search || journalResult) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mb-5">
          <Sparkles size={16} className="text-accent-purple" />
          <span className="text-space-200 font-medium">
            {selectedMood ? `Books for when you're feeling ${selectedMood}` : search ? `Results for "${search}"` : 'Books matched to your mood'}
          </span>
          <span className="text-space-600 text-sm">— {books.length} found</span>
        </motion.div>
      )}

      {/* Book grid */}
      <AnimatePresence>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-accent-purple" />
          </div>
        ) : books.length === 0 && !selectedMood && !search && !journalResult ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-16 text-space-600">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-lg mb-1">Pick a mood to get started</p>
            <p className="text-sm">or search for a book above</p>
          </motion.div>
        ) : books.length === 0 ? (
          <div className="text-center py-16 text-space-600">No books found for this combination.</div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {books.map((book, i) => (
              <motion.div key={book.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}>
                <BookCard book={book} currentStatus={shelfStatusFor(book.id)}
                  onShelfAction={shelfUpdating === book.id ? undefined : handleShelfAction} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
