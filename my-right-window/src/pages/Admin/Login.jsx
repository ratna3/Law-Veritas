import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useAuthStore } from '../../store';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('[Auth] Starting login process...');

      // Sign in with timeout
      const { data, error: signInError } = await Promise.race([
        supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Login timeout - please try again')), 15000)
        )
      ]);

      console.log('[Auth] Sign in response:', { hasData: !!data, error: signInError });

      if (signInError) {
        console.error('[Auth] Sign in error:', signInError);
        throw signInError;
      }

      if (!data || !data.user) {
        console.error('[Auth] No user data returned');
        throw new Error('Invalid credentials');
      }

      console.log('[Auth] User authenticated:', data.user.id);

      // Check if user has admin role with timeout
      const { data: profile, error: profileError } = await Promise.race([
        supabase
          .from('user_profiles')
          .select('role')
          .eq('id', data.user.id)
          .single(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Profile check timeout - please try again')), 10000)
        )
      ]);

      console.log('[Auth] Profile check:', { profile, profileError });

      if (profileError) {
        console.error('[Auth] Profile error:', profileError);
        await supabase.auth.signOut();
        throw new Error('Failed to verify admin access');
      }

      if (profile?.role !== 'admin') {
        console.error('[Auth] User is not admin:', profile?.role);
        await supabase.auth.signOut();
        throw new Error('Unauthorized: Admin access required');
      }

      console.log('[Auth] Admin verified, navigating to dashboard...');
      setUser(data.user);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('[Auth] Login error:', err);
      setError(err.message || 'An error occurred during login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-navy mb-2">Law-gically Yours</h1>
          <div className="w-16 h-1 bg-gold mx-auto rounded-full"></div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-elegant-lg">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-500 mb-8">Access the Law-gically Yours admin panel</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-all"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-white font-semibold py-3 rounded-xl hover:bg-navy-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-elegant flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          © 2025 Law-gically Yours. All rights reserved.
        </p>
      </div>
    </div>
  );
}
