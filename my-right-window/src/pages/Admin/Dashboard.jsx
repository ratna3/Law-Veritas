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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Manage your blog posts</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors border border-slate-700"
              >
                ⚙️ Settings
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
          <div className="mb-8 bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Account Settings</h2>
            
            {settingsMessage && (
              <div className={`mb-4 px-4 py-3 rounded-lg ${
                settingsMessage.includes('Error') 
                  ? 'bg-red-500/10 border border-red-500 text-red-500'
                  : 'bg-green-500/10 border border-green-500 text-green-500'
              }`}>
                {settingsMessage}
              </div>
            )}

            <form onSubmit={handleUpdateSettings} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email (Read-only)
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-neon-green transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
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
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-neon-green transition-colors"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
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
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-neon-green transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-neon-green text-black font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Settings'}
              </button>
            </form>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Posts</h3>
            <p className="text-3xl font-bold text-white">{blogs.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Published</h3>
            <p className="text-3xl font-bold text-neon-green">
              {blogs.filter(b => b.published).length}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Drafts</h3>
            <p className="text-3xl font-bold text-yellow-500">
              {blogs.filter(b => !b.published).length}
            </p>
          </div>
        </div>

        {/* Create New Blog Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/editor')}
            className="px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            ➕ Create New Blog Post
          </button>
        </div>

        {/* Blogs Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No blog posts yet. Create your first one!
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{blog.title}</div>
                        <div className="text-gray-400 text-sm truncate max-w-xs">
                          {blog.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {blog.author}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          blog.published 
                            ? 'bg-neon-green/20 text-neon-green'
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {formatDate(blog.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/editor/${blog.id}`)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => togglePublish(blog)}
                            disabled={loading}
                            className="px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors text-sm disabled:opacity-50"
                          >
                            {blog.published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => {
                              setBlogToDelete(blog);
                              setShowDeleteModal(true);
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{blogToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBlogToDelete(null);
                }}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
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
