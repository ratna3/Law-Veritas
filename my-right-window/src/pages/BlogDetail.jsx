import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useBlogStore } from '../store';
import PDFViewer from '../components/blog/PDFViewer';
import ImageGallery from '../components/blog/ImageGallery';
import LikeButton from '../components/blog/LikeButton';
import CommentSection from '../components/blog/CommentSection';
import ShareButtons from '../components/blog/ShareButtons';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentBlog, isLoading, error, fetchBlogBySlug } = useBlogStore();

  useEffect(() => {
    if (slug) {
      fetchBlogBySlug(slug);
    }
  }, [slug, fetchBlogBySlug]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-navy border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !currentBlog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="card-elevated p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Article Not Found</h3>
              <p className="text-gray-500 mb-6">{error || 'The article you are looking for does not exist.'}</p>
              <button onClick={() => navigate('/blogs')} className="btn-primary">
                Back to Insights
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <div className="max-w-4xl mx-auto mb-8">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-navy hover:text-gold transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Insights
          </Link>
        </div>

        {/* Blog Content */}
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-10 animate-slideUp">
            {/* Tags */}
            {currentBlog.tags && currentBlog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {currentBlog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 text-sm font-medium text-navy bg-navy/5 rounded-full border border-navy/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              {currentBlog.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-500 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-navy/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-navy" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 block">{currentBlog.author}</span>
                  <span className="text-sm">Author</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-gray-900 block">{formatDate(currentBlog.created_at)}</span>
                  <span className="text-sm">Published</span>
                </div>
              </div>
              {currentBlog.updated_at !== currentBlog.created_at && (
                <div className="flex items-center gap-2 text-gold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm">Updated {formatDate(currentBlog.updated_at)}</span>
                </div>
              )}
            </div>
          </header>

          {/* Main Content */}
          <div className="mb-12 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <div className="card-elevated p-8 md:p-12">
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {currentBlog.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          {currentBlog.images && currentBlog.images.length > 0 && (
            <div className="mb-12 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <ImageGallery images={currentBlog.images} />
            </div>
          )}

          {/* PDF Viewer */}
          {currentBlog.pdf_url && (
            <div className="mb-12 animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <PDFViewer pdfUrl={currentBlog.pdf_url} pdfName={currentBlog.pdf_name} />
            </div>
          )}

          {/* Engagement Section - Like, Share */}
          <div className="mb-8 py-6 border-y border-gray-200 animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <LikeButton blogId={currentBlog.id} />
                <ShareButtons title={currentBlog.title} />
              </div>
              <Link to="/blogs" className="btn-secondary">
                View All Insights
              </Link>
            </div>
          </div>

          {/* Comments Section */}
          <div className="animate-slideUp" style={{ animationDelay: '0.5s' }}>
            <CommentSection blogId={currentBlog.id} />
          </div>

          {/* Footer Navigation */}
          <footer className="pt-8 mt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Back button */}
              <Link to="/blogs" className="btn-primary">
                ← Back to All Insights
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
