'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  staggerDelay?: number;
}

export function useScrollReveal<T extends HTMLElement>(
  options: UseScrollRevealOptions = {}
) {
  const { threshold = 0.1, rootMargin = '0px 0px -40px 0px', staggerDelay = 60 } = options;
  const containerRef = useRef<T>(null);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.revealIdx);
            if (!isNaN(idx)) {
              setTimeout(() => {
                setVisibleIndices((prev) => {
                  const next = new Set(prev);
                  next.add(idx);
                  return next;
                });
              }, idx * staggerDelay);
              observerRef.current?.unobserve(entry.target);
            }
          }
        });
      },
      { threshold, rootMargin }
    );

    const children = container.querySelectorAll('[data-reveal-idx]');
    children.forEach((child) => observerRef.current?.observe(child));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin, staggerDelay]);

  const getRevealProps = useCallback(
    (index: number) => ({
      'data-reveal-idx': index,
      style: {
        opacity: visibleIndices.has(index) ? 1 : 0,
        transform: visibleIndices.has(index) ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 300ms ease-out, transform 300ms ease-out',
      } as React.CSSProperties,
    }),
    [visibleIndices]
  );

  return { containerRef, getRevealProps, visibleIndices };
}
