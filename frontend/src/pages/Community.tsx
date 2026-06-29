import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Users, BookOpen, ArrowLeft, MessageCircle, Trash2 } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
interface Message {
  id: number;
  content: string;
  user_name: string;
  user_id: number;
  created_at: string;
}
interface Room {
  id: number;
  book_id: number;
  book_title: string;
  book_author: string;
  book_cover: string;
  message_count: number;
  last_active: string;
}

// ── Active Room Chat ──────────────────────────────────────────────────────────
function BookChat({ bookId }: { bookId: number }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [messages, setMessages] = useState<Message[]>([]);
  const [bookTitle, setBookTitle] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  useEffect(() => {
    api.get(`/community/rooms/${bookId}`).then((r) => {
      setMessages(r.data.messages);
    });
  }, [bookId]);

  // Also fetch book title
  useEffect(() => {
    api.get(`/books/${bookId}`).then((r) => setBookTitle(r.data.title));
  }, [bookId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll every 10s for new messages
  useEffect(() => {
    const interval = setInterval(() => {
      api.get(`/community/rooms/${bookId}`).then((r) => setMessages(r.data.messages));
    }, 10000);
    return () => clearInterval(interval);
  }, [bookId]);

  const send = async () => {
    if (!text.trim() || sending) return;
    if (!user) { nav("/login"); return; }
    setSending(true);
    try {
      const { data } = await api.post(`/community/rooms/${bookId}/messages`, { content: text });
      setMessages((prev) => [...prev, data]);
      setText("");
    } finally {
      setSending(false);
    }
  };

  const deleteMsg = async (id: number) => {
    await api.delete(`/community/messages/${id}`);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-5rem)] max-w-3xl mx-auto
      ${isLight ? "bg-white/60 rounded-2xl border border-sky-100 shadow-xl" : "glass rounded-2xl"}`}>
      {/* Header */}
      <div className={`flex items-center gap-3 p-4 border-b ${isLight ? "border-sky-100" : "border-white/10"}`}>
        <button onClick={() => nav("/community")}
          className={`p-1.5 rounded-lg transition-all ${isLight ? "hover:bg-sky-50 text-sky-600" : "hover:bg-white/10 text-space-400"}`}>
          <ArrowLeft size={16} />
        </button>
        <MessageCircle size={16} className={isLight ? "text-sky-500" : "text-accent-purple"} />
        <div>
          <p className={`font-semibold text-sm ${isLight ? "text-gray-800" : "text-space-200"}`}>{bookTitle}</p>
          <p className={`text-xs ${isLight ? "text-gray-400" : "text-space-600"}`}>
            {messages.length} messages
          </p>
        </div>
        <Link to={`/books/${bookId}`}
          className={`ml-auto text-xs px-3 py-1.5 rounded-lg transition-all
            ${isLight ? "bg-sky-100 text-sky-600 hover:bg-sky-200" : "glass text-space-400 hover:text-space-200"}`}>
          View Book
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className={`text-center py-16 ${isLight ? "text-gray-400" : "text-space-600"}`}>
            <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No messages yet. Start the discussion!</p>
          </div>
        )}
        <AnimatePresence>
          {messages.map((m) => {
            const isOwn = user?.id === m.user_id;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwn ? "justify-end" : "justify-start"} gap-2 group`}
              >
                {!isOwn && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
                    {m.user_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className={`max-w-[75%]`}>
                  {!isOwn && (
                    <p className={`text-xs mb-1 ${isLight ? "text-gray-400" : "text-space-600"}`}>
                      {m.user_name}
                    </p>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                    ${isOwn
                      ? isLight
                        ? "bg-sky-500 text-white rounded-tr-sm"
                        : "bg-accent-purple/30 text-space-200 border border-accent-purple/30 rounded-tr-sm"
                      : isLight
                        ? "bg-white border border-sky-100 text-gray-700 rounded-tl-sm shadow-sm"
                        : "bg-white/5 border border-white/10 text-space-200 rounded-tl-sm"
                    }`}>
                    {m.content}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs ${isLight ? "text-gray-300" : "text-space-600/60"}`}>
                      {formatTime(m.created_at)}
                    </span>
                    {isOwn && (
                      <button
                        onClick={() => deleteMsg(m.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400/60 hover:text-red-400"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={`p-4 border-t ${isLight ? "border-sky-100" : "border-white/10"}`}>
        {!user ? (
          <div className="text-center">
            <Link to="/login" className={`text-sm ${isLight ? "text-sky-600 underline" : "text-accent-purple underline"}`}>
              Sign in to join the discussion
            </Link>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Share your thoughts..."
              maxLength={1000}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all
                ${isLight
                  ? "bg-sky-50 border border-sky-200 text-gray-800 placeholder:text-gray-400 focus:border-sky-400"
                  : "bg-white/5 border border-white/10 text-space-200 placeholder:text-space-600 focus:border-accent-purple/50"
                }`}
            />
            <button
              onClick={send}
              disabled={sending || !text.trim()}
              className={`p-2.5 rounded-xl transition-all
                ${isLight
                  ? "bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-40"
                  : "bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/30 disabled:opacity-40"
                }`}
            >
              <Send size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


// ── Room List ─────────────────────────────────────────────────────────────────
function RoomList() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    api.get("/community/rooms")
      .then((r) => setRooms(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 pt-6">
        <div className="flex items-center gap-3 mb-2">
          <Users size={22} className={isLight ? "text-sky-500" : "text-accent-purple"} />
          <h1 className={`font-display text-3xl font-bold ${isLight ? "text-gray-800" : "text-space-200"}`}>
            Book Discussions
          </h1>
        </div>
        <p className={`${isLight ? "text-gray-500" : "text-space-600"}`}>
          Join conversations about your favourite books. Visit any book page to start or join its discussion.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className={`w-8 h-8 border-2 rounded-full animate-spin
            ${isLight ? "border-sky-300 border-t-sky-500" : "border-white/20 border-t-accent-purple"}`} />
        </div>
      ) : rooms.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-20">
          <div className="text-5xl mb-4">💬</div>
          <p className={`text-lg mb-2 ${isLight ? "text-gray-600" : "text-space-200"}`}>No discussions yet</p>
          <p className={`text-sm mb-6 ${isLight ? "text-gray-400" : "text-space-600"}`}>
            Open any book and start the conversation!
          </p>
          <Link to="/discover" className="btn-primary inline-flex">Discover Books</Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => nav(`/community/${room.book_id}`)}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all
                ${isLight
                  ? "bg-white border border-sky-100 hover:border-sky-300 hover:shadow-md"
                  : "glass glass-hover"
                }`}
            >
              <img
                src={room.book_cover || `https://covers.openlibrary.org/b/isbn/${room.book_id}-M.jpg`}
                alt={room.book_title}
                className="w-14 h-20 object-cover rounded-xl shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/book${room.book_id}/56/80`; }}
              />
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${isLight ? "text-gray-800" : "text-space-200"}`}>
                  {room.book_title}
                </p>
                <p className={`text-xs mb-2 ${isLight ? "text-gray-400" : "text-space-600"}`}>
                  {room.book_author}
                </p>
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1 text-xs
                    ${isLight ? "text-sky-500" : "text-accent-purple"}`}>
                    <MessageCircle size={11} />
                    {room.message_count} messages
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}


// ── Page router ───────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const { bookId } = useParams<{ bookId?: string }>();

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 md:px-8">
      {bookId ? <BookChat bookId={Number(bookId)} /> : <RoomList />}
    </div>
  );
}