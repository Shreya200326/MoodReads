import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Sparkles, BookOpen, Bookmark, CheckCircle,
  Clock, Star, Loader2, MessageCircle, Send, X
} from 'lucide-react';
import api from '../api/client';
import { Book, Review, ShelfStatus, UserBook } from '../types';
import VibeRatingModal from '../components/VibeRatingModal';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG: Record<ShelfStatus, { label: string; icon: React.ReactNode; color: string }> = {
  want_to_read: { label: 'Want to Read', icon: <Bookmark size={14} />,     color: 'border-accent-blue/50 text-accent-blue bg-accent-blue/10' },
  reading:      { label: 'Reading',       icon: <BookOpen size={14} />,    color: 'border-accent-violet/50 text-accent-violet bg-accent-violet/10' },
  finished:     { label: 'Finished',      icon: <CheckCircle size={14} />, color: 'border-green-400/50 text-green-400 bg-green-400/10' },
  might_read:   { label: 'Maybe Later',   icon: <Clock size={14} />,       color: 'border-white/20 text-space-600 bg-white/5' },
};

const VIBE_LABELS = [
  { key: 'comfort_score',    label: 'Comfort 🌙',     color: '#38BDF8' },
  { key: 'adventure_score',  label: 'Adventure ⚔️',   color: '#A855F7' },
  { key: 'romance_score',    label: 'Romance ❤️',     color: '#EC4899' },
  { key: 'tear_score',       label: 'Tears 😭',        color: '#60A5FA' },
  { key: 'mind_blown_score', label: 'Mind-blown 🤯',  color: '#F59E0B' },
];

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [shelfEntry, setShelfEntry] = useState<UserBook | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryFetched, setSummaryFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.get(`/books/${id}`),
      api.get(`/books/${id}/reviews`),
      user ? api.get('/users/me/shelf') : Promise.resolve({ data: [] }),
    ]).then(([b, r, shelf]) => {
      setBook(b.data);
      setReviews(r.data);
      const entry = shelf.data.find((s: UserBook) => s.book_id === Number(id));
      if (entry) setShelfEntry(entry);
    }).finally(() => setLoading(false));
  }, [id, user]);

  const fetchSummary = async () => {
    if (summaryFetched || !id) return;
    setSummaryLoading(true);
    try {
      const { data } = await api.get(`/books/${id}/summary`);
      setSummary(data.summary);
      setSummaryFetched(true);
    } finally { setSummaryLoading(false); }
  };

  const handleShelf = async (status: ShelfStatus) => {
    if (!user) { navigate('/login'); return; }
    if (shelfEntry?.status === status) {
      await api.delete(`/users/me/shelf/${id}`);
      setShelfEntry(null);
    } else {
      const { data } = await api.post('/users/me/shelf', { book_id: Number(id), status });
      setShelfEntry(data);
    }
  };

  const sendChat = async () => {
    if (!chatMsg.trim()) return;
    const userMsg = { role: 'user', content: chatMsg };
    setChatHistory(p => [...p, userMsg]);
    setChatMsg('');
    setChatLoading(true);
    try {
      const { data } = await api.post('/ai/librarian', {
        message: `Regarding "${book?.title}" by ${book?.author}: ${chatMsg}`,
        history: chatHistory,
      });
      setChatHistory(p => [...p, { role: 'assistant', content: data.response }]);
    } finally { setChatLoading(false); }
  };

  const avgVibe = (key: string) => {
    if (!reviews.length) return 0;
    return Math.round(reviews.reduce((s, r) => s + (r as any)[key], 0) / reviews.length);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-accent-purple" />
    </div>
  );
  if (!book) return (
    <div className="min-h-screen flex items-center justify-center text-space-600">Book not found.</div>
  );

  const fallback = `https://picsum.photos/seed/book${book.id}/300/450`;

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Back */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-space-600 hover:text-space-200 transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
          {/* Left: Cover + Shelf */}
          <div className="flex flex-col items-center md:items-start gap-5">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl w-56 md:w-full">
              <img src={book.cover_url || fallback} alt={book.title}
                className="w-full object-cover" style={{ aspectRatio: '2/3' }}
                onError={e => { (e.currentTarget).src = fallback; }} />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
            </motion.div>

            {/* Shelf buttons */}
            <div className="w-full space-y-2">
              <p className="text-space-600 text-xs font-medium uppercase tracking-wider mb-2">Add to shelf</p>
              {(Object.entries(STATUS_CONFIG) as [ShelfStatus, typeof STATUS_CONFIG[ShelfStatus]][]).map(([s, cfg]) => (
                <button key={s} onClick={() => handleShelf(s)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
                    ${shelfEntry?.status === s ? cfg.color : 'border-white/10 text-space-600 hover:border-white/20 hover:text-space-200'}`}>
                  {cfg.icon} {cfg.label}
                  {shelfEntry?.status === s && <span className="ml-auto text-xs opacity-60">✓ saved</span>}
                </button>
              ))}
            </div>

            {user && (
              <button onClick={() => setShowRating(true)}
                className="w-full btn-ghost flex items-center justify-center gap-2 text-sm">
                <Star size={14} className="text-accent-pink" /> Rate the Vibes
              </button>
            )}
          </div>

          {/* Right: Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex flex-wrap gap-2 mb-3">
              {book.genre && <span className="tag-genre">{book.genre}</span>}
              {(book.mood_tags ?? []).map(m => <span key={m} className="tag-mood">{m}</span>)}
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-space-200 mb-2">{book.title}</h1>
            <p className="text-space-600 text-xl mb-1">by {book.author}</p>
            <div className="flex gap-4 text-space-600 text-sm mb-6">
              {book.year && <span>{book.year}</span>}
              {book.pages && <span>{book.pages} pages</span>}
              {book.isbn && <span>ISBN {book.isbn}</span>}
            </div>

            {book.description && (
              <p className="text-space-600 leading-relaxed mb-8 text-base">{book.description}</p>
            )}

            {/* AI Summary */}
            <div className="glass rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className="text-accent-purple" />
                  <span className="font-medium text-space-200 text-sm">2-Minute AI Summary</span>
                </div>
                {!summaryFetched && (
                  <button onClick={fetchSummary} disabled={summaryLoading}
                    className="text-xs px-3 py-1.5 rounded-lg bg-accent-purple/20 text-accent-purple
                               border border-accent-purple/30 hover:bg-accent-purple/30 transition-all flex items-center gap-1.5">
                    {summaryLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    {summaryLoading ? 'Generating…' : 'Generate'}
                  </button>
                )}
              </div>
              {summary ? (
                <p className="text-space-600 text-sm leading-relaxed whitespace-pre-line">{summary}</p>
              ) : !summaryLoading ? (
                <p className="text-space-600/50 text-sm italic">Click Generate to get a spoiler-free overview powered by Claude.</p>
              ) : null}
            </div>

            {/* Vibe ratings summary */}
            {reviews.length > 0 && (
              <div className="glass rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={15} className="text-accent-pink" />
                  <span className="font-medium text-space-200 text-sm">Community Vibes ({reviews.length} ratings)</span>
                </div>
                <div className="space-y-3">
                  {VIBE_LABELS.map(v => {
                    const score = avgVibe(v.key);
                    return (
                      <div key={v.key} className="flex items-center gap-3">
                        <span className="text-xs text-space-600 w-28 shrink-0">{v.label}</span>
                        <div className="flex-1 h-1.5 bg-space-800 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${score * 10}%` }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="h-full rounded-full" style={{ backgroundColor: v.color }} />
                        </div>
                        <span className="text-xs font-bold w-6 text-right" style={{ color: v.color }}>{score}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI Librarian chat */}
            <div className="glass rounded-2xl overflow-hidden">
              <button onClick={() => setChatOpen(p => !p)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all">
                <div className="flex items-center gap-2">
                  <MessageCircle size={15} className="text-accent-blue" />
                  <span className="font-medium text-space-200 text-sm">Ask the AI Librarian</span>
                </div>
                <span className="text-space-600 text-xs">{chatOpen ? '▲' : '▼'}</span>
              </button>

              {chatOpen && (
                <div className="border-t border-white/10">
                  <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
                    {chatHistory.length === 0 && (
                      <p className="text-space-600/60 text-xs italic">
                        Ask me anything: "What's the tone like?", "Similar books?", "Is it worth the hype?"
                      </p>
                    )}
                    {chatHistory.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed
                          ${m.role === 'user'
                            ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/20'
                            : 'bg-white/5 text-space-200 border border-white/10'}`}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="glass px-3 py-2 rounded-xl">
                          <Loader2 size={14} className="animate-spin text-accent-blue" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-white/10 p-3 flex gap-2">
                    <input value={chatMsg} onChange={e => setChatMsg(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChat()}
                      placeholder="Ask about this book…" className="input-field flex-1 text-sm py-2" />
                    <button onClick={sendChat} disabled={chatLoading}
                      className="p-2 rounded-xl bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/30 transition-all">
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {showRating && book && (
        <VibeRatingModal book={book} onClose={() => setShowRating(false)}
          onSaved={() => {
            setShowRating(false);
            api.get(`/books/${id}/reviews`).then(r => setReviews(r.data));
          }} />
      )}
    </div>
  );
}
