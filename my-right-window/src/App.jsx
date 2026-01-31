import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import GearsLoader from './components/common/GearsLoader';

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

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Suspense fallback={<GearsLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Navbar /><Home /></>} />
            <Route path="/blogs" element={<><Navbar /><BlogList /></>} />
            <Route path="/blog/:slug" element={<><Navbar /><BlogDetail /></>} />
            <Route path="/about" element={<><Navbar /><About /></>} />
            <Route path="/bareacts" element={<><Navbar /><Bareacts /></>} />

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


