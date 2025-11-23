import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder-key';
};

// Create client with conditional realtime support
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: isSupabaseConfigured(),
    persistSession: isSupabaseConfigured(),
    detectSessionInUrl: isSupabaseConfigured()
  },
  realtime: isSupabaseConfigured() ? {
    params: {
      eventsPerSecond: 10
    }
  } : undefined
});

