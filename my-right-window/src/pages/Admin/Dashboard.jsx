import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useAuthStore, useBlogStore } from '../../store';
import { FaNewspaper, FaPen, FaGavel } from 'react-icons/fa';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { blogs, fetchBlogs, subscribeToBlogs } = useBlogStore();
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' | 'judgements' | 'ticker'

  // Judgements state
  const [judgements, setJudgements] = useState([]);
  const [judgementToDelete, setJudgementToDelete] = useState(null);
  const [showJudgementDeleteModal, setShowJudgementDeleteModal] = useState(false);

  // Ticker state
  const [tickerItems, setTickerItems] = useState([]);
  const [tickerForm, setTickerForm] = useState({ headline: '', link_url: '' });
  const [editingTickerId, setEditingTickerId] = useState(null);

  // Settings state
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsMessage, setSettingsMessage] = useState('');

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      if (data) setFullName(data.full_name || '');
    };

    fetchBlogs(false);
    const channel = subscribeToBlogs();
    loadUserProfile();
    fetchJudgements();
    fetchTickerItems();

    return () => { channel?.unsubscribe(); };
  }, [user, fetchBlogs, subscribeToBlogs]);

  // ===== JUDGEMENTS =====
  const fetchJudgements = async () => {
    try {
      const { data, error } = await supabase
        .from('judgements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setJudgements(data || []);
    } catch (err) {
      console.warn('Judgements fetch error:', err.message);
      setJudgements([]);
    }
  };

  const toggleJudgementPublish = async (judgement) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('judgements')
        .update({ published: !judgement.published, updated_at: new Date().toISOString() })
        .eq('id', judgement.id);
      if (error) throw error;
      await fetchJudgements();
    } catch (error) {
      alert('Error updating judgement: ' + error.message);
    } finally { setLoading(false); }
  };

  const toggleJudgementFeatured = async (judgement) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('judgements')
        .update({ featured: !judgement.featured, updated_at: new Date().toISOString() })
        .eq('id', judgement.id);
      if (error) throw error;
      await fetchJudgements();
    } catch (error) {
      alert('Error updating featured status: ' + error.message);
    } finally { setLoading(false); }
  };

  const handleDeleteJudgement = async () => {
    if (!judgementToDelete) return;
    setLoading(true);
    try {
      if (judgementToDelete.images?.length > 0) {
        const paths = judgementToDelete.images.map(url => {
          const match = url.match(/images\/(.+)$/);
          return match ? match[1] : null;
        }).filter(Boolean);
        if (paths.length > 0) await supabase.storage.from('images').remove(paths);
      }
      if (judgementToDelete.pdf_url) {
        const match = judgementToDelete.pdf_url.match(/pdfs\/(.+)$/);
        if (match) await supabase.storage.from('pdfs').remove([match[1]]);
      }
      const { error } = await supabase.from('judgements').delete().eq('id', judgementToDelete.id);
      if (error) throw error;
      setShowJudgementDeleteModal(false);
      setJudgementToDelete(null);
      await fetchJudgements();
    } catch (error) {
      alert('Error deleting judgement: ' + error.message);
    } finally { setLoading(false); }
  };

  // ===== TICKER =====
  const fetchTickerItems = async () => {
    try {
      const { data, error } = await supabase
        .from('news_ticker')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setTickerItems(data || []);
    } catch (err) {
      console.warn('Ticker fetch error:', err.message);
      setTickerItems([]);
    }
  };

  const handleTickerSubmit = async (e) => {
    e.preventDefault();
    if (!tickerForm.headline.trim()) return;
    setLoading(true);
    try {
      if (editingTickerId) {
        const { error } = await supabase
          .from('news_ticker')
          .update({ headline: tickerForm.headline, link_url: tickerForm.link_url || null, updated_at: new Date().toISOString() })
          .eq('id', editingTickerId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('news_ticker')
          .insert([{ headline: tickerForm.headline, link_url: tickerForm.link_url || null, display_order: tickerItems.length }]);
        if (error) throw error;
      }
      setTickerForm({ headline: '', link_url: '' });
      setEditingTickerId(null);
      await fetchTickerItems();
    } catch (error) {
      alert('Error saving ticker item: ' + error.message);
    } finally { setLoading(false); }
  };

  const toggleTickerActive = async (item) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('news_ticker')
        .update({ active: !item.active, updated_at: new Date().toISOString() })
        .eq('id', item.id);
      if (error) throw error;
      await fetchTickerItems();
    } catch (error) {
      alert('Error toggling ticker: ' + error.message);
    } finally { setLoading(false); }
  };

  const deleteTickerItem = async (id) => {
    if (!confirm('Delete this ticker headline?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('news_ticker').delete().eq('id', id);
      if (error) throw error;
      await fetchTickerItems();
    } catch (error) {
      alert('Error deleting ticker item: ' + error.message);
    } finally { setLoading(false); }
  };

  const startEditTicker = (item) => {
    setTickerForm({ headline: item.headline, link_url: item.link_url || '' });
    setEditingTickerId(item.id);
  };

  // ===== BLOGS =====
  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;
    setLoading(true);
    try {
      if (blogToDelete.images?.length > 0) {
        const imagePaths = blogToDelete.images.map(url => {
          const match = url.match(/images\/(.+)$/);
          return match ? match[1] : null;
        }).filter(Boolean);
        if (imagePaths.length > 0) await supabase.storage.from('images').remove(imagePaths);
      }
      if (blogToDelete.pdf_url) {
        const match = blogToDelete.pdf_url.match(/pdfs\/(.+)$/);
        if (match) await supabase.storage.from('pdfs').remove([match[1]]);
      }
      const { error } = await supabase.from('blogs').delete().eq('id', blogToDelete.id);
      if (error) throw error;
      setShowDeleteModal(false);
      setBlogToDelete(null);
      await fetchBlogs(false);
    } catch (error) {
      alert('Error deleting blog: ' + error.message);
    } finally { setLoading(false); }
  };

  const togglePublish = async (blog) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ published: !blog.published, updated_at: new Date().toISOString() })
        .eq('id', blog.id);
      if (error) throw error;
      await fetchBlogs(false);
    } catch (error) {
      alert('Error updating blog: ' + error.message);
    } finally { setLoading(false); }
  };

  const toggleFeatured = async (blog) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ featured: !blog.featured, updated_at: new Date().toISOString() })
        .eq('id', blog.id);
      if (error) throw error;
      await fetchBlogs(false);
    } catch (error) {
      alert('Error updating featured status: ' + error.message);
    } finally { setLoading(false); }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSettingsMessage('');
    setLoading(true);
    try {
      let passwordUpdated = false;
      let profileUpdated = false;

      if (newPassword || confirmPassword) {
        const trimmedNew = (newPassword || '').trim();
        const trimmedConfirm = (confirmPassword || '').trim();
        if (!trimmedNew || !trimmedConfirm) throw new Error('Both password fields are required');
        if (trimmedNew !== trimmedConfirm) throw new Error('Passwords do not match');
        if (trimmedNew.length < 8) throw new Error('Password must be at least 8 characters');
        const { error: passwordError } = await supabase.auth.updateUser({ password: trimmedNew });
        if (passwordError) throw passwordError;
        passwordUpdated = true;
        setNewPassword('');
        setConfirmPassword('');
      }

      if (fullName?.trim()) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({ full_name: fullName.trim(), updated_at: new Date().toISOString() })
          .eq('id', user.id);
        if (profileError) throw profileError;
        profileUpdated = true;
      }

      if (passwordUpdated && profileUpdated) setSettingsMessage('Profile and password updated!');
      else if (passwordUpdated) setSettingsMessage('Password updated!');
      else if (profileUpdated) setSettingsMessage('Profile updated!');
      else setSettingsMessage('No changes made');
      setTimeout(() => setSettingsMessage(''), 5000);
    } catch (error) {
      setSettingsMessage('Error: ' + error.message);
    } finally { setLoading(false); }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold text-navy">Law-gically Yours Admin</h1>
              <p className="text-gray-500 text-sm mt-1">Manage your articles, judgements, and content</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/" className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Homepage
              </Link>
              <button onClick={() => setShowSettings(!showSettings)} className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-200 font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-elegant">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Account Settings</h2>
            {settingsMessage && (
              <div className={`mb-4 px-4 py-3 rounded-xl flex items-center gap-2 ${settingsMessage.includes('Error') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                {settingsMessage}
              </div>
            )}
            <form onSubmit={handleUpdateSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (Read-only)</label>
                  <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password (optional)</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent" placeholder="Enter new password" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent" placeholder="Confirm new password" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="px-6 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-dark transition-colors disabled:opacity-50 shadow-elegant">
                {loading ? 'Updating...' : 'Update Settings'}
              </button>
            </form>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-xs font-medium">Articles</h3>
                <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <FaNewspaper className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-gray-500 text-xs font-medium">News</h3>
                <p className="text-2xl font-bold text-blue-600">{blogs.filter(b => b.type === 'news').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <FaGavel className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-gray-500 text-xs font-medium">Judgements</h3>
                <p className="text-2xl font-bold text-amber-600">{judgements.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-xs font-medium">Published</h3>
                <p className="text-2xl font-bold text-green-600">{blogs.filter(b => b.published).length + judgements.filter(j => j.published).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-xs font-medium">Featured</h3>
                <p className="text-2xl font-bold text-purple-600">{blogs.filter(b => b.featured).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-xs font-medium">Ticker</h3>
                <p className="text-2xl font-bold text-gold">{tickerItems.filter(t => t.active).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 ${activeTab === 'articles' ? 'bg-navy text-white shadow-elegant' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            <FaPen className="w-4 h-4" /> Articles & News
          </button>
          <button
            onClick={() => setActiveTab('judgements')}
            className={`px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 ${activeTab === 'judgements' ? 'bg-navy text-white shadow-elegant' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            <FaGavel className="w-4 h-4" /> Judgements
          </button>
          <button
            onClick={() => setActiveTab('ticker')}
            className={`px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 ${activeTab === 'ticker' ? 'bg-navy text-white shadow-elegant' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" /></svg>
            News Ticker
          </button>
        </div>

        {/* ===== ARTICLES TAB ===== */}
        {activeTab === 'articles' && (
          <>
            <div className="mb-6">
              <button onClick={() => navigate('/admin/editor')} className="px-6 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-dark transition-colors shadow-elegant flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Create New Article
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Author</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Featured</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {blogs.length === 0 ? (
                      <tr><td colSpan="7" className="px-6 py-16 text-center"><p className="text-gray-500">No articles yet</p></td></tr>
                    ) : (
                      blogs.map((blog) => (
                        <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-gray-900 font-medium">{blog.title}</div>
                            <div className="text-gray-400 text-sm truncate max-w-xs">{blog.slug}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${blog.type === 'news' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-navy/5 text-navy border border-navy/10'}`}>
                              {blog.type === 'news' ? <><FaNewspaper className="inline w-3 h-3 mr-1" /> News</> : <><FaPen className="inline w-3 h-3 mr-1" /> Blog</>}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{blog.author}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${blog.published ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                              {blog.published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${blog.featured ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                              {blog.featured ? '⭐ Featured' : 'Not Featured'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{formatDate(blog.created_at)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => navigate(`/admin/editor/${blog.id}`)} className="px-3 py-1.5 bg-navy/10 text-navy rounded-lg hover:bg-navy/20 transition-colors text-sm font-medium">Edit</button>
                              <button onClick={() => togglePublish(blog)} disabled={loading} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50">{blog.published ? 'Unpublish' : 'Publish'}</button>
                              <button onClick={() => toggleFeatured(blog)} disabled={loading} className={`px-3 py-1.5 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 ${blog.featured ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}>{blog.featured ? 'Unfeature' : 'Feature'}</button>
                              <button onClick={() => { setBlogToDelete(blog); setShowDeleteModal(true); }} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ===== JUDGEMENTS TAB ===== */}
        {activeTab === 'judgements' && (
          <>
            <div className="mb-6">
              <button onClick={() => navigate('/admin/judgement-editor')} className="px-6 py-3 bg-gold text-white font-semibold rounded-xl hover:bg-gold-dark transition-colors shadow-elegant flex items-center gap-2">
                <FaGavel className="w-5 h-5" />
                Upload New Judgement
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Court</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Case No.</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {judgements.length === 0 ? (
                      <tr><td colSpan="6" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center">
                          <FaGavel className="w-8 h-8 text-gray-300 mb-4" />
                          <p className="text-gray-500 mb-2">No judgements yet</p>
                          <p className="text-gray-400 text-sm">Upload your first court judgement to get started!</p>
                        </div>
                      </td></tr>
                    ) : (
                      judgements.map((j) => (
                        <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-gray-900 font-medium">{j.title}</div>
                            <div className="text-gray-400 text-sm truncate max-w-xs">{j.slug}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-sm">{j.court}</td>
                          <td className="px-6 py-4 text-gray-600 text-sm">{j.case_number || '—'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${j.published ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                              {j.published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{formatDate(j.created_at)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => navigate(`/admin/judgement-editor/${j.id}`)} className="px-3 py-1.5 bg-navy/10 text-navy rounded-lg hover:bg-navy/20 transition-colors text-sm font-medium">Edit</button>
                              <button onClick={() => toggleJudgementPublish(j)} disabled={loading} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50">{j.published ? 'Unpublish' : 'Publish'}</button>
                              <button onClick={() => toggleJudgementFeatured(j)} disabled={loading} className={`px-3 py-1.5 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 ${j.featured ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}>{j.featured ? 'Unfeature' : 'Feature'}</button>
                              <button onClick={() => { setJudgementToDelete(j); setShowJudgementDeleteModal(true); }} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ===== NEWS TICKER TAB ===== */}
        {activeTab === 'ticker' && (
          <>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-card mb-6">
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" /></svg>
                {editingTickerId ? 'Edit Ticker Headline' : 'Add New Ticker Headline'}
              </h3>
              <form onSubmit={handleTickerSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Headline *</label>
                  <input
                    type="text"
                    value={tickerForm.headline}
                    onChange={(e) => setTickerForm(prev => ({ ...prev, headline: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                    placeholder="Breaking: Supreme Court delivers landmark verdict on..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link URL (blog slug or full URL)</label>
                  <input
                    type="text"
                    value={tickerForm.link_url}
                    onChange={(e) => setTickerForm(prev => ({ ...prev, link_url: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                    placeholder="my-blog-slug or https://example.com/article"
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter a blog slug (e.g. my-article-title) or a full external URL</p>
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={loading} className="px-6 py-2.5 bg-navy text-white font-semibold rounded-xl hover:bg-navy-dark transition-colors disabled:opacity-50">
                    {loading ? 'Saving...' : (editingTickerId ? 'Update Headline' : 'Add Headline')}
                  </button>
                  {editingTickerId && (
                    <button type="button" onClick={() => { setEditingTickerId(null); setTickerForm({ headline: '', link_url: '' }); }} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Headline</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Link</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tickerItems.length === 0 ? (
                      <tr><td colSpan="4" className="px-6 py-16 text-center"><p className="text-gray-500">No ticker headlines yet. Add one above!</p></td></tr>
                    ) : (
                      tickerItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-gray-900 font-medium max-w-md truncate">{item.headline}</td>
                          <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">{item.link_url || '—'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                              {item.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => startEditTicker(item)} className="px-3 py-1.5 bg-navy/10 text-navy rounded-lg hover:bg-navy/20 transition-colors text-sm font-medium">Edit</button>
                              <button onClick={() => toggleTickerActive(item)} disabled={loading} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50">{item.active ? 'Deactivate' : 'Activate'}</button>
                              <button onClick={() => deleteTickerItem(item.id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Blog Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-elegant-lg">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 text-center">Confirm Delete</h3>
            <p className="text-gray-500 mb-6 text-center">Are you sure you want to delete &quot;{blogToDelete?.title}&quot;? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => { setShowDeleteModal(false); setBlogToDelete(null); }} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">Cancel</button>
              <button onClick={handleDelete} disabled={loading} className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 font-medium">{loading ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Judgement Modal */}
      {showJudgementDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-elegant-lg">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaGavel className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 text-center">Delete Judgement</h3>
            <p className="text-gray-500 mb-6 text-center">Are you sure you want to delete &quot;{judgementToDelete?.title}&quot;? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => { setShowJudgementDeleteModal(false); setJudgementToDelete(null); }} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">Cancel</button>
              <button onClick={handleDeleteJudgement} disabled={loading} className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 font-medium">{loading ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
