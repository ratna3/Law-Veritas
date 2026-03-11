import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useBlogStore } from '../../store';

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchBlogs } = useBlogStore();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    tags: '',
    published: false,
    featured: false,
    type: 'blog',
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setFormData({
          title: data.title,
          content: data.content,
          author: data.author,
          tags: data.tags?.join(', ') || '',
          published: data.published,
          featured: data.featured || false,
          type: data.type || 'blog',
        });

        if (data.thumbnail_url) {
          setThumbnail({ url: data.thumbnail_url, name: 'Current thumbnail' });
        }

        if (data.images) {
          setImages(data.images.map(url => ({
            url,
            alt: ''
          })));
        }

        if (data.pdf_url) {
          setPdf({ url: data.pdf_url, name: data.pdf_name || 'Document.pdf' });
        }
      } catch (error) {
        alert('Error loading blog: ' + error.message);
      }
    };

    if (id) {
      loadBlog();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `thumb-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      setThumbnail({ url: publicUrl, name: file.name });
    } catch (error) {
      alert('Error uploading thumbnail: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadedImages = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        uploadedImages.push({
          url: publicUrl,
          alt: file.name
        });
      }

      setImages(prev => [...prev, ...uploadedImages]);
    } catch (error) {
      alert('Error uploading images: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pdfs')
        .getPublicUrl(filePath);

      setPdf({
        url: publicUrl,
        name: file.name
      });
    } catch (error) {
      alert('Error uploading PDF: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Robust slug generation
      let slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // If slug is empty (e.g. title was only special chars), use timestamp
      if (!slug) {
        slug = `article-${Date.now()}`;
      }

      // Ensure unique slug by appending date if needed (simple collision avoidance)
      // For a more robust solution we'd check DB, but this helps significantly
      if (!id) {
        slug = `${slug}-${Math.floor(Date.now() / 1000)}`;
      }

      const blogData = {
        title: formData.title,
        content: formData.content,
        author: formData.author,
        slug,
        tags: Array.isArray(formData.tags)
          ? formData.tags
          : (formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
        images: Array.isArray(images) ? images.map(img => img.url) : [],
        thumbnail_url: thumbnail?.url || null,
        pdf_url: pdf?.url || null,
        pdf_name: pdf?.name || null,
        published: formData.published,
        featured: formData.featured,
        type: formData.type,
        updated_at: new Date().toISOString(),
      };

      if (id) {
        // Update existing
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('blogs')
          .insert([blogData]);

        if (error) throw error;
      }

      await fetchBlogs();
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error saving blog: ${error.message}${error.details ? ` (${error.details})` : ''}${error.hint ? ` - Hint: ${error.hint}` : ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif font-bold text-navy">
                {id ? 'Edit Article' : 'Create New Article'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">Law-gically Yours Admin</p>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-card">
            {/* Content Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type *
              </label>
              <div className="flex gap-4">
                <label className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${formData.type === 'blog' ? 'bg-navy/10 border-navy text-navy' : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'}`}>
                  <input
                    type="radio"
                    name="type"
                    value="blog"
                    checked={formData.type === 'blog'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-navy"
                  />
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium">Blog Post</span>
                </label>
                <label className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${formData.type === 'news' ? 'bg-gold/10 border-gold text-gold' : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'}`}>
                  <input
                    type="radio"
                    name="type"
                    value="news"
                    checked={formData.type === 'news'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-gold"
                  />
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <span className="font-medium">News Article</span>
                </label>
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                placeholder="Enter article title"
              />
            </div>

            {/* Author */}
            <div className="mb-6">
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                placeholder="Author name"
              />
            </div>

            {/* Content */}
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <div className="mb-3 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100 flex gap-4 flex-wrap">
                <span>**bold**</span>
                <span>*italic*</span>
                <span>[link](url)</span>
                <span>- bullet point</span>
              </div>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={15}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors resize-y"
                placeholder="Write your article content here... (supports markdown)"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                placeholder="legal, corporate, compliance"
              />
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>

            {/* Thumbnail (JPG) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image (JPG/PNG) — displayed as the card image
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleThumbnailUpload}
                disabled={uploading}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-navy file:text-white file:font-medium hover:file:bg-navy-dark cursor-pointer"
              />
              {thumbnail && (
                <div className="mt-4 relative inline-block group">
                  <img
                    src={thumbnail.url}
                    alt="Thumbnail preview"
                    className="w-48 h-32 object-cover rounded-xl border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setThumbnail(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <span className="block text-xs text-gray-500 mt-1">{thumbnail.name}</span>
                </div>
              )}
            </div>

            {/* PDF */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF Document — viewable when article is opened
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                disabled={uploading}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gold file:text-white file:font-medium hover:file:bg-gold-dark cursor-pointer"
              />
              {pdf && (
                <div className="mt-3 flex items-center justify-between p-4 bg-slate-50 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{pdf.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPdf(null)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Additional Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Images (optional gallery)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-navy file:text-white file:font-medium hover:file:bg-navy-dark cursor-pointer"
              />
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-32 object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Publishing Options */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-navy border-gray-300 rounded focus:ring-navy"
                />
                <label htmlFor="published" className="ml-3 text-sm font-medium text-gray-700">
                  Publish immediately
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="featured" className="ml-3 text-sm font-medium text-gray-700">
                  Feature on homepage
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 bg-navy text-white font-semibold py-3.5 rounded-xl hover:bg-navy-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-elegant"
            >
              {loading ? 'Saving...' : (id ? 'Update Article' : 'Create Article')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-8 py-3.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
