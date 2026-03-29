import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';

// Pixels per second — controls scroll speed consistently regardless of content length
const SCROLL_SPEED = 80;

export default function NewsTicker() {
  const [tickerItems, setTickerItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const trackRef = useRef(null);
  const contentRef = useRef(null);
  const [animationStyle, setAnimationStyle] = useState({});

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

  // Measure widths and compute animation dynamically
  const computeAnimation = useCallback(() => {
    const track = trackRef.current;
    const content = contentRef.current;
    if (!track || !content) return;

    const trackWidth = track.offsetWidth;
    const contentWidth = content.scrollWidth;
    const totalDistance = trackWidth + contentWidth;
    const duration = totalDistance / SCROLL_SPEED;

    setAnimationStyle({
      '--ticker-start': `${trackWidth}px`,
      '--ticker-end': `-${contentWidth}px`,
      '--ticker-duration': `${duration}s`,
    });
  }, []);

  // Recompute on mount, data change, and window resize
  useEffect(() => {
    if (tickerItems.length === 0) return;

    // Small delay to let DOM paint the content first
    const raf = requestAnimationFrame(() => {
      computeAnimation();
    });

    const handleResize = () => computeAnimation();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, [tickerItems, computeAnimation]);

  if (isLoading || tickerItems.length === 0) return null;

  // Determine if a link_url is an internal blog slug or external URL
  const getHref = (linkUrl) => {
    if (!linkUrl) return null;
    if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://')) {
      return linkUrl;
    }
    return `/blog/${linkUrl}`;
  };

  const isExternal = (linkUrl) => {
    return linkUrl && (linkUrl.startsWith('http://') || linkUrl.startsWith('https://'));
  };

  // Render headline items — duplicate for seamless looping
  const renderItems = (items, keyPrefix = '') =>
    items.map((item, index) => {
      const href = getHref(item.link_url);
      const external = isExternal(item.link_url);

      return (
        <span key={`${keyPrefix}${item.id}-${index}`} className="news-ticker-item">
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
    });

  return (
    <div className="news-ticker-container" id="news-ticker">
      <div className="news-ticker-label">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
        </svg>
        <span>BREAKING</span>
      </div>
      <div className="news-ticker-track" ref={trackRef}>
        <div
          className="news-ticker-content"
          ref={contentRef}
          style={animationStyle}
        >
          {renderItems(tickerItems, 'a-')}
          {renderItems(tickerItems, 'b-')}
        </div>
      </div>
    </div>
  );
}
