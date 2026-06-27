import { motion } from 'framer-motion';
import { Mood, MOODS } from '../types';

interface Props {
  mood: { label: Mood; emoji: string; desc: string; color: string };
  selected?: boolean;
  onClick: (mood: Mood) => void;
}

export default function MoodCard({ mood, selected, onClick }: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.06, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(mood.label)}
      className={`relative p-4 rounded-2xl border bg-gradient-to-br text-left transition-all duration-300
        ${mood.color}
        ${selected ? 'ring-2 ring-white/40 shadow-lg scale-105' : 'hover:shadow-md'}`}
    >
      {selected && (
        <motion.div
          layoutId="mood-glow"
          className="absolute inset-0 rounded-2xl bg-white/10"
          initial={false}
        />
      )}
      <div className="text-2xl mb-2">{mood.emoji}</div>
      <div className="font-semibold text-sm">{mood.label}</div>
      <div className="text-xs opacity-70 mt-0.5">{mood.desc}</div>
    </motion.button>
  );
}

export { MOODS };
