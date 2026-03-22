import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import LawLoader from './components/common/LawLoader';

// Lazy load pages for better performance
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('./pages/Home'));
const BlogList = lazy(() => import('./pages/BlogList'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const About = lazy(() => import('./pages/About'));
const Bareacts = lazy(() => import('./pages/Bareacts'));
const AdminLogin = lazy(() => import('./pages/Admin/Login'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const BlogEditor = lazy(() => import('./pages/Admin/BlogEditor'));
const NewsList = lazy(() => import('./pages/NewsList'));

function App() {
  const { initialize } = useAuthStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    initialize();
    // Keep initial load flag for 6.6s to match LawLoader timing
    const timer = setTimeout(() => setIsInitialLoad(false), 6600);
    return () => clearTimeout(timer);
  }, [initialize]);

  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* Show loader overlay on initial visit — plays full animation regardless of page load */}
        {isInitialLoad && <LawLoader />}
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Navbar /><Home /></>} />
            <Route path="/blogs" element={<><Navbar /><BlogList /></>} />
            <Route path="/blog/:slug" element={<><Navbar /><BlogDetail /></>} />
            <Route path="/about" element={<><Navbar /><About /></>} />
            <Route path="/bareacts" element={<><Navbar /><Bareacts /></>} />
            <Route path="/news" element={<><Navbar /><NewsList /></>} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/editor" element={
              <ProtectedRoute>
                <BlogEditor />
              </ProtectedRoute>
            } />
            <Route path="/admin/editor/:id" element={
              <ProtectedRoute>
                <BlogEditor />
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;


