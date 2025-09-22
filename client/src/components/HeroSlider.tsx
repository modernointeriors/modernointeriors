import { Link } from 'wouter';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import type { Project } from '@shared/schema';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

interface HeroSliderProps {
  projects: Project[];
}

export default function HeroSlider({ projects }: HeroSliderProps) {
  if (!projects || projects.length === 0) {
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
          <p className="text-lg text-white/80">Loading Projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white h-screen">
      <Swiper
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
        className="js-slider h-screen"
        data-slider-slug="hero"
        data-testid="hero-slider"
      >
        {projects.map((project) => {
          // Fallback images for different project types
          const getFallbackImage = (category: string) => {
            switch (category) {
              case 'residential':
                return 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080';
              case 'commercial':
                return 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080';
              case 'architecture':
                return 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080';
              default:
                return 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080';
            }
          };

          // Force fallback for debugging problematic slides
          const isProblematicSlide = project.title.includes('BOUTIQUE') || project.title.includes('INDUSTRIAL') || project.title.includes('SUSTAINABLE');
          
          const backgroundImage = isProblematicSlide 
            ? getFallbackImage(project.category) // Force use fallback for debugging
            : (
                Array.isArray(project.coverImages) && project.coverImages[0] ||
                Array.isArray(project.contentImages) && project.contentImages[0] ||
                Array.isArray(project.galleryImages) && project.galleryImages[0] ||
                project.heroImage ||
                (Array.isArray(project.images) && project.images[0]) ||
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080'
              );

          // Debug logging for each project
          if (project.title.includes('BOUTIQUE') || project.title.includes('INDUSTRIAL') || project.title.includes('SUSTAINABLE')) {
            console.log(`🔍 DEBUG ${project.title}:`, {
              backgroundImage,
              coverImages: project.coverImages,
              heroImage: project.heroImage,
              contentImages: project.contentImages,
              galleryImages: project.galleryImages
            });
          }

          return (
            <SwiperSlide key={project.id} data-testid={`slide-${project.id}`}>
              <div className="wrapper relative h-screen px-6 md:px-10 lg:px-16">
                <div className="absolute inset-0">
                  {/* Debug overlay for problematic slides */}
                  {(project.title.includes('BOUTIQUE') || project.title.includes('INDUSTRIAL') || project.title.includes('SUSTAINABLE')) && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white p-2 text-xs z-50 max-w-xs">
                      DEBUG: {project.title}<br/>
                      IMG: {backgroundImage.substring(0, 50)}...
                    </div>
                  )}
                  
                  <img 
                    src={backgroundImage} 
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    data-testid={`slide-bg-${project.id}`}
                    style={{ zIndex: 1 }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      console.error(`❌ Image failed to load for ${project.title}:`, backgroundImage);
                      target.src = getFallbackImage(project.category);
                    }}
                    onLoad={() => {
                      console.log(`✅ Image loaded successfully for ${project.title}:`, backgroundImage);
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40" style={{ zIndex: 2 }}></div>
                </div>
                
                <div className="relative h-full flex flex-col justify-between z-10">
                  <div className="flex-1 flex items-center">
                    <Link 
                      href={`/project/${project.id}`} 
                      className="block"
                      data-testid={`slide-link-${project.id}`}
                    >
                      <div className="max-w-4xl">
                        <h2 className="heading-0 js-slider-slide-title break-words">
                          {project.title}
                        </h2>
                        
                        <span className="js-slider-slide-type sr-only">Project</span>
                        <span className="js-slider-slide-author sr-only">{project.designer || 'MODERNO INTERIORS Studio'}</span>
                        <time className="js-slider-slide-date sr-only">{project.completionYear || new Date().getFullYear()}</time>
                        <span className="js-slider-slide-published-in sr-only">{project.category}</span>
                      </div>
                    </Link>
                  </div>
                  
                  {/* Hero Footer */}
                  <div className="flex justify-between items-end pb-8">
                    <div className="text-white">
                      <p className="text-sm font-light uppercase tracking-wider mb-1">Article</p>
                      <div className="flex items-center gap-2 text-sm font-light">
                        <span>by</span>
                        <span className="font-medium">{project.designer || 'MODERNO INTERIORS Studio'}</span>
                      </div>
                    </div>
                    
                    {/* Navigation Arrows */}
                    <div className="flex gap-4">
                      <button className="swiper-button-prev-custom w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                        ←
                      </button>
                      <button className="swiper-button-next-custom w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                        →
                      </button>
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