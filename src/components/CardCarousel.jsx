import React, { useCallback, useEffect, useRef, useState } from 'react';

export default function CardCarousel({ className = '', label, children }) {
  const trackRef = useRef(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  const getStep = useCallback(() => {
    const track = trackRef.current;
    const first = track && track.firstElementChild;
    if (!track || !first) return 0;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    return first.getBoundingClientRect().width + gap;
  }, []);

  /* Measures how many card-aligned positions exist and which one is active.
     Uses Math.abs(scrollLeft) so it works in both LTR and RTL. */
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = getStep();
    if (step <= 1) {
      setPages(1);
      setPage(0);
      return;
    }
    const overflow = track.scrollWidth - track.clientWidth;
    const total = overflow > 1 ? Math.max(1, Math.round(overflow / step) + 1) : 1;
    setPages(total);
    setPage(Math.min(total - 1, Math.round(Math.abs(track.scrollLeft) / step)));
  }, [getStep]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof window === 'undefined') return undefined;

    measure();
    track.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);

    let observer;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure);
      observer.observe(track);
    }

    return () => {
      track.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      if (observer) observer.disconnect();
    };
  }, [measure]);

  /* Re-measure after renders that change the children (project filter,
     language swap) — deferred one frame so it never cascades a render. */
  useEffect(() => {
    const frame = window.requestAnimationFrame(measure);
    return () => window.cancelAnimationFrame(frame);
  });

  const goTo = useCallback(
    (index) => {
      const track = trackRef.current;
      if (!track) return;
      const step = getStep();
      if (step <= 1) return;
      const isRTL = window.getComputedStyle(track).direction === 'rtl';
      const reduced =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollTo({
        left: (isRTL ? -1 : 1) * step * index,
        behavior: reduced ? 'auto' : 'smooth',
      });
    },
    [getStep]
  );

  return (
    <>
      <div ref={trackRef} className={`wd-carousel ${className}`.trim()}>
        {children}
      </div>

      {pages > 1 && (
        <div
          className="wd-carousel-dots"
          role="group"
          aria-label={label || 'Carousel pagination'}
        >
          {Array.from({ length: pages }, (_, index) => (
            <button
              key={index}
              type="button"
              className={`wd-dot ${index === page ? 'is-active' : ''}`}
              onClick={() => goTo(index)}
              aria-label={`${index + 1} / ${pages}`}
              aria-current={index === page ? 'true' : undefined}
            >
              <span className="wd-dot-core" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
