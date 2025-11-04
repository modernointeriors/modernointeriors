import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Trophy, Users2, Target, Eye, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import type { Project, AboutPageContent, AboutCoreValue, AboutTeamMember } from '@shared/schema';
import { useState } from 'react';
import architectureBanner from "@assets/stock_images/modern_luxury_archit_ac188b7b.jpg";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

export default function About() {
  const { language, t } = useLanguage();
  const [progressKey, setProgressKey] = useState(0);
  const [selectedMember, setSelectedMember] = useState<number | null>(0);

  // Fetch projects for hero slider
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Fetch about page content
  const { data: aboutContent } = useQuery<AboutPageContent>({
    queryKey: ["/api/about-page-content"],
  });

  // Fetch core values
  const { data: coreValues = [] } = useQuery<AboutCoreValue[]>({
    queryKey: ["/api/about-core-values"],
    select: (data) => data.filter(v => v.active),
  });

  // Fetch team members
  const { data: teamMembers = [] } = useQuery<AboutTeamMember[]>({
    queryKey: ["/api/about-team-members"],
    select: (data) => data.filter(m => m.active),
  });

  // Get fallback image based on category
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

  // Handle slide change
  const handleSlideChange = () => {
    setProgressKey(prev => prev + 1);
  };

  return (
    <main className="ml-16 pb-8 md:pb-6 mb-4">
      {/* Hero Section - Slider */}
      <section className="relative h-screen min-h-[600px] bg-black overflow-hidden -ml-16">
        <Swiper
          modules={[Autoplay, EffectFade]}
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
          loop={true}
          onSlideChange={handleSlideChange}
          className="h-screen"
        >
          {projects.length > 0 ? projects.map((project) => {
            const backgroundImage = Array.isArray(project.coverImages) && project.coverImages[0] ||
              Array.isArray(project.contentImages) && project.contentImages[0] ||
              Array.isArray(project.galleryImages) && project.galleryImages[0] ||
              project.heroImage ||
              (Array.isArray(project.images) && project.images[0]) ||
              getFallbackImage(project.category);

            return (
              <SwiperSlide key={project.id}>
                <div className="relative h-screen">
                  <img 
                    src={backgroundImage} 
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getFallbackImage(project.category);
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  
                  <div className="relative h-full flex items-center">
                    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left side - Main heading */}
                        <div className="space-y-8">
                          <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-white uppercase tracking-wide">
                              {language === "vi" 
                                ? "THIẾT KẾ KIẾN TRÚC VÀ NỘI THẤT"
                                : "ARCHITECTURAL & INTERIOR DESIGN"
                              }
                            </h1>
                            <div className="w-20 h-0.5 bg-white/40" />
                          </div>
                          <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-xl">
                            {project.title}
                          </p>
                        </div>

                        {/* Right side - Tagline */}
                        <div className="lg:text-right">
                          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 uppercase tracking-wider leading-relaxed">
                            {language === "vi"
                              ? "ĐỔI MỚI TRONG MỌI DỰ ÁN"
                              : "INNOVATION IN EVERY PROJECT"
                            }
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          }) : (
            // Fallback slide when no projects
            <SwiperSlide>
              <div className="relative h-screen">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200")',
                  }}
                >
                  <div className="absolute inset-0 bg-black/50" />
                </div>

                <div className="relative h-full flex items-center">
                  <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      {/* Left side - Main heading */}
                      <div className="space-y-8">
                        <div className="space-y-6">
                          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-white uppercase tracking-wide">
                            {language === "vi" 
                              ? "THIẾT KẾ KIẾN TRÚC VÀ NỘI THẤT"
                              : "ARCHITECTURAL & INTERIOR DESIGN"
                            }
                          </h1>
                          <div className="w-20 h-0.5 bg-white/40" />
                        </div>
                        <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-xl">
                          {language === "vi"
                            ? "Tạo ra những dự án kết hợp hoàn hảo giữa chức năng, thẩm mỹ và công nghệ tiên tiến nhất."
                            : "Creating projects that perfectly combine functionality, aesthetics, and the most advanced technology."
                          }
                        </p>
                      </div>

                      {/* Right side - Tagline */}
                      <div className="lg:text-right">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 uppercase tracking-wider leading-relaxed">
                          {language === "vi"
                            ? "ĐỔI MỚI TRONG MỌI DỰ ÁN"
                            : "INNOVATION IN EVERY PROJECT"
                          }
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </section>

      {/* Principles Section */}
      <section className="py-20 bg-black -ml-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-sm font-light tracking-widest text-white/60 uppercase mb-4">
              {language === "vi" ? "NGUYÊN TẮC LÀM VIỆC" : "OUR PRINCIPLES"}
            </h2>
            <h3 className="text-3xl md:text-4xl font-light text-white uppercase tracking-wide">
              {language === "vi" 
                ? "NỀN TẢNG CỦA CÔNG VIỆC CHÚNG TÔI"
                : "THE FOUNDATION OF OUR WORK"
              }
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Principle 1 */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Sparkles className="w-8 h-8 text-white/40" />
                <h4 className="text-xl font-light text-white uppercase tracking-wide">
                  {language === "vi"
                    ? "SÁNG TẠO & ĐỔI MỚI"
                    : "CREATIVE & INNOVATIVE"
                  }
                </h4>
              </div>
              <p className="text-white/70 font-light leading-relaxed">
                {language === "vi"
                  ? "Luôn đặt sự sáng tạo lên hàng đầu, kết hợp với công nghệ tiên tiến để tạo ra những giải pháp thiết kế độc đáo và hiện đại. Mỗi dự án đều là một tác phẩm nghệ thuật riêng biệt."
                  : "Always putting creativity first, combining with advanced technology to create unique and modern design solutions. Every project is a unique work of art."
                }
              </p>
            </div>

            {/* Principle 2 */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Trophy className="w-8 h-8 text-white/40" />
                <h4 className="text-xl font-light text-white uppercase tracking-wide">
                  {language === "vi"
                    ? "CHẤT LƯỢNG HÀNG ĐẦU"
                    : "QUALITY EXCELLENCE"
                  }
                </h4>
              </div>
              <p className="text-white/70 font-light leading-relaxed">
                {language === "vi"
                  ? "Cam kết mang đến chất lượng hoàn hảo trong từng chi tiết. Từ khâu thiết kế đến thi công, chúng tôi luôn đảm bảo tiêu chuẩn cao nhất để khách hàng hoàn toàn hài lòng."
                  : "Committed to delivering perfect quality in every detail. From design to construction, we always ensure the highest standards for complete customer satisfaction."
                }
              </p>
            </div>

            {/* Principle 3 */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Users2 className="w-8 h-8 text-white/40" />
                <h4 className="text-xl font-light text-white uppercase tracking-wide">
                  {language === "vi"
                    ? "QUẢN LÝ DỰ ÁN 3D/VR"
                    : "3D/VR PROJECT MANAGEMENT"
                  }
                </h4>
              </div>
              <p className="text-white/70 font-light leading-relaxed">
                {language === "vi"
                  ? "Ứng dụng công nghệ BIM và 3D/VR tiên tiến trong quá trình thiết kế, giúp khách hàng hình dung rõ ràng dự án trước khi thi công. Quản lý chuyên nghiệp với đội ngũ giàu kinh nghiệm."
                  : "Advanced BIM and 3D/VR technology application in the design process, helping clients visualize the project clearly before construction. Professional management with experienced teams."
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Showcase Section */}
      <section className="relative h-[80vh] min-h-[600px] bg-black overflow-hidden -ml-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${architectureBanner})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>

        <div className="relative h-full flex items-end">
          {/* Vertical lines with fade effect */}
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="border-r-2 border-white/20" style={{ 
              borderImage: 'linear-gradient(to top, rgba(255,255,255,0.2), rgba(255,255,255,0)) 1' 
            }} />
            <div className="border-r-2 border-white/20" style={{ 
              borderImage: 'linear-gradient(to top, rgba(255,255,255,0.2), rgba(255,255,255,0)) 1' 
            }} />
            <div className="border-r-2 border-white/20" style={{ 
              borderImage: 'linear-gradient(to top, rgba(255,255,255,0.2), rgba(255,255,255,0)) 1' 
            }} />
            <div />
          </div>

          {/* Content grid */}
          <div className="relative w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-end">
            {/* Service 1 */}
            <div className="px-6 py-8 md:px-8 md:py-12">
              <div className="space-y-3 h-[180px] flex flex-col">
                <h4 className="text-base md:text-lg font-light text-white uppercase tracking-wide">
                  {language === "vi" ? "DỊCH VỤ KIẾN TRÚC" : "ARCHITECTURAL SERVICES"}
                </h4>
                <p className="text-white/70 font-light text-xs md:text-sm leading-relaxed">
                  {language === "vi"
                    ? "Dịch vụ thiết kế kiến trúc chuyên nghiệp, từ khảo sát, tư vấn đến hoàn thiện bản vẽ thi công. Chúng tôi cung cấp giải pháp tối ưu cho mọi loại công trình."
                    : "Professional architectural design services, from survey and consultation to construction drawings. We provide optimal solutions for all types of projects."
                  }
                </p>
              </div>
            </div>

            {/* Service 2 */}
            <div className="px-6 py-8 md:px-8 md:py-12">
              <div className="space-y-3 h-[180px] flex flex-col">
                <h4 className="text-base md:text-lg font-light text-white uppercase tracking-wide">
                  {language === "vi" ? "DỊCH VỤ THIẾT KẾ NỘI THẤT" : "INTERIOR DESIGN SERVICES"}
                </h4>
                <p className="text-white/70 font-light text-xs md:text-sm leading-relaxed">
                  {language === "vi"
                    ? "Thiết kế nội thất cao cấp với sự tư vấn từ chuyên gia. Tạo ra không gian sống và làm việc hoàn hảo với phong cách riêng biệt."
                    : "Premium interior design with expert consultation. Creating perfect living and working spaces with distinctive style."
                  }
                </p>
              </div>
            </div>

            {/* Service 3 */}
            <div className="px-6 py-8 md:px-8 md:py-12">
              <div className="space-y-3 h-[180px] flex flex-col">
                <h4 className="text-base md:text-lg font-light text-white uppercase tracking-wide">
                  {language === "vi" ? "MÔ HÌNH BIM VÀ 3D VISUALIZATION" : "BIM MODELING & 3D VISUALIZATION"}
                </h4>
                <p className="text-white/70 font-light text-xs md:text-sm leading-relaxed">
                  {language === "vi"
                    ? "Ứng dụng công nghệ BIM và 3D visualization tiên tiến, giúp khách hàng hình dung rõ ràng dự án trước khi thi công và tối ưu quá trình quản lý."
                    : "Advanced BIM and 3D visualization technology, helping clients clearly visualize projects before construction and optimize management process."
                  }
                </p>
              </div>
            </div>

            {/* Service 4 */}
            <div className="px-6 py-8 md:px-8 md:py-12">
              <div className="space-y-3 h-[180px] flex flex-col">
                <h4 className="text-base md:text-lg font-light text-white uppercase tracking-wide">
                  {language === "vi" ? "THIẾT KẾ CẢNH QUAN" : "LANDSCAPE DESIGN"}
                </h4>
                <p className="text-white/70 font-light text-xs md:text-sm leading-relaxed">
                  {language === "vi"
                    ? "Thiết kế cảnh quan xanh kết hợp với kiến trúc, tạo nên không gian sống hài hòa với thiên nhiên. Mang lại trải nghiệm thư giãn tuyệt vời."
                    : "Green landscape design integrated with architecture, creating living spaces in harmony with nature. Delivering excellent relaxation experience."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black -ml-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-light text-white" data-testid="stats-projects">150+</div>
              <div className="text-sm text-white/60 uppercase tracking-wider">
                {language === "vi" ? "Dự án hoàn thành" : "Projects Completed"}
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-light text-white" data-testid="stats-awards">25+</div>
              <div className="text-sm text-white/60 uppercase tracking-wider">
                {language === "vi" ? "Giải thưởng thiết kế" : "Design Awards"}
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-light text-white" data-testid="stats-clients">200+</div>
              <div className="text-sm text-white/60 uppercase tracking-wider">
                {language === "vi" ? "Khách hàng hài lòng" : "Happy Clients"}
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-light text-white" data-testid="stats-countries">12+</div>
              <div className="text-sm text-white/60 uppercase tracking-wider">
                {language === "vi" ? "Quốc gia" : "Countries"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company History Section */}
      {aboutContent?.historyContentEn && aboutContent?.historyContentVi && (
        <section className="py-20 bg-black -ml-16">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-sm font-light tracking-widest text-white/60 uppercase mb-4">
                {language === "vi" ? "LỊCH SỬ HÌNH THÀNH" : "COMPANY HISTORY"}
              </h2>
              <h3 className="text-3xl md:text-4xl font-light text-white uppercase tracking-wide">
                {language === "vi" ? aboutContent.historyTitleVi : aboutContent.historyTitleEn}
              </h3>
            </div>
            <div className="max-w-4xl">
              <p className="text-white/70 font-light text-lg leading-relaxed whitespace-pre-line">
                {language === "vi" ? aboutContent.historyContentVi : aboutContent.historyContentEn}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision Section */}
      {(aboutContent?.missionContentEn || aboutContent?.visionContentEn) && (
        <section className="py-20 bg-black -ml-16">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Mission */}
              {aboutContent?.missionContentEn && aboutContent?.missionContentVi && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Target className="w-10 h-10 text-white/40" />
                    <h3 className="text-2xl md:text-3xl font-light text-white uppercase tracking-wide">
                      {language === "vi" ? aboutContent.missionTitleVi : aboutContent.missionTitleEn}
                    </h3>
                  </div>
                  <p className="text-white/70 font-light leading-relaxed whitespace-pre-line">
                    {language === "vi" ? aboutContent.missionContentVi : aboutContent.missionContentEn}
                  </p>
                </div>
              )}

              {/* Vision */}
              {aboutContent?.visionContentEn && aboutContent?.visionContentVi && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Eye className="w-10 h-10 text-white/40" />
                    <h3 className="text-2xl md:text-3xl font-light text-white uppercase tracking-wide">
                      {language === "vi" ? aboutContent.visionTitleVi : aboutContent.visionTitleEn}
                    </h3>
                  </div>
                  <p className="text-white/70 font-light leading-relaxed whitespace-pre-line">
                    {language === "vi" ? aboutContent.visionContentVi : aboutContent.visionContentEn}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Core Values Section */}
      {coreValues.length > 0 && (
        <section className="py-20 bg-black -ml-16">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-sm font-light tracking-widest text-white/60 uppercase mb-4">
                {language === "vi" ? "GIÁ TRỊ CỐT LÕI" : "CORE VALUES"}
              </h2>
              <h3 className="text-3xl md:text-4xl font-light text-white uppercase tracking-wide">
                {language === "vi" ? aboutContent?.coreValuesTitleVi : aboutContent?.coreValuesTitleEn}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreValues.map((value) => (
                <div key={value.id} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Lightbulb className="w-8 h-8 text-white/40" />
                    <h4 className="text-xl font-light text-white uppercase tracking-wide">
                      {language === "vi" ? value.titleVi : value.titleEn}
                    </h4>
                  </div>
                  <p className="text-white/70 font-light leading-relaxed">
                    {language === "vi" ? value.descriptionVi : value.descriptionEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Members Section */}
      {teamMembers.length > 0 && (
        <section className="py-20 bg-black -ml-16 overflow-hidden">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-sm font-light tracking-widest text-white/60 uppercase mb-4">
                {language === "vi" ? "ĐỘI NGŨ" : "OUR TEAM"}
              </h2>
              <h3 className="text-3xl md:text-4xl font-light text-white uppercase tracking-wide">
                {language === "vi" ? aboutContent?.teamTitleVi : aboutContent?.teamTitleEn}
              </h3>
            </div>

            <div className="flex gap-0 items-stretch justify-center">
              {teamMembers.map((member, index) => {
                const isExpanded = selectedMember === index;
                const nameChars = member.name.toUpperCase().split('');
                
                return (
                  <div key={member.id} className="flex items-stretch self-stretch">
                    {/* Name Column */}
                    <button
                      onClick={() => setSelectedMember(index)}
                      className="flex-shrink-0 w-20 h-full border-r border-white/10 transition-all duration-300 hover:bg-white/5 py-8"
                      data-testid={`button-team-member-${member.id}`}
                    >
                      <div className="flex flex-col items-center">
                        {nameChars.map((char, charIndex) => (
                          <span 
                            key={charIndex} 
                            className={`text-2xl font-light transition-all duration-300 ${
                              isExpanded ? 'text-white' : 'text-white/40'
                            }`}
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </button>

                    {/* Expanded Content - Slides from right of this column */}
                    <div 
                      className={`h-full overflow-hidden transition-all duration-1000 ease-in-out border-r border-white/10 ${
                        isExpanded ? 'max-w-[800px] opacity-100' : 'max-w-0 opacity-0'
                      }`}
                    >
                      <div className="w-[800px] pl-12 pr-8 py-8">
                        <div className="flex gap-8 items-start">
                          {/* Image (9:16 ratio) */}
                          {member.image && (
                            <div className="flex-shrink-0 w-64">
                              <div className="aspect-[9/16] overflow-hidden bg-white/10">
                                <img 
                                  src={member.image} 
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}

                          {/* Details */}
                          <div className="flex-1 space-y-6">
                            <div>
                              <h4 className="text-2xl font-light text-white mb-2 uppercase tracking-wide">
                                {member.name}
                              </h4>
                              <p className="text-sm text-white/60 uppercase tracking-wider">
                                {language === "vi" ? member.positionVi : member.positionEn}
                              </p>
                            </div>
                            
                            {member.bioEn && member.bioVi && (
                              <p className="text-white/70 font-light leading-relaxed text-justify">
                                {language === "vi" ? member.bioVi : member.bioEn}
                              </p>
                            )}

                            {member.achievementsEn && member.achievementsVi && (
                              <div className="space-y-2">
                                <h5 className="text-sm font-light text-white/80 uppercase tracking-wider">
                                  {language === "vi" ? "Thành tựu" : "Achievements"}
                                </h5>
                                <p className="text-white/70 font-light leading-relaxed text-justify">
                                  {language === "vi" ? member.achievementsVi : member.achievementsEn}
                                </p>
                              </div>
                            )}

                            {member.philosophyEn && member.philosophyVi && (
                              <div className="space-y-2">
                                <h5 className="text-sm font-light text-white/80 uppercase tracking-wider">
                                  {language === "vi" ? "Triết lý" : "Philosophy"}
                                </h5>
                                <p className="text-white/70 font-light leading-relaxed text-justify">
                                  {language === "vi" ? member.philosophyVi : member.philosophyEn}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Our Approach Section */}
      <section className="py-20 bg-black -ml-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-sm font-light tracking-widest text-white/60 uppercase mb-4">
              {language === "vi" ? "QUY TRÌNH LÀM VIỆC" : "OUR PROCESS"}
            </h2>
            <h3 className="text-3xl md:text-4xl font-light text-white uppercase tracking-wide">
              {language === "vi" 
                ? "TỪ Ý TƯỞNG ĐẾN HIỆN THỰC"
                : "FROM CONCEPT TO REALITY"
              }
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="text-6xl font-light text-white/20">01</div>
              <h4 className="text-xl font-light text-white uppercase">
                {language === "vi" ? "Tư vấn & Khảo sát" : "Consultation & Survey"}
              </h4>
              <p className="text-white/70 font-light text-sm leading-relaxed">
                {language === "vi"
                  ? "Gặp gỡ, lắng nghe nhu cầu và khảo sát thực địa để hiểu rõ mong muốn của khách hàng."
                  : "Meeting, listening to needs and on-site survey to understand client desires."
                }
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="text-6xl font-light text-white/20">02</div>
              <h4 className="text-xl font-light text-white uppercase">
                {language === "vi" ? "Phát triển ý tưởng" : "Concept Development"}
              </h4>
              <p className="text-white/70 font-light text-sm leading-relaxed">
                {language === "vi"
                  ? "Phát triển ý tưởng thiết kế, bản vẽ sơ bộ và 3D visualization cho dự án."
                  : "Developing design concepts, preliminary drawings and 3D visualization for the project."
                }
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="text-6xl font-light text-white/20">03</div>
              <h4 className="text-xl font-light text-white uppercase">
                {language === "vi" ? "Thiết kế chi tiết" : "Detailed Design"}
              </h4>
              <p className="text-white/70 font-light text-sm leading-relaxed">
                {language === "vi"
                  ? "Hoàn thiện bản vẽ kỹ thuật, lựa chọn vật liệu và lập kế hoạch thi công chi tiết."
                  : "Completing technical drawings, material selection and detailed construction planning."
                }
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-4">
              <div className="text-6xl font-light text-white/20">04</div>
              <h4 className="text-xl font-light text-white uppercase">
                {language === "vi" ? "Thi công & Bàn giao" : "Construction & Handover"}
              </h4>
              <p className="text-white/70 font-light text-sm leading-relaxed">
                {language === "vi"
                  ? "Giám sát thi công chặt chẽ, đảm bảo chất lượng và bàn giao công trình hoàn hảo."
                  : "Strict construction supervision, ensuring quality and perfect project handover."
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black -ml-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-8 uppercase tracking-wide">
            {language === "vi"
              ? "SẴN SÀNG BẮT ĐẦU DỰ ÁN CỦA BẠN?"
              : "READY TO START YOUR PROJECT?"
            }
          </h2>
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
            {language === "vi"
              ? "Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí và nhận báo giá chi tiết cho dự án của bạn."
              : "Contact us today for a free consultation and detailed quote for your project."
            }
          </p>
          <Button
            asChild
            className="bg-white text-black hover:bg-white/90 transition-all duration-300 px-12 py-6 text-base rounded-none uppercase tracking-wider group"
            data-testid="button-contact-us"
          >
            <Link href="/contact">
              {language === "vi" ? "Liên hệ ngay" : "Contact Us"}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
