import { motion } from 'framer-motion';
import { BookOpen, Bookmark, CheckCircle, Clock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Book, ShelfStatus } from '../types';

interface Props {
  book: Book;
  currentStatus?: ShelfStatus | null;
  onShelfAction?: (bookId: number, status: ShelfStatus) => void;
  compact?: boolean;
}

const STATUS_CONFIG: Record<ShelfStatus, { icon: React.ReactNode; label: string; color: string }> = {
  want_to_read: { icon: <Bookmark size={12} />, label: 'Want to Read', color: 'text-accent-blue border-accent-blue/40 bg-accent-blue/10' },
  reading:      { icon: <BookOpen size={12} />, label: 'Reading',       color: 'text-accent-violet border-accent-violet/40 bg-accent-violet/10' },
  finished:     { icon: <CheckCircle size={12} />, label: 'Finished',   color: 'text-green-400 border-green-400/40 bg-green-400/10' },
  might_read:   { icon: <Clock size={12} />, label: 'Maybe',            color: 'text-space-600 border-white/20 bg-white/5' },
};

export default function BookCard({ book, currentStatus, onShelfAction, compact = false }: Props) {
  const navigate = useNavigate();
  const fallback = `https://picsum.photos/seed/book${book.id}/200/300`;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative cursor-pointer group"
      onClick={() => navigate(`/books/${book.id}`)}
    >
      {/* Glow on hover */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-accent-purple/30 to-accent-pink/20
                      blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      <div className="glass rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300">
        {/* Cover image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '2/3' }}>
          <img
            src={book.cover_url || fallback}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { (e.currentTarget).src = fallback; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-space-950/80 via-transparent to-transparent" />

          {/* Floating genre tag */}
          {book.genre && (
            <div className="absolute top-2 left-2">
              <span className="tag-genre text-xs">{book.genre.split(' ')[0]}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-space-200 font-semibold text-sm leading-tight line-clamp-2 mb-0.5">
            {book.title}
          </h3>
          <p className="text-space-600 text-xs mb-2">{book.author}</p>

          {/* Mood tags */}
          {!compact && (
            <div className="flex flex-wrap gap-1 mb-3 min-h-[22px]">
              {(book.mood_tags ?? []).slice(0, 2).map(m => (
                <span key={m} className="tag-mood">{m}</span>
              ))}
            </div>
          )}

          {/* Shelf buttons */}
          {onShelfAction && (
            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
              {(['want_to_read', 'reading', 'finished'] as ShelfStatus[]).map(s => {
                const cfg = STATUS_CONFIG[s];
                const active = currentStatus === s;
                return (
                  <button
                    key={s}
                    title={cfg.label}
                    onClick={() => onShelfAction(book.id, s)}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded-lg border text-xs
                                transition-all duration-200 ${active ? cfg.color : 'border-white/10 text-space-600 hover:border-white/30 hover:text-space-200'}`}
                  >
                    {cfg.icon}
                  </button>
                );
              })}
              {!currentStatus && (
                <button
                  title="Add to shelf"
                  onClick={() => onShelfAction(book.id, 'want_to_read')}
                  className="px-2 py-1.5 rounded-lg border border-white/10 text-space-600
                             hover:border-accent-purple/50 hover:text-accent-purple transition-all duration-200"
                >
                  <Plus size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
