import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaBalanceScale } from 'react-icons/fa';

export default function BlogCard({ blog }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get thumbnail_url first, then fall back to first image
  const thumbnail = blog.thumbnail_url 
    || (blog.images && blog.images.length > 0 ? blog.images[0] : null);

  // Truncate content for preview
  const previewText = blog.content.length > 150 
    ? blog.content.substring(0, 150) + '...' 
    : blog.content;

  return (
    <article className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group">
      {/* Thumbnail */}
      {thumbnail ? (
        <div className="relative h-52 overflow-hidden">
          <img
            src={thumbnail}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="h-52 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
          <FaBalanceScale className="w-12 h-12 text-navy/20" />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.language === 'hi' && (
              <span className="px-3 py-1 text-xs font-medium text-white bg-orange-500 rounded-full">
                हिंदी
              </span>
            )}
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium text-navy bg-navy/5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-navy transition-colors line-clamp-2">
          <Link to={`/blog/${blog.slug}`} className="hover:underline decoration-gold underline-offset-4">
            {blog.title}
          </Link>
        </h3>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-navy/50" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            {blog.author}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gold/70" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {formatDate(blog.created_at)}
          </span>
        </div>

        {/* Preview text */}
        <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">
          {previewText}
        </p>

        {/* Read more link */}
        <Link
          to={`/blog/${blog.slug}`}
          className="inline-flex items-center gap-2 text-navy font-semibold hover:text-gold transition-colors group/link"
        >
          Read Article
          <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>

        {/* PDF indicator */}
        {blog.pdf_url && (
          <div className="mt-5 pt-4 border-t border-gray-100">
            <span className="inline-flex items-center gap-2 text-sm text-gold font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              PDF Document Available
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

BlogCard.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.arrayOf(PropTypes.string),
    pdf_url: PropTypes.string,
    pdf_name: PropTypes.string,
  }).isRequired,
};
