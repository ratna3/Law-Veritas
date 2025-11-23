import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { getMockBlogs, getMockBlogBySlug } from '../data/mockBlogs';

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAdmin: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
  setAdmin: (isAdmin) => set({ isAdmin }),

  initialize: async () => {
    set({ isLoading: true });
    
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      set({ session, user: session.user });
      
      // Check if user is admin
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      set({ isAdmin: profile?.role === 'admin' });
    }
    
    set({ isLoading: false });
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      set({ session, user: session?.user || null });
      
      if (session) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        set({ isAdmin: profile?.role === 'admin' });
      } else {
        set({ isAdmin: false });
      }
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, isAdmin: false });
  },
}));

export const useBlogStore = create((set, get) => ({
  blogs: [],
  currentBlog: null,
  isLoading: false,
  error: null,

  setBlogs: (blogs) => set({ blogs }),
  setCurrentBlog: (blog) => set({ currentBlog: blog }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchBlogs: async (published = true) => {
    set({ isLoading: true, error: null });
    try {
      // Use mock data if Supabase is not configured
      if (!isSupabaseConfigured()) {
        const mockData = await getMockBlogs(published);
        set({ blogs: mockData, isLoading: false });
        return;
      }

      let query = supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (published) {
        query = query.eq('published', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      set({ blogs: data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchBlogBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      // Use mock data if Supabase is not configured
      if (!isSupabaseConfigured()) {
        const mockData = await getMockBlogBySlug(slug);
        set({ currentBlog: mockData, isLoading: false });
        return;
      }

      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      set({ currentBlog: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  subscribeToBlogs: () => {
    // Only subscribe if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      return null;
    }

    const channel = supabase
      .channel('blogs-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blogs' },
        (payload) => {
          const currentBlogs = get().blogs;
          
          if (payload.eventType === 'INSERT') {
            set({ blogs: [payload.new, ...currentBlogs] });
          } else if (payload.eventType === 'UPDATE') {
            set({
              blogs: currentBlogs.map((blog) =>
                blog.id === payload.new.id ? payload.new : blog
              ),
            });
          } else if (payload.eventType === 'DELETE') {
            set({
              blogs: currentBlogs.filter((blog) => blog.id !== payload.old.id),
            });
          }
        }
      )
      .subscribe();

    return channel;
  },
}));
