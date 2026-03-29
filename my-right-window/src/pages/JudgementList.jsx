import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Pagination from '../components/blog/Pagination';
import SearchBar from '../components/blog/SearchBar';
import { FaBalanceScale, FaGavel } from 'react-icons/fa';

const ITEMS_PER_PAGE = 12;

const JudgementList = () => {
  const [judgements, setJudgements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);

  useEffect(() => {
    fetchJudgements();
  }, []);

  const fetchJudgements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('judgements')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setJudgements(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJudgements = useMemo(() => {
    let filtered = [...judgements];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(searchLower) ||
          j.court.toLowerCase().includes(searchLower) ||
          j.case_number?.toLowerCase().includes(searchLower) ||
          j.content.toLowerCase().includes(searchLower) ||
          j.author.toLowerCase().includes(searchLower) ||
          j.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (selectedTag) {
      filtered = filtered.filter((j) => j.tags?.includes(selectedTag));
    }

    if (selectedCourt) {
      filtered = filtered.filter((j) => j.court === selectedCourt);
    }

    return filtered;
  }, [judgements, searchTerm, selectedTag, selectedCourt]);

  const allTags = useMemo(() => {
    const tagsSet = new Set();
    judgements.forEach((j) => {
      j.tags?.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [judgements]);

  const allCourts = useMemo(() => {
    const courtsSet = new Set();
    judgements.forEach((j) => {
      if (j.court) courtsSet.add(j.court);
    });
    return Array.from(courtsSet).sort();
  }, [judgements]);

  const totalPages = Math.ceil(filteredJudgements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredJudgements.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 md:pt-28 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy/5 border border-navy/10 rounded-full mb-6">
            <FaGavel className="w-3 h-3 text-gold" />
            <span className="text-sm font-medium text-navy">Landmark Judgements</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 animate-slideUp">
            Landmark <span className="text-navy">Judgements</span>
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto my-6 rounded-full"></div>
          <p className="text-xl text-gray-500 animate-slideUp max-w-2xl mx-auto" style={{ animationDelay: '0.1s' }}>
            Browse landmark court judgements, case analyses, and landmark judicial decisions
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-slideUp max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Court Filter */}
        {allCourts.length > 0 && (
          <div className="mb-6 animate-slideUp" style={{ animationDelay: '0.25s' }}>
            <div className="flex flex-wrap items-center gap-3 justify-center">
              <span className="text-gray-500 font-medium">Filter by court:</span>
              {allCourts.map((court) => (
                <button
                  key={court}
                  onClick={() => {
                    setSelectedCourt(selectedCourt === court ? null : court);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCourt === court
                      ? 'bg-navy text-white shadow-elegant'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-navy hover:text-navy'
                  }`}
                >
                  {court}
                </button>
              ))}
              {selectedCourt && (
                <button
                  onClick={() => setSelectedCourt(null)}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20 transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="mb-10 animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-wrap items-center gap-3 justify-center">
              <span className="text-gray-500 font-medium">Filter by topic:</span>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(selectedTag === tag ? null : tag);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-gold text-white shadow-elegant'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-gold hover:text-gold'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mb-8 text-center">
          <p className="text-gray-500">
            {searchTerm || selectedTag || selectedCourt ? (
              <>
                Found <span className="text-navy font-semibold">{filteredJudgements.length}</span> result
                {filteredJudgements.length !== 1 ? 's' : ''}
              </>
            ) : (
              <>
                Showing <span className="text-navy font-semibold">{judgements.length}</span> landmark judgement
                {judgements.length !== 1 ? 's' : ''}
              </>
            )}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-navy border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Loading landmark judgements...</p>
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
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Error Loading Landmark Judgements</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button onClick={fetchJudgements} className="btn-primary">
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && currentItems.length === 0 && (
          <div className="card-elevated max-w-lg mx-auto p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaGavel className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">No Landmark Judgements Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedTag || selectedCourt
                ? 'Try adjusting your search or filter criteria.'
                : 'Check back soon for new landmark judgements!'}
            </p>
            {(searchTerm || selectedTag || selectedCourt) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag(null);
                  setSelectedCourt(null);
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Judgements Grid */}
        {!isLoading && !error && currentItems.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentItems.map((judgement, index) => (
                <div
                  key={judgement.id}
                  className="animate-slideUp"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <article className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group">
                    {/* Thumbnail */}
                    {judgement.thumbnail_url ? (
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={judgement.thumbnail_url}
                          alt={judgement.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-navy/90 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                            <FaGavel className="inline w-3 h-3 mr-1" />
                            Landmark Judgement
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-52 bg-gradient-to-br from-navy/5 to-gold/5 flex items-center justify-center relative">
                        <FaBalanceScale className="w-12 h-12 text-navy/20" />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-navy/90 text-white text-xs font-medium rounded-full">
                            <FaGavel className="inline w-3 h-3 mr-1" />
                            Landmark Judgement
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      {/* Court & Case Number */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-3 py-1 text-xs font-medium text-gold bg-gold/5 rounded-full border border-gold/10">
                          {judgement.court}
                        </span>
                        {judgement.case_number && (
                          <span className="px-3 py-1 text-xs font-medium text-navy bg-navy/5 rounded-full">
                            {judgement.case_number}
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {judgement.tags && judgement.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {judgement.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs text-gray-500 bg-gray-50 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-navy transition-colors line-clamp-2">
                        <Link to={`/judgement/${judgement.slug}`} className="hover:underline decoration-gold underline-offset-4">
                          {judgement.title}
                        </Link>
                      </h3>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-navy/50" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          {judgement.author}
                        </span>
                        {judgement.judgement_date && (
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gold/70" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {formatDate(judgement.judgement_date)}
                          </span>
                        )}
                      </div>

                      {/* Read more */}
                      <Link
                        to={`/judgement/${judgement.slug}`}
                        className="inline-flex items-center gap-2 text-navy font-semibold hover:text-gold transition-colors group/link"
                      >
                        Read Landmark Judgement
                        <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>

                      {/* PDF indicator */}
                      {judgement.pdf_url && (
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
                </div>
              ))}
            </div>

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

export default JudgementList;
