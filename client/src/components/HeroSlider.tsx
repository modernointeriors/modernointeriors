import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import type { HeroSlide } from '@shared/schema';
import { ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

interface HeroSliderProps {
  heroSlides: HeroSlide[];
}

export default function HeroSlider({ heroSlides }: HeroSliderProps) {
  const { language } = useLanguage();
  const [progressKey, setProgressKey] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showLoading, setShowLoading] = useState(true);
  const swiperRef = useRef<any>(null);

  // Restart progress animation when slide changes
  const handleSlideChange = () => {
    setProgressKey(prev => prev + 1);
  };

  // Controlled loading animation
  useEffect(() => {
    if (!heroSlides || heroSlides.length === 0) {
      const startTime = Date.now();
      const duration = 1500; // 1.5 seconds total loading time
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        
        setLoadingProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          // Wait a bit then hide loading screen
          setTimeout(() => {
            setShowLoading(false);
          }, 300);
        }
      }, 16); // 60fps for smoother animation
      
      return () => clearInterval(interval);
    } else {
      setShowLoading(false);
    }
  }, [heroSlides]);

  if ((!heroSlides || heroSlides.length === 0) && showLoading) {
    return (
      <>
        <div className="fixed inset-0 bg-black text-white flex items-center justify-center z-[9999]">
          <div className="text-center">
            <div className="mb-8">
              <img 
                src="/attached_assets/logo.white.png" 
                alt="MODERNO INTERIORS" 
                className="h-24 md:h-32 w-auto mx-auto"
              />
            </div>
            <div className="w-80 mx-auto">
              <Progress 
                value={loadingProgress} 
                className="h-1 bg-white/20" 
              />
            </div>
          </div>
        </div>
        <div className="bg-black text-white min-h-screen"></div>
      </>
    );
  }

  if (!heroSlides || heroSlides.length === 0) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <img 
              src="/attached_assets/logo.white.png" 
              alt="MODERNO INTERIORS" 
              className="h-24 md:h-32 w-auto mx-auto"
            />
          </div>
          <p className="text-lg text-white/80">No hero slides available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white h-screen">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, EffectFade, Navigation]}
        effect="fade"
        fadeEffect={{
          crossFade: false,
        }}
        spaceBetween={0}
        slidesPerView={1}
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        loop={true}
        onSlideChange={handleSlideChange}
        onAutoplayTimeLeft={(s, time, progress) => {
          // Optional: could use this for more precise sync
        }}
        className="js-slider h-screen"
        data-slider-slug="hero"
        data-testid="hero-slider"
      >
        {heroSlides.filter(slide => slide.active).sort((a, b) => a.order - b.order).map((slide) => {
          const getFallbackImage = () => {
            return 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080';
          };

          const backgroundImage = slide.imageData || slide.image || getFallbackImage();
          const title = language === 'vi' ? slide.titleVi : slide.titleEn;
          const subtitle = language === 'vi' ? slide.subtitleVi : slide.subtitleEn;

          const slideContent = (
            <div className="max-w-4xl">
              <h2 className="heading-0 js-slider-slide-title break-words">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xl md:text-2xl font-light text-white/80 mt-4">
                  {subtitle}
                </p>
              )}
            </div>
          );

          return (
            <SwiperSlide key={slide.id} data-testid={`slide-${slide.id}`}>
              <div className="wrapper relative h-screen px-6 md:px-10 lg:px-16">
                <div className="absolute inset-0">
                  <img 
                    src={backgroundImage} 
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                    data-testid={`slide-bg-${slide.id}`}
                    style={{ zIndex: 1 }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getFallbackImage();
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40" style={{ zIndex: 2 }}></div>
                </div>
                
                <div className="relative h-full flex flex-col justify-between z-10">
                  <div className="flex-1 flex items-center">
                    {slide.linkUrl ? (
                      <Link 
                        href={slide.linkUrl} 
                        className="block"
                        data-testid={`slide-link-${slide.id}`}
                      >
                        {slideContent}
                      </Link>
                    ) : (
                      <div>{slideContent}</div>
                    )}
                  </div>
                  
                  {/* Hero Footer */}
                  <div className="flex justify-between items-end pb-8">
                    <div className="flex items-center gap-6 text-white text-sm font-light">
                      <span>Hero Slide</span>
                      {slide.linkText && <span>{slide.linkText}</span>}
                    </div>
                    
                    {/* Navigation Arrows */}
                    <div className="flex gap-4">
                      <button className="swiper-button-prev-custom w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                        &lt;
                      </button>
                      
                      {/* Circular Progress Next Button */}
                      <div className="relative">
                        <button className="swiper-button-next-custom w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors relative z-10">
                          &gt;
                        </button>
                        
                        {/* Circular Progress Line */}
                        <svg 
                          className="absolute inset-0 w-10 h-10 -rotate-90"
                          viewBox="0 0 40 40"
                        >
                          <circle
                            key={progressKey}
                            cx="20"
                            cy="20"
                            r="18"
                            fill="none"
                            stroke="rgba(255,255,255,0.8)"
                            strokeWidth="1"
                            strokeDasharray="113.1"
                            strokeDashoffset="113.1"
                            className="animate-hero-progress"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}