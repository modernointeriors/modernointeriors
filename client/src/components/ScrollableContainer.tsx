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
    <div className="relative group">
      {/* Left Button */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 flex items-center justify-center"
          data-testid="scroll-left-button"
        >
          <ChevronLeft className="w-5 h-5 text-black" />
        </button>
      )}
      
      {/* Right Button */}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 flex items-center justify-center"
          data-testid="scroll-right-button"
        >
          <ChevronRight className="w-5 h-5 text-black" />
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