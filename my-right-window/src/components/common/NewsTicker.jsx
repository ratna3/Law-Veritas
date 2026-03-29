import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';

export default function NewsTicker() {
  const [tickerItems, setTickerItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tickerRef = useRef(null);

  useEffect(() => {
    fetchTickerItems();
  }, []);

  const fetchTickerItems = async () => {
    try {
      const { data, error } = await supabase
        .from('news_ticker')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTickerItems(data || []);
    } catch (err) {
      console.warn('News ticker not available:', err.message);
      setTickerItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || tickerItems.length === 0) return null;

  // Determine if a link_url is an internal blog slug or external URL
  const getHref = (linkUrl) => {
    if (!linkUrl) return null;
    if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://')) {
      return linkUrl;
    }
    // Assume it's a blog slug
    return `/blog/${linkUrl}`;
  };

  const isExternal = (linkUrl) => {
    return linkUrl && (linkUrl.startsWith('http://') || linkUrl.startsWith('https://'));
  };

  // Duplicate the items to ensure seamless infinite scrolling
  const tickerContent = [...tickerItems, ...tickerItems];

  return (
    <div className="news-ticker-container" id="news-ticker">
      <div className="news-ticker-label">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
        </svg>
        <span>BREAKING</span>
      </div>
      <div className="news-ticker-track">
        <div className="news-ticker-content" ref={tickerRef}>
          {tickerContent.map((item, index) => {
            const href = getHref(item.link_url);
            const external = isExternal(item.link_url);

            return (
              <span key={`${item.id}-${index}`} className="news-ticker-item">
                {href ? (
                  external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="news-ticker-link"
                    >
                      {item.headline}
                    </a>
                  ) : (
                    <Link to={href} className="news-ticker-link">
                      {item.headline}
                    </Link>
                  )
                ) : (
                  <span className="news-ticker-text">{item.headline}</span>
                )}
                <span className="news-ticker-separator">•</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
