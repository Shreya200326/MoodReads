import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Compass, Library, Sun, Moon, Settings,
  ChevronLeft, ChevronRight, Users, Star, PenLine,
  TrendingUp, X,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/", label: "Home", icon: BookOpen },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/library", label: "My Library", icon: Library },
  { to: "/community", label: "Community", icon: Users },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const isLight = theme === "light";

  return (
    <>
      {/* Toggle tab */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center
          w-6 h-14 rounded-r-xl transition-all duration-300
          ${isLight
            ? "bg-white/80 border border-sky-200 text-sky-700 shadow-md"
            : "bg-space-900/80 border border-white/10 text-space-400"
          }`}
        aria-label="Toggle sidebar"
      >
        {open ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Backdrop on mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col
              overflow-y-auto pt-20 pb-6 px-4
              ${isLight
                ? "bg-white/90 backdrop-blur-xl border-r border-sky-100 shadow-xl"
                : "bg-space-950/90 backdrop-blur-xl border-r border-white/8"
              }`}
          >
            {/* Close on mobile */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 md:hidden p-1 rounded-lg text-space-600 hover:text-space-200"
            >
              <X size={16} />
            </button>

            {/* User card */}
            {user && (
              <div className={`rounded-2xl p-4 mb-6 ${isLight ? "bg-sky-50 border border-sky-100" : "glass"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${isLight ? "text-gray-800" : "text-space-200"}`}>
                      {user.name}
                    </p>
                    <p className={`text-xs ${isLight ? "text-gray-500" : "text-space-600"}`}>
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="space-y-1 mb-6">
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 px-2
                ${isLight ? "text-gray-400" : "text-space-600"}`}>
                Navigate
              </p>
              {NAV.map(({ to, label, icon: Icon }) => {
                const active = pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${active
                        ? isLight
                          ? "bg-sky-100 text-sky-700 border border-sky-200"
                          : "bg-accent-purple/20 text-accent-purple border border-accent-purple/30"
                        : isLight
                          ? "text-gray-600 hover:bg-sky-50 hover:text-sky-700"
                          : "text-space-600 hover:text-space-200 hover:bg-white/5"
                      }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Quick actions */}
            <div className="space-y-1 mb-6">
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 px-2
                ${isLight ? "text-gray-400" : "text-space-600"}`}>
                Quick
              </p>
              <Link
                to="/discover"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                  ${isLight ? "text-gray-600 hover:bg-sky-50" : "text-space-600 hover:text-space-200 hover:bg-white/5"}`}
              >
                <PenLine size={16} />
                Mood Journal
              </Link>
              <Link
                to="/library"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                  ${isLight ? "text-gray-600 hover:bg-sky-50" : "text-space-600 hover:text-space-200 hover:bg-white/5"}`}
              >
                <Star size={16} />
                Rate Vibes
              </Link>
              <Link
                to="/library"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                  ${isLight ? "text-gray-600 hover:bg-sky-50" : "text-space-600 hover:text-space-200 hover:bg-white/5"}`}
              >
                <TrendingUp size={16} />
                Reading Stats
              </Link>
            </div>

            {/* Divider */}
            <div className={`border-t my-2 ${isLight ? "border-sky-100" : "border-white/8"}`} />

            {/* Settings */}
            <div className="space-y-2 mt-4">
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 px-2
                ${isLight ? "text-gray-400" : "text-space-600"}`}>
                Settings
              </p>

              {/* Theme toggle */}
              <button
                onClick={toggle}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all
                  ${isLight
                    ? "bg-sky-50 border border-sky-100 text-sky-700 hover:bg-sky-100"
                    : "glass text-space-200 hover:bg-white/10"
                  }`}
              >
                <div className="flex items-center gap-3">
                  {isLight ? <Moon size={15} /> : <Sun size={15} />}
                  <span>{isLight ? "Switch to Night" : "Switch to Day"}</span>
                </div>
                {/* Toggle pill */}
                <div className={`w-10 h-5 rounded-full relative transition-colors duration-300
                  ${isLight ? "bg-sky-400" : "bg-accent-purple"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300
                    ${isLight ? "left-5" : "left-0.5"}`} />
                </div>
              </button>

              {/* Font size (visual only for now) */}
              <div className={`px-3 py-3 rounded-xl text-sm ${isLight ? "bg-sky-50 border border-sky-100" : "glass"}`}>
                <p className={`text-xs mb-2 ${isLight ? "text-gray-500" : "text-space-600"}`}>Reading Font Size</p>
                <div className="flex gap-2">
                  {["S", "M", "L"].map((s) => (
                    <button
                      key={s}
                      className={`flex-1 py-1 rounded-lg text-xs font-medium transition-all
                        ${s === "M"
                          ? isLight ? "bg-sky-500 text-white" : "bg-accent-purple text-white"
                          : isLight ? "text-gray-500 hover:bg-sky-100" : "text-space-600 hover:bg-white/10"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Logout */}
            {user && (
              <button
                onClick={() => { logout(); setOpen(false); }}
                className={`mt-auto flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all
                  ${isLight
                    ? "text-red-400 hover:bg-red-50"
                    : "text-red-400/70 hover:text-red-400 hover:bg-red-400/10"
                  }`}
              >
                Sign Out
              </button>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}