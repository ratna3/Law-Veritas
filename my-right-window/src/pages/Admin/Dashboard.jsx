import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useAuthStore, useBlogStore } from '../../store';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { blogs, fetchBlogs, subscribeToBlogs } = useBlogStore();
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

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

      if (data) {
        setFullName(data.full_name || '');
      }
    };

    fetchBlogs(false); // Fetch all blogs including unpublished
    const channel = subscribeToBlogs();
    loadUserProfile();

    return () => {
      channel?.unsubscribe();
    };
  }, [user, fetchBlogs, subscribeToBlogs]);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;

    setLoading(true);
    try {
      // Delete blog images from storage
      if (blogToDelete.images && blogToDelete.images.length > 0) {
        const imagePaths = blogToDelete.images.map(url => {
          const match = url.match(/images\/(.+)$/);
          return match ? match[1] : null;
        }).filter(Boolean);

        if (imagePaths.length > 0) {
          await supabase.storage.from('images').remove(imagePaths);
        }
      }

      // Delete PDF from storage
      if (blogToDelete.pdf_url) {
        const match = blogToDelete.pdf_url.match(/pdfs\/(.+)$/);
        if (match) {
          await supabase.storage.from('pdfs').remove([match[1]]);
        }
      }

      // Delete blog from database
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogToDelete.id);

      if (error) throw error;

      setShowDeleteModal(false);
      setBlogToDelete(null);
      await fetchBlogs(false);
    } catch (error) {
      alert('Error deleting blog: ' + error.message);
    } finally {
      setLoading(false);
    }
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
    } finally {
      setLoading(false);
    }
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
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSettingsMessage('');
    setLoading(true);

    try {
      let passwordUpdated = false;
      let profileUpdated = false;

      // Update password if provided (check this first)
      if (newPassword || confirmPassword) {
        // Trim whitespace from both passwords before comparing
        const trimmedNewPassword = (newPassword || '').trim();
        const trimmedConfirmPassword = (confirmPassword || '').trim();

        // Debug logging
        console.log('Password Debug:', {
          newPasswordRaw: `"${newPassword}"`,
          confirmPasswordRaw: `"${confirmPassword}"`,
          newPasswordTrimmed: `"${trimmedNewPassword}"`,
          confirmPasswordTrimmed: `"${trimmedConfirmPassword}"`,
          newPasswordLength: trimmedNewPassword.length,
          confirmPasswordLength: trimmedConfirmPassword.length,
          areEqual: trimmedNewPassword === trimmedConfirmPassword,
          charCodes: {
            new: Array.from(trimmedNewPassword).map(c => c.charCodeAt(0)),
            confirm: Array.from(trimmedConfirmPassword).map(c => c.charCodeAt(0))
          }
        });

        // Check if both fields are filled
        if (!trimmedNewPassword || !trimmedConfirmPassword) {
          throw new Error('Both password fields are required');
        }

        // Check if passwords match
        if (trimmedNewPassword !== trimmedConfirmPassword) {
          throw new Error('Passwords do not match');
        }

        // Check minimum length
        if (trimmedNewPassword.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }

        // Update password
        const { error: passwordError } = await supabase.auth.updateUser({
          password: trimmedNewPassword
        });

        if (passwordError) throw passwordError;

        passwordUpdated = true;
        setNewPassword('');
        setConfirmPassword('');
      }

      // Update full name in user_profiles
      if (fullName && fullName.trim()) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({ full_name: fullName.trim(), updated_at: new Date().toISOString() })
          .eq('id', user.id);

        if (profileError) throw profileError;
        profileUpdated = true;
      }

      // Success message
      if (passwordUpdated && profileUpdated) {
        setSettingsMessage('Profile and password updated successfully!');
      } else if (passwordUpdated) {
        setSettingsMessage('Password updated successfully! You can use it on next login.');
      } else if (profileUpdated) {
        setSettingsMessage('Profile updated successfully!');
      } else {
        setSettingsMessage('No changes were made');
      }

      setTimeout(() => setSettingsMessage(''), 5000);
    } catch (error) {
      console.error('Settings update error:', error);
      setSettingsMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
              <p className="text-gray-500 text-sm mt-1">Manage your articles and content</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-200 font-medium"
              >
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
              <div className={`mb-4 px-4 py-3 rounded-xl flex items-center gap-2 ${settingsMessage.includes('Error')
                  ? 'bg-red-50 border border-red-200 text-red-700'
                  : 'bg-green-50 border border-green-200 text-green-700'
                }`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  {settingsMessage.includes('Error') ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  )}
                </svg>
                {settingsMessage}
              </div>
            )}

            <form onSubmit={handleUpdateSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (Read-only)
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password (optional)
                  </label>
                  <input
                    type="password"
                    name="new-password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-dark transition-colors disabled:opacity-50 shadow-elegant"
              >
                {loading ? 'Updating...' : 'Update Settings'}
              </button>
            </form>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Total Articles</h3>
                <p className="text-3xl font-bold text-gray-900">{blogs.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Published</h3>
                <p className="text-3xl font-bold text-green-600">
                  {blogs.filter(b => b.published).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Featured</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {blogs.filter(b => b.featured).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Drafts</h3>
                <p className="text-3xl font-bold text-gold">
                  {blogs.filter(b => !b.published).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Create New Blog Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/editor')}
            className="px-6 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-dark transition-colors shadow-elegant flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Article
          </button>
        </div>

        {/* Blogs Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 mb-2">No articles yet</p>
                        <p className="text-gray-400 text-sm">Create your first article to get started!</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-gray-900 font-medium">{blog.title}</div>
                        <div className="text-gray-400 text-sm truncate max-w-xs">
                          {blog.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {blog.author}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${blog.published
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${blog.featured
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-gray-50 text-gray-500 border border-gray-200'
                          }`}>
                          {blog.featured ? '⭐ Featured' : 'Not Featured'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {formatDate(blog.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/editor/${blog.id}`)}
                            className="px-3 py-1.5 bg-navy/10 text-navy rounded-lg hover:bg-navy/20 transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => togglePublish(blog)}
                            disabled={loading}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            {blog.published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => toggleFeatured(blog)}
                            disabled={loading}
                            className={`px-3 py-1.5 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 ${blog.featured
                                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                              }`}
                          >
                            {blog.featured ? 'Unfeature' : 'Feature'}
                          </button>
                          <button
                            onClick={() => {
                              setBlogToDelete(blog);
                              setShowDeleteModal(true);
                            }}
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-elegant-lg">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 text-center">Confirm Delete</h3>
            <p className="text-gray-500 mb-6 text-center">
              Are you sure you want to delete "{blogToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBlogToDelete(null);
                }}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
