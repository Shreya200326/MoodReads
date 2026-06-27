import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import api from '../api/client';
import { Book } from '../types';

interface Props { book: Book; onClose: () => void; onSaved: () => void; }

const VIBES = [
  { key: 'comfort_score',   label: 'Comfort 🌙',    desc: 'How cozy/safe it felt' },
  { key: 'adventure_score', label: 'Adventure ⚔️',  desc: 'Epic scale & excitement' },
  { key: 'romance_score',   label: 'Romance ❤️',    desc: 'Romantic tension/payoff' },
  { key: 'tear_score',      label: 'Tears 😭',       desc: 'Emotional gut-punches' },
  { key: 'mind_blown_score',label: 'Mind-blown 🤯', desc: 'Plot twists & revelations' },
] as const;

export default function VibeRatingModal({ book, onClose, onSaved }: Props) {
  const [scores, setScores] = useState<Record<string, number>>({
    comfort_score: 5, adventure_score: 5, romance_score: 5, tear_score: 5, mind_blown_score: 5,
  });
  const [reviewText, setReviewText] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.post(`/books/${book.id}/reviews`, { ...scores, review_text: reviewText });
      onSaved();
    } finally { setSaving(false); }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass rounded-2xl p-6 w-full max-w-md relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg text-space-600
                                               hover:text-space-200 hover:bg-white/10 transition-all">
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 mb-5">
            <img src={book.cover_url || ''} alt="" className="w-12 h-16 object-cover rounded-lg" />
            <div>
              <h3 className="font-display font-bold text-space-200">{book.title}</h3>
              <p className="text-space-600 text-sm">{book.author}</p>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-space-200 mb-4">Rate the Vibes</h4>

          <div className="space-y-3 mb-4">
            {VIBES.map(vibe => (
              <div key={vibe.key}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-space-200">{vibe.label}</span>
                  <span className="text-sm font-bold text-accent-purple">{scores[vibe.key]}/10</span>
                </div>
                <input
                  type="range" min={0} max={10} value={scores[vibe.key]}
                  onChange={e => setScores(p => ({ ...p, [vibe.key]: +e.target.value }))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                             [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                             [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                             [&::-webkit-slider-thumb]:bg-accent-purple"
                  style={{ background: `linear-gradient(to right, #7C5CFF ${scores[vibe.key] * 10}%, #252B63 ${scores[vibe.key] * 10}%)` }}
                />
              </div>
            ))}
          </div>

          <textarea
            value={reviewText} onChange={e => setReviewText(e.target.value)}
            placeholder="Write a few thoughts... (optional)"
            rows={3}
            className="input-field text-sm resize-none mb-4"
          />

          <button onClick={save} disabled={saving} className="btn-primary w-full justify-center flex items-center gap-2">
            <Star size={15} />
            {saving ? 'Saving…' : 'Save My Rating'}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
