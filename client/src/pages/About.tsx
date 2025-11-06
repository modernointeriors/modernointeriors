import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Target, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import type { Project, AboutPageContent, AboutPrinciple, AboutShowcaseService, AboutProcessStep, AboutCoreValue, AboutTeamMember } from '@shared/schema';
import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';

import 'swiper/css';
import 'swiper/css/effect-fade';

export default function About() {
  const { language } = useLanguage();
  const [selectedMember, setSelectedMember] = useState<number | null>(0);

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: aboutContent, isLoading: aboutContentLoading } = useQuery<AboutPageContent>({
    queryKey: ["/api/about-page-content"],
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const { data: principles = [] } = useQuery<AboutPrinciple[]>({
    queryKey: ["/api/about-principles"],
    select: (data) => data.filter(p => p.active).sort((a, b) => a.order - b.order),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const { data: showcaseServices = [] } = useQuery<AboutShowcaseService[]>({
    queryKey: ["/api/about-showcase-services"],
    select: (data) => data.filter(s => s.active).sort((a, b) => a.order - b.order),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const { data: processSteps = [] } = useQuery<AboutProcessStep[]>({
    queryKey: ["/api/about-process-steps"],
    select: (data) => data.filter(s => s.active).sort((a, b) => a.order - b.order),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const { data: coreValues = [] } = useQuery<AboutCoreValue[]>({
    queryKey: ["/api/about-core-values"],
    select: (data) => data.filter(v => v.active).sort((a, b) => a.order - b.order),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const { data: teamMembers = [] } = useQuery<AboutTeamMember[]>({
    queryKey: ["/api/about-team-members"],
    select: (data) => data.filter(m => m.active).sort((a, b) => a.order - b.order),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

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

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Circle;
  };

  return (
    <main className="ml-16 pb-8 md:pb-6 mb-4">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] bg-black overflow-hidden -ml-16">
        <div className="relative h-screen">
          {/* Background Images Slider */}
          {aboutContent?.heroImages && aboutContent.heroImages.length > 0 ? (
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
              speed={800}
              className="absolute inset-0 w-full h-full"
            >
              {aboutContent.heroImages.map((imageUrl, index) => (
                <SwiperSlide key={index}>
                  <img 
                    src={imageUrl} 
                    alt={`About Hero ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200';
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200")',
              }}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Content */}
          {aboutContent && (
            <div className="relative h-full flex items-center z-10">
              <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight text-white uppercase tracking-wide">
                      {language === "vi" ? aboutContent.heroTitleVi : aboutContent.heroTitleEn}
                    </h1>
                  </div>

                  <div className="lg:text-right">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white uppercase tracking-wider leading-tight">
                      {language === "vi" ? aboutContent.heroSubtitleVi : aboutContent.heroSubtitleEn}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Principles Section */}
      {principles.length > 0 && aboutContent && (
        <section className="py-20 bg-black -ml-16">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-sm font-light tracking-widest text-white/60 uppercase mb-4">
                {language === "vi" ? "NGUYÊN TẮC LÀM VIỆC" : "OUR PRINCIPLES"}
              </h2>
              <h3 className="text-3xl md:text-4xl font-light text-white uppercase tracking-wide">
                {language === "vi" ? aboutContent.principlesTitleVi : aboutContent.principlesTitleEn}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {principles.map((principle) => {
                const IconComponent = getIconComponent(principle.icon);
                return (
                  <div key={principle.id} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <IconComponent className="w-8 h-8 text-white/40" />
                      <h4 className="text-xl font-light text-white uppercase tracking-wide">
                        {language === "vi" ? principle.titleVi : principle.titleEn}
                      </h4>
                    </div>
                    <p className="text-white/70 font-light leading-relaxed">
                      {language === "vi" ? principle.descriptionVi : principle.descriptionEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Architecture Showcase Section */}
      {((aboutContent?.showcaseBannerImageData || aboutContent?.showcaseBannerImage) || showcaseServices.length > 0) && (
        <section className="relative h-[80vh] min-h-[600px] bg-black overflow-hidden -ml-16">
          {(aboutContent?.showcaseBannerImageData || aboutContent?.showcaseBannerImage) && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${aboutContent.showcaseBannerImageData || aboutContent.showcaseBannerImage})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </div>
          )}

          <div className="relative h-full flex items-end">
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

            <div className="relative w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-end">
              {showcaseServices.map((service, index) => (
                <div key={service.id} className="px-6 py-8 md:px-8 md:py-12">
                  <div className="space-y-3 h-[180px] flex flex-col">
                    <h4 className="text-base md:text-lg font-light text-white uppercase tracking-wide">
                      {language === "vi" ? service.titleVi : service.titleEn}
                    </h4>
                    <p className="text-white/70 font-light text-xs md:text-sm leading-relaxed">
                      {language === "vi" ? service.descriptionVi : service.descriptionEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {aboutContent && (
        <section className="py-20 bg-black -ml-16">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-light text-white" data-testid="stats-projects">
                  {aboutContent.statsProjectsValue}
                </div>
                <div className="text-sm text-white/60 uppercase tracking-wider">
                  {language === "vi" ? aboutContent.statsProjectsLabelVi : aboutContent.statsProjectsLabelEn}
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-light text-white" data-testid="stats-awards">
                  {aboutContent.statsAwardsValue}
                </div>
                <div className="text-sm text-white/60 uppercase tracking-wider">
                  {language === "vi" ? aboutContent.statsAwardsLabelVi : aboutContent.statsAwardsLabelEn}
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-light text-white" data-testid="stats-clients">
                  {aboutContent.statsClientsValue}
                </div>
                <div className="text-sm text-white/60 uppercase tracking-wider">
                  {language === "vi" ? aboutContent.statsClientsLabelVi : aboutContent.statsClientsLabelEn}
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-light text-white" data-testid="stats-countries">
                  {aboutContent.statsCountriesValue}
                </div>
                <div className="text-sm text-white/60 uppercase tracking-wider">
                  {language === "vi" ? aboutContent.statsCountriesLabelVi : aboutContent.statsCountriesLabelEn}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-white/70 font-light text-lg leading-relaxed whitespace-pre-line">
                  {language === "vi" ? aboutContent.historyContentVi : aboutContent.historyContentEn}
                </p>
              </div>
              {aboutContent.historyImage && (
                <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                  <img 
                    src={aboutContent.historyImage} 
                    alt={language === "vi" ? "Lịch sử công ty" : "Company History"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision Section - Image LEFT, Content RIGHT */}
      {(aboutContent?.missionContentEn || aboutContent?.visionContentEn) && (
        <section className="py-20 bg-black -ml-16">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Image LEFT */}
              {(aboutContent?.missionVisionImageData || aboutContent?.missionVisionImage) && (
                <div className="relative overflow-hidden bg-white/5 aspect-[3/4]">
                  <img
                    src={aboutContent.missionVisionImageData || aboutContent.missionVisionImage}
                    alt={language === "vi" ? "Sứ mệnh và Tầm nhìn" : "Mission and Vision"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=1600';
                    }}
                  />
                </div>
              )}

              {/* Mission & Vision stacked on the right */}
              <div className="flex flex-col gap-12">
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
          </div>
        </section>
      )}

      {/* Core Values Section */}
      {coreValues.length > 0 && aboutContent && (
        <section className="py-20 bg-black -ml-16">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-sm font-light tracking-widest text-white/60 uppercase mb-4">
                {language === "vi" ? "GIÁ TRỊ CỐT LÕI" : "CORE VALUES"}
              </h2>
              <h3 className="text-3xl md:text-4xl font-light text-white uppercase tracking-wide">
                {language === "vi" ? aboutContent.coreValuesTitleVi : aboutContent.coreValuesTitleEn}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreValues.map((value) => {
                const IconComponent = getIconComponent(value.icon);
                return (
                  <div key={value.id} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <IconComponent className="w-8 h-8 text-white/40" />
                      <h4 className="text-xl font-light text-white uppercase tracking-wide">
                        {language === "vi" ? value.titleVi : value.titleEn}
                      </h4>
                    </div>
                    <p className="text-white/70 font-light leading-relaxed">
                      {language === "vi" ? value.descriptionVi : value.descriptionEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Team Members Section */}
      {teamMembers.length > 0 && aboutContent && (
        <section className="py-20 bg-black -ml-16 overflow-hidden">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-sm font-light tracking-widest text-white/60 uppercase mb-4">
                {language === "vi" ? "ĐỘI NGŨ" : "OUR TEAM"}
              </h2>
              <h3 className="text-3xl md:text-4xl font-light text-white uppercase tracking-wide mb-4">
                {language === "vi" ? aboutContent.teamTitleVi : aboutContent.teamTitleEn}
              </h3>
              {aboutContent?.teamSubtitleEn && aboutContent?.teamSubtitleVi && (
                <p className="text-white/60 font-light text-lg">
                  {language === "vi" ? aboutContent.teamSubtitleVi : aboutContent.teamSubtitleEn}
                </p>
              )}
            </div>

            <div className="flex gap-0 items-stretch justify-center">
              {teamMembers.map((member, index) => {
                const isExpanded = selectedMember === index;
                const nameChars = member.name.toUpperCase().split('');
                
                return (
                  <div key={member.id} className="flex items-stretch self-stretch">
                    <button
                      onClick={() => setSelectedMember(index)}
                      className={`relative flex-shrink-0 h-full border-r border-white/10 transition-all duration-500 overflow-hidden group ${
                        isExpanded ? 'w-0 opacity-0' : 'w-24 opacity-100'
                      }`}
                      data-testid={`button-team-member-${member.id}`}
                    >
                      {/* Background Image */}
                      {member.image && (
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                          style={{
                            backgroundImage: `url(${member.image})`,
                            filter: 'grayscale(100%) brightness(0.3)',
                          }}
                        />
                      )}
                      
                      {/* Overlay */}
                      <div className={`absolute inset-0 transition-all duration-300 ${
                        isExpanded ? 'bg-black/30' : 'bg-black/60'
                      } group-hover:bg-black/40`} />
                      
                      {/* Content */}
                      <div className="relative h-full flex flex-col items-center pt-8">
                        {/* Plus Icon */}
                        <div className={`text-4xl font-light mb-8 transition-all duration-300 ${
                          isExpanded ? 'text-white' : 'text-white/60'
                        }`}>
                          +
                        </div>
                        
                        {/* Name Vertical */}
                        <div className="flex flex-col items-center">
                          {nameChars.map((char, charIndex) => (
                            <span 
                              key={charIndex} 
                              className={`text-2xl font-light transition-all duration-300 ${
                                isExpanded ? 'text-white' : 'text-white/70'
                              }`}
                            >
                              {char}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>

                    <div 
                      className={`h-full overflow-hidden transition-all duration-1000 ease-in-out border-r border-white/10 ${
                        isExpanded ? 'max-w-[800px] opacity-100' : 'max-w-0 opacity-0'
                      }`}
                    >
                      <div className="w-[800px] pl-12 pr-8 py-8">
                        <div className="flex gap-8 items-start">
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

      {/* Process Section */}
      {processSteps.length > 0 && aboutContent && (
        <section className="py-20 bg-black -ml-16">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-sm font-light tracking-widest text-white/60 uppercase mb-4">
                {language === "vi" ? "QUY TRÌNH LÀM VIỆC" : "OUR PROCESS"}
              </h2>
              <h3 className="text-3xl md:text-4xl font-light text-white uppercase tracking-wide">
                {language === "vi" ? aboutContent.processTitleVi : aboutContent.processTitleEn}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step) => (
                <div key={step.id} className="space-y-4">
                  <div className="text-6xl font-light text-white/20">{step.stepNumber}</div>
                  <h4 className="text-xl font-light text-white uppercase">
                    {language === "vi" ? step.titleVi : step.titleEn}
                  </h4>
                  <p className="text-white/70 font-light text-sm leading-relaxed">
                    {language === "vi" ? step.descriptionVi : step.descriptionEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
