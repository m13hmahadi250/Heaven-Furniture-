import React, { useEffect, useRef, useState } from 'react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  id?: string;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  id,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Support fallback for environments without IntersectionObserver
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    // Immediate check if element is already within viewport
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true);
      return;
    }

    // Fail-safe timeout so content is never stuck hidden
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1200 + delay);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(fallbackTimer);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);

    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return (
    <div
      ref={elementRef}
      id={id}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={`transform transition-[opacity,transform] duration-500 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-5'
      } ${className}`}
    >
      {children}
    </div>
  );
};
