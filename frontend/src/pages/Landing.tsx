import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, Stars, Wand2 } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';

const FEATURES = [
  { icon: Stars,   title: 'Mood-Based Discovery', desc: 'Tell us how you feel. Get books that match your emotional wavelength exactly.' },
  { icon: Wand2,   title: 'AI Summaries',         desc: '2-minute spoiler-free overviews powered by Claude — before you commit to 400 pages.' },
  { icon: BookOpen,title: 'Your Reading Shelf',    desc: 'Track what you\'re reading, what you\'ve finished, and what\'s on your wishlist.' },
  { icon: Sparkles,title: 'Vibe Ratings',          desc: 'Rate books by emotion — Comfort, Adventure, Tears, Romance, Mind-blown.' },
];

const MOODS_PREVIEW = ['Dreamy 🌌', 'Heartbroken 💔', 'Adventurous ⚔️', 'Peaceful 🧘', 'Romantic ❤️', 'Thrilling 😱'];

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarryBackground />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full
                     bg-accent-purple/15 border border-accent-purple/30 text-accent-purple text-sm"
        >
          <Sparkles size={14} />
          AI-powered book discovery
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="font-display text-6xl md:text-8xl font-bold mb-4 leading-tight"
        >
          <span className="bg-gradient-to-r from-space-200 via-accent-violet to-accent-pink bg-clip-text text-transparent">
            Mood
          </span>
          <span className="text-space-200">Reads</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-space-600 text-xl md:text-2xl mb-3 font-light"
        >
          Find books that match your vibe.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-space-600/70 text-base mb-10 max-w-md"
        >
          Tell us your mood. Get a curated reading list with AI-generated summaries — in seconds.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <Link to="/discover" className="btn-primary flex items-center gap-2 text-base px-8 py-3.5">
            <Sparkles size={16} />
            Find My Next Read
          </Link>
          <Link to="/register" className="btn-ghost flex items-center gap-2 text-base px-8 py-3.5">
            <BookOpen size={16} />
            Create Account
          </Link>
        </motion.div>

        {/* Floating mood bubbles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap justify-center gap-2 mt-12 max-w-lg"
        >
          {MOODS_PREVIEW.map((m, i) => (
            <motion.span
              key={m}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.08 }}
              className="px-3 py-1.5 rounded-full text-sm bg-white/5 border border-white/10 text-space-600
                         hover:border-accent-purple/40 hover:text-space-200 transition-all duration-200 cursor-default"
            >
              {m}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative px-6 py-24 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl text-center text-space-200 mb-12"
        >
          Reading, reimagined.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass glass-hover p-6 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple/30 to-accent-pink/20
                              flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon size={18} className="text-accent-purple" />
              </div>
              <h3 className="font-semibold text-space-200 mb-2">{f.title}</h3>
              <p className="text-space-600 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA footer */}
      <section className="relative px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-12 max-w-2xl mx-auto"
        >
          <div className="text-4xl mb-4">🌌</div>
          <h2 className="font-display text-3xl text-space-200 mb-3">Ready to read by the stars?</h2>
          <p className="text-space-600 mb-8">Join MoodReads and let your emotions guide your next great book.</p>
          <Link to="/discover" className="btn-primary inline-flex items-center gap-2">
            <Sparkles size={16} />
            Start Discovering
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
