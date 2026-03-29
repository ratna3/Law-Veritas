import { useState, useCallback, useRef } from 'react';

export default function useIntersectionObserver(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);

  const ref = useCallback((node) => {
    // Disconnect previous observer if the node changes or unmounts
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Only observe if we have a valid node and it hasn't become visible yet
    if (node && !isVisible) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      }, {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -50px 0px',
      });

      observer.observe(node);
      observerRef.current = observer;
    }
  }, [options.threshold, options.rootMargin, isVisible]);

  return [ref, isVisible];
}
