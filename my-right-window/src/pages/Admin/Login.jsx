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
      console.log('🔐 Starting login process...');
      
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

      console.log('✅ Sign in response:', { hasData: !!data, error: signInError });

      if (signInError) {
        console.error('❌ Sign in error:', signInError);
        throw signInError;
      }

      if (!data || !data.user) {
        console.error('❌ No user data returned');
        throw new Error('Invalid credentials');
      }

      console.log('👤 User authenticated:', data.user.id);

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

      console.log('📋 Profile check:', { profile, profileError });

      if (profileError) {
        console.error('❌ Profile error:', profileError);
        await supabase.auth.signOut();
        throw new Error('Failed to verify admin access');
      }

      if (profile?.role !== 'admin') {
        console.error('❌ User is not admin:', profile?.role);
        await supabase.auth.signOut();
        throw new Error('Unauthorized: Admin access required');
      }

      console.log('✅ Admin verified, navigating to dashboard...');
      setUser(data.user);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || 'An error occurred during login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-400 mb-8">Access the My Right Window admin panel</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green transition-colors"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon-green text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
