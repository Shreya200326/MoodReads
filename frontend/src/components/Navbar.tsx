import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Compass, Library, User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/library',  label: 'My Library', icon: Library },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4
                    bg-space-950/70 backdrop-blur-xl border-b border-white/8">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center
                        group-hover:scale-110 transition-transform">
          <BookOpen size={16} className="text-white" />
        </div>
        <span className="font-display font-bold text-lg text-space-200 tracking-wide">MoodReads</span>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${pathname === to
                ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30'
                : 'text-space-600 hover:text-space-200 hover:bg-white/5'
              }`}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </div>

      {/* Auth */}
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <span className="hidden sm:block text-sm text-space-600 mr-1">Hi, {user.name.split(' ')[0]}</span>
            <Link to="/profile" className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink
                                           flex items-center justify-center hover:scale-110 transition-transform">
              <User size={15} className="text-white" />
            </Link>
            <button onClick={handleLogout}
              className="p-2 rounded-xl text-space-600 hover:text-space-200 hover:bg-white/5 transition-all">
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <Link to="/login" className="flex items-center gap-2 btn-primary text-sm py-2 px-4">
            <LogIn size={15} />
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
