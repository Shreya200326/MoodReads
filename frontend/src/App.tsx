import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import StarryBackground from './components/StarryBackground';
import DayBackground from './components/DayBackground';
import Landing from './pages/Landing';
import Discover from './pages/Discover';
import BookDetail from './pages/BookDetail';
import Library from './pages/Library';
import Login from './pages/Login';
import Register from './pages/Register';
import Community from './pages/Community';

// Inner component so it can access useTheme
function AppInner() {
  const { theme } = useTheme();

  return (
    <BrowserRouter>
      {/* Sky background switches based on theme */}
      {theme === 'light' ? <DayBackground /> : <StarryBackground />}

      {/* Left sidebar with settings + theme toggle */}
      <Sidebar />

      {/* Top navbar */}
      <Navbar />

      <Routes>
        <Route path="/"                    element={<Landing />} />
        <Route path="/discover"            element={<Discover />} />
        <Route path="/books/:id"           element={<BookDetail />} />
        <Route path="/library"             element={<Library />} />
        <Route path="/login"               element={<Login />} />
        <Route path="/register"            element={<Register />} />
        <Route path="/community"           element={<Community />} />
        <Route path="/community/:bookId"   element={<Community />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  );
}