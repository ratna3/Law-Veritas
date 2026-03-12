-- Add language column to blogs table for multilingual support (Hindi & English)
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en' CHECK (language IN ('en', 'hi'));

-- Create index for language-based queries
CREATE INDEX IF NOT EXISTS idx_blogs_language ON blogs(language);

-- Create index for combined language and published queries
CREATE INDEX IF NOT EXISTS idx_blogs_language_published ON blogs(language, published);

-- Comment for documentation
COMMENT ON COLUMN blogs.language IS 'Content language: en (English) or hi (Hindi)';
