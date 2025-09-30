import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollableContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function ScrollableContainer({ children, className = "" }: ScrollableContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    checkScrollability();
    const current = scrollRef.current;
    if (current) {
      current.addEventListener('scroll', checkScrollability);
      return () => current.removeEventListener('scroll', checkScrollability);
    }
  }, [children]);

  useEffect(() => {
    // Check scrollability when content changes
    const timeout = setTimeout(checkScrollability, 100);
    return () => clearTimeout(timeout);
  }, [children]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {/* Left Button */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-40 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          data-testid="scroll-left-button"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      )}
      
      {/* Right Button */}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-40 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          data-testid="scroll-right-button"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Scrollable Content */}
      <div 
        ref={scrollRef}
        className={`overflow-x-auto scrollbar-hide ${className}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  );
}