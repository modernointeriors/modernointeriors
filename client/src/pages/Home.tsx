import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroSlider from "@/components/HeroSlider";
import ScrollableContainer from "@/components/ScrollableContainer";
import { Progress } from "@/components/ui/progress";
import type { Project, HomepageContent, Article } from "@shared/schema";

export default function Home() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showLoading, setShowLoading] = useState(true);
  const { data: allProjects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const { data: featuredProjects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects', 'featured'],
    queryFn: async () => {
      const response = await fetch('/api/projects?featured=true');
      return response.json();
    },
  });

  const { data: stats } = useQuery<{
    totalProjects: number;
    activeClients: number;
    newInquiries: number;
    revenue: string;
  }>({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: homepageContent } = useQuery<HomepageContent>({
    queryKey: ['/api/homepage-content', language],
    queryFn: async () => {
      const response = await fetch(`/api/homepage-content?language=${language}`);
      return response.json();
    },
  });

  const { data: featuredArticles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles', 'featured', language],
    queryFn: async () => {
      const response = await fetch(`/api/articles?featured=true&language=${language}`);
      return response.json();
    },
  });

  // Controlled loading animation
  useEffect(() => {
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
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <div className="min-h-screen bg-black">
      {/* Full Screen Loading Overlay */}
      {showLoading && (
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
      )}

      {/* Hero Slider Section - IIDA Style */}
      <HeroSlider projects={allProjects || []} />

      {/* Featured Projects Section */}
      <section id="featured-projects" className="py-8 md:py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 uppercase">{homepageContent?.featuredBadge || 'Featured Projects'}</Badge>
            <h2 className="text-4xl md:text-6xl font-sans font-light mb-6">{homepageContent?.featuredTitle || 'Transforming Spaces'}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {homepageContent?.featuredDescription || 'Discover our latest projects where innovation meets elegance.'}
            </p>
          </div>
          
          {isLoading ? (
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="overflow-hidden w-80 flex-shrink-0">
                    <div className="animate-pulse bg-white/10 h-48 w-full" />
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-5 bg-white/10 rounded w-3/4" />
                        <div className="h-3 bg-white/10 rounded w-1/2" />
                        <div className="space-y-2">
                          <div className="h-3 bg-white/10 rounded" />
                          <div className="h-3 bg-white/10 rounded w-5/6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Scrollable Projects Grid */}
              <ScrollableContainer>
                <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                  {featuredProjects?.slice(0, 10).map((project) => (
                    <Card 
                      key={project.id} 
                      className="group overflow-hidden hover-scale cursor-pointer w-80 flex-shrink-0"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      <div className="relative">
                        <img 
                          src={Array.isArray(project.images) && project.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'} 
                          alt={project.title}
                          className="w-full h-48 object-cover"
                          data-testid={`img-project-${project.id}`}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-sans font-light mb-2 line-clamp-1" data-testid={`text-title-${project.id}`}>{project.title}</h3>
                        <p className="text-muted-foreground mb-3 text-sm" data-testid={`text-category-${project.id}`}>
                          {project.category} • {project.location}
                        </p>
                        <p className="text-foreground/80 mb-4 text-sm line-clamp-2" data-testid={`text-description-${project.id}`}>
                          {project.description}
                        </p>
                        {(project.area || project.duration) && (
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            {project.area && (
                              <div>
                                <h5 className="font-light mb-1">Area</h5>
                                <p className="text-muted-foreground">{project.area}</p>
                              </div>
                            )}
                            {project.duration && (
                              <div>
                                <h5 className="font-light mb-1">Duration</h5>
                                <p className="text-muted-foreground">{project.duration}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollableContainer>
              
              {/* View More Projects Button */}
              <div className="text-center mt-12">
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                  data-testid="button-view-more-projects"
                >
                  <Link href="/portfolio">
                    View More Projects <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Featured News Section */}
      <section id="featured-news" className="py-8 md:py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 uppercase">
              {language === 'vi' ? 'Tin tức nổi bật' : 'Featured News'}
            </Badge>
            <h2 className="text-4xl md:text-6xl font-sans font-light mb-6">
              {language === 'vi' ? 'Cập nhật mới nhất' : 'Latest Updates'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {language === 'vi' 
                ? 'Khám phá những xu hướng thiết kế mới nhất và các bài viết chuyên sâu từ đội ngũ chuyên gia của chúng tôi.'
                : 'Discover the latest design trends and expert insights from our professional team.'}
            </p>
          </div>
          
          {articlesLoading ? (
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="overflow-hidden w-80 flex-shrink-0">
                    <div className="animate-pulse bg-white/10 h-48 w-full" />
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-5 bg-white/10 rounded w-3/4" />
                        <div className="h-3 bg-white/10 rounded w-1/2" />
                        <div className="space-y-2">
                          <div className="h-3 bg-white/10 rounded" />
                          <div className="h-3 bg-white/10 rounded w-5/6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Scrollable Articles Grid */}
              <ScrollableContainer>
                <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                  {featuredArticles?.slice(0, 10).map((article) => (
                    <Card 
                      key={article.id} 
                      className="group overflow-hidden hover-scale cursor-pointer w-80 flex-shrink-0"
                      onClick={() => navigate(`/blog/${article.slug}`)}
                    >
                      <div className="relative">
                        <img 
                          src={article.featuredImage || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'} 
                          alt={article.title}
                          className="w-full h-48 object-cover"
                          data-testid={`img-article-${article.id}`}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-sans font-light mb-2 line-clamp-2" data-testid={`text-article-title-${article.id}`}>
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground mb-3 text-sm">
                          {article.publishedAt && new Date(article.publishedAt).toLocaleDateString(
                            language === 'vi' ? 'vi-VN' : 'en-US',
                            { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }
                          )}
                        </p>
                        <p className="text-foreground/80 text-sm line-clamp-3" data-testid={`text-article-excerpt-${article.id}`}>
                          {article.excerpt || 'Discover insights and trends in interior design...'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollableContainer>
              
              {/* View More News Button */}
              <div className="text-center mt-12">
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                  data-testid="button-view-more-news"
                >
                  <Link href="/blog">
                    {language === 'vi' ? 'Xem thêm tin tức' : 'View More News'} 
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="mb-16">
            <h2 className="text-sm font-light tracking-widest text-white/60 mb-8">
              {language === 'vi' ? 'QUY TRÌNH' : 'PROCESS'}
            </h2>
            <div className="max-w-4xl">
              <p className="text-2xl md:text-3xl font-light text-white leading-relaxed">
                {language === 'vi' 
                  ? 'CHÚNG TÔI QUẢN LÝ DỰ ÁN MỘT CÁCH NHẤT QUÁN VÀ MINH BẠCH - PHƯƠNG PHÁP NÀY CHO PHÉP CHÚNG TÔI ĐẠT ĐƯỢC '
                  : 'WE MANAGE THE PROJECT CONSISTENTLY AND TRANSPARENTLY - THIS APPROACH ALLOWS US TO ACHIEVE '
                }
                <span className="text-primary">
                  {language === 'vi' ? 'CHẤT LƯỢNG TỐI ĐA' : 'MAXIMUM QUALITY'}
                </span>
                {language === 'vi' ? ' VÀ ĐÁP ỨNG MỌI MONG ĐỢI CỦA BẠN.' : ' AND MEET YOUR EXPECTATIONS.'}
              </p>
            </div>
          </div>

          {/* Process Steps */}
          <div className="space-y-8">
            {/* Step 01 */}
            <div className="border-b border-white/10 pb-8 group hover:border-primary/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <span className="text-white/40 font-light text-lg">[01]</span>
                  <h3 className="text-xl md:text-2xl font-light text-white">
                    {language === 'vi' ? 'Thảo luận dự án' : 'Discussion of the project'}
                  </h3>
                </div>
                <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
              </div>
            </div>

            {/* Step 02 */}
            <div className="border-b border-white/10 pb-8 group hover:border-primary/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <span className="text-white/40 font-light text-lg">[02]</span>
                  <h3 className="text-xl md:text-2xl font-light text-white">
                    {language === 'vi' ? 'Ý tưởng' : 'Concept'}
                  </h3>
                </div>
                <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
              </div>
            </div>

            {/* Step 03 - With Image */}
            <div className="bg-white/5 rounded-lg p-8 group hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-8 mb-4">
                    <span className="text-black font-light text-lg">[03]</span>
                    <h3 className="text-xl md:text-2xl font-light text-black">
                      {language === 'vi' ? 'Thiết kế kiến trúc' : 'Architecture design'}
                    </h3>
                    <ArrowRight className="w-5 h-5 text-black/60 group-hover:text-primary transition-colors ml-auto lg:ml-0" />
                  </div>
                  <p className="text-black/70 font-light max-w-lg">
                    {language === 'vi' 
                      ? 'Phát triển các bản phác thảo, hình ảnh 3D và các giải pháp quy hoạch giúp hình dung được đối tượng tương lai ngay cả trước khi bắt đầu xây dựng.'
                      : 'Development of sketches, 3D visualizations and planning solutions that help to see the future object even before construction begins.'
                    }
                  </p>
                </div>
                <div className="w-full lg:w-48 h-32 bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80" 
                    alt="Modern Architecture"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Step 04 */}
            <div className="border-b border-white/10 pb-8 group hover:border-primary/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <span className="text-white/40 font-light text-lg">[04]</span>
                  <div>
                    <h3 className="text-xl md:text-2xl font-light text-white">
                      {language === 'vi' ? 'Thiết kế nội thất &' : 'Interior design &'}
                    </h3>
                    <h3 className="text-xl md:text-2xl font-light text-white">
                      {language === 'vi' ? 'Chỉ đạo nghệ thuật' : 'Art direction'}
                    </h3>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
