-- Create judgements table for court judgement articles
CREATE TABLE IF NOT EXISTS public.judgements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  court TEXT NOT NULL,
  case_number TEXT,
  judgement_date DATE,
  author TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  pdf_url TEXT,
  pdf_name TEXT,
  images TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.judgements ENABLE ROW LEVEL SECURITY;

-- Public can read published judgements
CREATE POLICY "Public read published judgements" ON public.judgements
  FOR SELECT USING (published = true);

-- Admin full access
CREATE POLICY "Admin full access judgements" ON public.judgements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
