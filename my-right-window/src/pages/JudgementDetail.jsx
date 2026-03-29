import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import DOMPurify from 'dompurify';
import { FaGavel, FaCalendar, FaUser, FaArrowLeft } from 'react-icons/fa';
import ShareButtons from '../components/blog/ShareButtons';
import PDFViewer from '../components/blog/PDFViewer';
import ImageGallery from '../components/blog/ImageGallery';

const JudgementDetail = () => {
  const { slug } = useParams();
  const [judgement, setJudgement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJudgement = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('judgements')
          .select('*')
          .eq('slug', slug)
          .single();

        if (fetchError) throw fetchError;
        setJudgement(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchJudgement();
  }, [slug]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20 md:pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-navy border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-gray-500">Loading judgement...</p>
        </div>
      </div>
    );
  }

  if (error || !judgement) {
    return (
      <div className="min-h-screen bg-white pt-20 md:pt-28 flex items-center justify-center">
        <div className="card-elevated max-w-lg mx-auto p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Judgement Not Found</h3>
          <p className="text-gray-500 mb-6">{error || 'The requested judgement could not be found.'}</p>
          <Link to="/judgements" className="btn-primary">
            Back to Judgements
          </Link>
        </div>
      </div>
    );
  }

  const isHtml = judgement.content.includes('<') && judgement.content.includes('>');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 md:pt-28 pb-16">
      <div className="container mx-auto px-4">
        {/* Back navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <Link
            to="/judgements"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-navy transition-colors font-medium"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Judgements
          </Link>
        </div>

        {/* Judgement Header */}
        <article className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-elegant mb-8">
            {/* Hero Image */}
            {judgement.thumbnail_url && (
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={judgement.thumbnail_url}
                  alt={judgement.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-navy/80 text-white text-xs font-medium rounded-full backdrop-blur-sm mb-3">
                    <FaGavel className="w-3 h-3" />
                    Court Judgement
                  </span>
                </div>
              </div>
            )}

            <div className="p-6 md:p-10">
              {/* Court & Case info */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-4 py-1.5 text-sm font-semibold text-gold bg-gold/5 rounded-full border border-gold/10">
                  {judgement.court}
                </span>
                {judgement.case_number && (
                  <span className="px-4 py-1.5 text-sm font-medium text-navy bg-navy/5 rounded-full">
                    {judgement.case_number}
                  </span>
                )}
                {judgement.language === 'hi' && (
                  <span className="px-3 py-1 text-xs font-medium text-white bg-orange-500 rounded-full">
                    हिंदी
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                {judgement.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-6 pb-6 border-b border-gray-100">
                <span className="flex items-center gap-2">
                  <FaUser className="w-4 h-4 text-navy/50" />
                  <span className="font-medium">{judgement.author}</span>
                </span>
                {judgement.judgement_date && (
                  <span className="flex items-center gap-2">
                    <FaCalendar className="w-4 h-4 text-gold/70" />
                    <span>Decided: {formatDate(judgement.judgement_date)}</span>
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>Published: {formatDate(judgement.created_at)}</span>
                </span>
              </div>

              {/* Tags */}
              {judgement.tags && judgement.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {judgement.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-medium text-navy bg-navy/5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Content */}
              {isHtml ? (
                <div
                  className="rich-content"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(judgement.content) }}
                />
              ) : (
                <div className="markdown-content whitespace-pre-wrap">
                  {judgement.content}
                </div>
              )}
            </div>
          </div>

          {/* PDF Viewer */}
          {judgement.pdf_url && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-card mb-8 p-6">
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                {judgement.pdf_name || 'Judgement Document'}
              </h3>
              <PDFViewer url={judgement.pdf_url} />
            </div>
          )}

          {/* Image Gallery */}
          {judgement.images && judgement.images.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-card mb-8 p-6">
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">Related Images</h3>
              <ImageGallery images={judgement.images} />
            </div>
          )}

          {/* Share */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-card p-6 mb-8">
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Share this Judgement</h3>
            <ShareButtons title={judgement.title} />
          </div>
        </article>
      </div>
    </div>
  );
};

export default JudgementDetail;
