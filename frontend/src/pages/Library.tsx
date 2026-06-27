import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Bookmark, CheckCircle, Clock, Loader2, Send, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { UserBook, ShelfStatus } from '../types';
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext';

const TABS: { status: ShelfStatus | 'all'; label: string; icon: React.ReactNode }[] = [
  { status: 'all',          label: 'All Books',     icon: <BookOpen size={14} /> },
  { status: 'reading',      label: 'Reading',       icon: <BookOpen size={14} /> },
  { status: 'want_to_read', label: 'Want to Read',  icon: <Bookmark size={14} /> },
  { status: 'finished',     label: 'Finished',      icon: <CheckCircle size={14} /> },
  { status: 'might_read',   label: 'Maybe Later',   icon: <Clock size={14} /> },
];

interface ChatMsg { role: string; content: string }

export default function Library() {
  const { user } = useAuth();
  const [shelf, setShelf] = useState<UserBook[]>([]);
  const [tab, setTab] = useState<ShelfStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.get('/users/me/shelf').then(r => setShelf(r.data)).finally(() => setLoading(false));
  }, [user]);

  const handleShelfAction = async (bookId: number, status: ShelfStatus) => {
    const current = shelf.find(s => s.book_id === bookId);
    if (current?.status === status) {
      await api.delete(`/users/me/shelf/${bookId}`);
      setShelf(p => p.filter(s => s.book_id !== bookId));
    } else {
      const { data } = await api.post('/users/me/shelf', { book_id: bookId, status });
      setShelf(p => [...p.filter(s => s.book_id !== bookId), data]);
    }
  };

  const sendChat = async () => {
    if (!chatMsg.trim()) return;
    const userMsg = { role: 'user', content: chatMsg };
    setChatHistory(p => [...p, userMsg]);
    setChatMsg('');
    setChatLoading(true);
    try {
      const shelfContext = shelf.map(s => s.book.title).join(', ');
      const { data } = await api.post('/ai/librarian', {
        message: `My shelf has: ${shelfContext}. ${chatMsg}`,
        history: chatHistory,
      });
      setChatHistory(p => [...p, { role: 'assistant', content: data.response }]);
    } finally { setChatLoading(false); }
  };

  const visible = tab === 'all' ? shelf : shelf.filter(s => s.status === tab);

  const countFor = (s: ShelfStatus | 'all') =>
    s === 'all' ? shelf.length : shelf.filter(x => x.status === s).length;

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-20">
      <div className="text-5xl">📚</div>
      <h2 className="font-display text-2xl text-space-200">Your library awaits</h2>
      <p className="text-space-600">Sign in to track your reading journey.</p>
      <Link to="/login" className="btn-primary">Sign In</Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-space-200 mb-1">My Library</h1>
            <p className="text-space-600">{shelf.length} book{shelf.length !== 1 ? 's' : ''} on your shelf</p>
          </div>
          <button onClick={() => setChatOpen(p => !p)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
              ${chatOpen ? 'bg-accent-purple/20 text-accent-purple border-accent-purple/30' : 'border-white/20 text-space-600 hover:text-space-200 hover:border-white/30'}`}>
            <Sparkles size={14} /> AI Librarian
          </button>
        </div>

        <div className={`grid gap-6 ${chatOpen ? 'grid-cols-1 lg:grid-cols-[1fr_340px]' : 'grid-cols-1'}`}>

          {/* Main content */}
          <div>
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {TABS.map(t => (
                <button key={t.status} onClick={() => setTab(t.status)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${tab === t.status
                      ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30'
                      : 'border border-white/10 text-space-600 hover:text-space-200 hover:border-white/20'}`}>
                  {t.icon} {t.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.status ? 'bg-accent-purple/30' : 'bg-white/10'}`}>
                    {countFor(t.status)}
                  </span>
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={28} className="animate-spin text-accent-purple" />
              </div>
            ) : visible.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-20 text-space-600">
                <div className="text-5xl mb-4">{tab === 'all' ? '🌌' : '📖'}</div>
                <p className="text-lg mb-2">
                  {tab === 'all' ? 'Your shelf is empty' : `Nothing here yet`}
                </p>
                <p className="text-sm mb-6">
                  {tab === 'all' ? 'Start discovering books to build your collection.' : `Add books to "${TABS.find(t => t.status === tab)?.label}".`}
                </p>
                <Link to="/discover" className="btn-primary inline-flex">Discover Books</Link>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {visible.map((entry, i) => (
                    <motion.div key={entry.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}>
                      <BookCard book={entry.book} currentStatus={entry.status}
                        onShelfAction={handleShelfAction} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* AI Librarian side panel */}
          <AnimatePresence>
            {chatOpen && (
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                className="glass rounded-2xl overflow-hidden flex flex-col h-[520px] lg:sticky lg:top-24">
                <div className="flex items-center gap-2 p-4 border-b border-white/10">
                  <Sparkles size={15} className="text-accent-purple" />
                  <span className="font-medium text-space-200 text-sm">AI Librarian</span>
                  <p className="text-xs text-space-600 ml-auto">Knows your shelf</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatHistory.length === 0 && (
                    <div className="space-y-2">
                      <p className="text-space-600/60 text-xs italic mb-4">
                        I know what's on your shelf. Ask me anything!
                      </p>
                      {['What should I read next?', 'Which of my books is best for a rainy day?', 'Compare two books I own'].map(s => (
                        <button key={s} onClick={() => setChatMsg(s)}
                          className="w-full text-left text-xs p-2.5 rounded-xl border border-white/10 text-space-600
                                     hover:border-accent-purple/30 hover:text-space-200 transition-all">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  {chatHistory.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[88%] px-3 py-2 rounded-xl text-xs leading-relaxed
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
                        <Loader2 size={13} className="animate-spin text-accent-purple" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 p-3 flex gap-2">
                  <input value={chatMsg} onChange={e => setChatMsg(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChat()}
                    placeholder="Ask anything…" className="input-field flex-1 text-xs py-2" />
                  <button onClick={sendChat} disabled={chatLoading}
                    className="p-2 rounded-xl bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/30 transition-all">
                    <Send size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
