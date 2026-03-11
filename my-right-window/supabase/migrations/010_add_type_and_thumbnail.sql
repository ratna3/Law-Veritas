-- Add type column to blogs table to differentiate between blogs and news
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'blog' CHECK (type IN ('blog', 'news'));

-- Add thumbnail_url column for JPG thumbnail images
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Create index for type-based queries
CREATE INDEX IF NOT EXISTS idx_blogs_type ON blogs(type);

-- Create index for combined type and published queries
CREATE INDEX IF NOT EXISTS idx_blogs_type_published ON blogs(type, published);

-- Comment for documentation
COMMENT ON COLUMN blogs.type IS 'Type of content: blog or news';
COMMENT ON COLUMN blogs.thumbnail_url IS 'URL to the thumbnail image (JPG) for the blog/news post';
