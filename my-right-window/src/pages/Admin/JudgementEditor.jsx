import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import RichTextEditor from '../../components/common/RichTextEditor';
import { FaGavel } from 'react-icons/fa';

export default function JudgementEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    court: '',
    case_number: '',
    judgement_date: '',
    author: '',
    tags: '',
    published: false,
    featured: false,
    language: 'en',
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadJudgement = async () => {
      try {
        const { data, error } = await supabase
          .from('judgements')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setFormData({
          title: data.title,
          content: data.content,
          court: data.court || '',
          case_number: data.case_number || '',
          judgement_date: data.judgement_date || '',
          author: data.author,
          tags: data.tags?.join(', ') || '',
          published: data.published,
          featured: data.featured || false,
          language: data.language || 'en',
        });

        if (data.thumbnail_url) {
          setThumbnail({ url: data.thumbnail_url, name: 'Current thumbnail' });
        }

        if (data.images) {
          setImages(data.images.map(url => ({ url, alt: '' })));
        }

        if (data.pdf_url) {
          setPdf({ url: data.pdf_url, name: data.pdf_name || 'Document.pdf' });
        }
      } catch (error) {
        alert('Error loading judgement: ' + error.message);
      }
    };

    if (id) {
      loadJudgement();
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
      const fileName = `judgement-thumb-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

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
        const fileName = `judgement-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);

        uploadedImages.push({ url: publicUrl, alt: file.name });
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
      const fileName = `judgement-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pdfs')
        .getPublicUrl(fileName);

      setPdf({ url: publicUrl, name: file.name });
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
      // Generate slug
      let slug = formData.title
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, '-')
        .replace(/[^\p{L}\p{N}\-]/gu, '')
        .replace(/\-{2,}/g, '-')
        .replace(/^-+|-+$/g, '');

      if (!slug || slug.length < 2) {
        slug = `judgement-${Date.now()}`;
      }

      if (!id) {
        slug = `${slug}-${Math.floor(Date.now() / 1000)}`;
      }

      const judgementData = {
        title: formData.title,
        content: formData.content,
        court: formData.court,
        case_number: formData.case_number || null,
        judgement_date: formData.judgement_date || null,
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
        language: formData.language,
        updated_at: new Date().toISOString(),
      };

      if (id) {
        const { error } = await supabase
          .from('judgements')
          .update(judgementData)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('judgements')
          .insert([judgementData]);

        if (error) throw error;
      }

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error saving judgement: ${error.message}${error.details ? ` (${error.details})` : ''}${error.hint ? ` - Hint: ${error.hint}` : ''}`);
    } finally {
      setLoading(false);
    }
  };

  const courtOptions = [
    'Supreme Court of India',
    'Delhi High Court',
    'Bombay High Court',
    'Madras High Court',
    'Calcutta High Court',
    'Karnataka High Court',
    'Allahabad High Court',
    'Gujarat High Court',
    'Rajasthan High Court',
    'Punjab & Haryana High Court',
    'National Company Law Tribunal',
    'National Green Tribunal',
    'Other',
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaGavel className="w-6 h-6 text-gold" />
              <div>
                <h1 className="text-2xl font-serif font-bold text-navy">
                  {id ? 'Edit Judgement' : 'Upload New Judgement'}
                </h1>
                <p className="text-gray-500 text-sm mt-1">Law-gically Yours Admin</p>
              </div>
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
          {/* Basic Info Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-card">
            {/* Language */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Language *</label>
              <div className="flex gap-4">
                <label className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${formData.language === 'en' ? 'bg-navy/10 border-navy text-navy' : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'}`}>
                  <input type="radio" name="language" value="en" checked={formData.language === 'en'} onChange={handleInputChange} className="w-4 h-4 text-navy" />
                  <span className="font-medium">English</span>
                </label>
                <label className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${formData.language === 'hi' ? 'bg-navy/10 border-navy text-navy' : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'}`}>
                  <input type="radio" name="language" value="hi" checked={formData.language === 'hi'} onChange={handleInputChange} className="w-4 h-4 text-navy" />
                  <span className="font-medium">हिंदी (Hindi)</span>
                </label>
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Judgement Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                placeholder="e.g. Kesavananda Bharati v. State of Kerala"
              />
            </div>

            {/* Court */}
            <div className="mb-6">
              <label htmlFor="court" className="block text-sm font-medium text-gray-700 mb-2">
                Court *
              </label>
              <select
                id="court"
                name="court"
                value={formData.court}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
              >
                <option value="">Select Court</option>
                {courtOptions.map(court => (
                  <option key={court} value={court}>{court}</option>
                ))}
              </select>
            </div>

            {/* Case Number & Date row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="case_number" className="block text-sm font-medium text-gray-700 mb-2">
                  Case Number
                </label>
                <input
                  type="text"
                  id="case_number"
                  name="case_number"
                  value={formData.case_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                  placeholder="e.g. SLP(C) No. 12345/2025"
                />
              </div>
              <div>
                <label htmlFor="judgement_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Judgement Date
                </label>
                <input
                  type="date"
                  id="judgement_date"
                  name="judgement_date"
                  value={formData.judgement_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Author */}
            <div className="mb-6">
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Uploaded By *
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content / Summary *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
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
                placeholder="constitutional law, fundamental rights, PIL"
              />
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>

            {/* Thumbnail */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image (JPG/PNG)
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
                  <img src={thumbnail.url} alt="Thumbnail preview" className="w-48 h-32 object-cover rounded-xl border border-gray-200" />
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
                Judgement PDF Document
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
                  <button type="button" onClick={() => setPdf(null)} className="text-red-600 hover:text-red-700 font-medium text-sm">
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Additional Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Images (optional)
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
                      <img src={img.url} alt={img.alt} className="w-full h-32 object-cover rounded-xl border border-gray-200" />
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
                <input type="checkbox" id="published" name="published" checked={formData.published} onChange={handleInputChange} className="w-5 h-5 text-navy border-gray-300 rounded focus:ring-navy" />
                <label htmlFor="published" className="ml-3 text-sm font-medium text-gray-700">
                  Publish immediately
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleInputChange} className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                <label htmlFor="featured" className="ml-3 text-sm font-medium text-gray-700">
                  Feature on homepage
                </label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 bg-navy text-white font-semibold py-3.5 rounded-xl hover:bg-navy-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-elegant"
            >
              {loading ? 'Saving...' : (id ? 'Update Judgement' : 'Upload Judgement')}
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
