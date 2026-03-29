-- Create news_ticker table for horizontal scrolling headlines
CREATE TABLE IF NOT EXISTS public.news_ticker (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  headline TEXT NOT NULL,
  link_url TEXT,
  active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.news_ticker ENABLE ROW LEVEL SECURITY;

-- Public can read active ticker items
CREATE POLICY "Public read active ticker" ON public.news_ticker
  FOR SELECT USING (active = true);

-- Admin full access
CREATE POLICY "Admin full access ticker" ON public.news_ticker
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
