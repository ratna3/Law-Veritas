import { useEffect, useState, useMemo } from 'react';
import { useBlogStore } from '../store';
import BlogCard from '../components/blog/BlogCard';
import Pagination from '../components/blog/Pagination';
import SearchBar from '../components/blog/SearchBar';

const NEWS_PER_PAGE = 12;

const NewsList = () => {
  const { blogs, isLoading, error, fetchBlogs, subscribeToBlogs } = useBlogStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    fetchBlogs(true);
    const channel = subscribeToBlogs();
    return () => {
      channel?.unsubscribe();
    };
  }, [fetchBlogs, subscribeToBlogs]);

  // Filter only news articles
  const newsArticles = useMemo(() => {
    return blogs.filter(blog => blog.type === 'news');
  }, [blogs]);

  // Filter news based on search and tags
  const filteredNews = useMemo(() => {
    let filtered = [...newsArticles];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchLower) ||
          article.content.toLowerCase().includes(searchLower) ||
          article.author.toLowerCase().includes(searchLower) ||
          article.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (selectedTag) {
      filtered = filtered.filter((article) => article.tags?.includes(selectedTag));
    }

    return filtered;
  }, [newsArticles, searchTerm, selectedTag]);

  // Get unique tags from news articles
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    newsArticles.forEach((article) => {
      article.tags?.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [newsArticles]);

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / NEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * NEWS_PER_PAGE;
  const endIndex = startIndex + NEWS_PER_PAGE;
  const currentNews = filteredNews.slice(startIndex, endIndex);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleTagClick = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-16 md:pt-20 pb-16">
      <div className="container mx-auto px-4 pt-6 md:pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/5 border border-gold/10 rounded-full mb-6">
            <span className="w-2 h-2 bg-gold rounded-full"></span>
            <span className="text-sm font-medium text-gold">Latest Legal News</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 animate-slideUp">
            Legal <span className="text-navy">News</span>
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto my-6 rounded-full"></div>
          <p className="text-xl text-gray-500 animate-slideUp max-w-2xl mx-auto" style={{ animationDelay: '0.1s' }}>
            Stay up to date with the latest legal developments and news
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-slideUp max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="mb-10 animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-wrap items-center gap-3 justify-center">
              <span className="text-gray-500 font-medium">Filter by topic:</span>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTag === tag
                      ? 'bg-navy text-white shadow-elegant'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-navy hover:text-navy'
                    }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20 transition-all"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mb-8 text-center">
          <p className="text-gray-500">
            {searchTerm || selectedTag ? (
              <>
                Found <span className="text-navy font-semibold">{filteredNews.length}</span> result
                {filteredNews.length !== 1 ? 's' : ''}
              </>
            ) : (
              <>
                Showing <span className="text-navy font-semibold">{newsArticles.length}</span> news article
                {newsArticles.length !== 1 ? 's' : ''}
              </>
            )}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-navy border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Loading news...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card-elevated max-w-lg mx-auto p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Error Loading News</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button onClick={() => fetchBlogs(true)} className="btn-primary">
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && currentNews.length === 0 && (
          <div className="card-elevated max-w-lg mx-auto p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">No News Articles Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedTag
                ? 'Try adjusting your search or filter criteria.'
                : 'Check back soon for legal news updates!'}
            </p>
            {(searchTerm || selectedTag) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag(null);
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* News Grid */}
        {!isLoading && !error && currentNews.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentNews.map((article, index) => (
                <div
                  key={article.id}
                  className="animate-slideUp"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <BlogCard blog={article} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default NewsList;
