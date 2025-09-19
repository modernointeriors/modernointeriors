import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import type { Project } from '@shared/schema';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface HeroSliderProps {
  projects: Project[];
}

export default function HeroSlider({ projects }: HeroSliderProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-4">NIVORA</h1>
          <p className="text-lg text-white/80">Loading Projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white relative min-h-screen">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        navigation={true}
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-white/50',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary'
        }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="hero-slider h-screen"
        data-testid="hero-slider"
      >
        {projects.map((project) => {
          const backgroundImage = (
            Array.isArray(project.coverImages) && project.coverImages[0] ||
            Array.isArray(project.contentImages) && project.contentImages[0] ||
            Array.isArray(project.galleryImages) && project.galleryImages[0] ||
            project.heroImage ||
            (Array.isArray(project.images) && project.images[0]) ||
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080'
          );

          return (
            <SwiperSlide key={project.id} data-testid={`slide-${project.id}`}>
              <div className="relative h-screen pt-44 pb-36">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <img 
                    src={backgroundImage} 
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    data-testid={`slide-bg-${project.id}`}
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                </div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-between z-10 px-8 md:px-12 lg:px-16">
                  <Link 
                    href={`/project/${project.id}`} 
                    className="flex-grow group cursor-pointer"
                    data-testid={`slide-link-${project.id}`}
                  >
                    <div className="h-full flex flex-col justify-between max-w-2xl">
                      {/* Main Title */}
                      <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-wider leading-tight group-hover:text-primary transition-colors duration-500">
                        {project.title}
                      </h2>
                      
                      {/* Project Metadata */}
                      <div className="space-y-2 text-white/80">
                        <div className="flex items-center space-x-4 text-sm uppercase tracking-wider">
                          <span className="text-primary font-medium">{project.category}</span>
                          <span className="text-white/60">•</span>
                          <span>{project.location}</span>
                          {project.completionYear && (
                            <>
                              <span className="text-white/60">•</span>
                              <span>{project.completionYear}</span>
                            </>
                          )}
                        </div>
                        
                        {project.designer && (
                          <div className="text-sm text-white/60">
                            By {project.designer}
                          </div>
                        )}
                        
                        {project.area && (
                          <div className="text-sm text-white/60">
                            {project.area}
                          </div>
                        )}
                        
                        <div className="mt-6 inline-block px-4 py-2 border border-white/20 text-xs uppercase tracking-wider hover:border-primary hover:text-primary transition-colors">
                          View Project
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      
    </div>
  );
}