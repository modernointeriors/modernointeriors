import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroSlider from "@/components/HeroSlider";
import ScrollableContainer from "@/components/ScrollableContainer";
import type { Project, HomepageContent, Article } from "@shared/schema";

export default function Home() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Slider Section - IIDA Style */}
      {projectsLoading ? (
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
      ) : (
        <HeroSlider projects={allProjects || []} />
      )}

      {/* Featured Projects Section */}
      <section id="featured-projects" className="section-padding bg-card">
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
      <section id="featured-news" className="section-padding bg-background">
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

      {/* Stats Section */}
      {stats && (
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-light text-primary mb-2" data-testid="stats-projects">{stats.totalProjects}+</div>
                <div className="text-sm text-muted-foreground">{homepageContent?.statsProjectsLabel || 'Projects'}</div>
              </div>
              <div>
                <div className="text-3xl font-light text-primary mb-2" data-testid="stats-clients">{stats.activeClients}+</div>
                <div className="text-sm text-muted-foreground">{homepageContent?.statsClientsLabel || 'Clients'}</div>
              </div>
              <div>
                <div className="text-3xl font-light text-primary mb-2" data-testid="stats-inquiries">{stats.newInquiries}+</div>
                <div className="text-sm text-muted-foreground">{homepageContent?.statsAwardsLabel || 'Awards'}</div>
              </div>
              <div>
                <div className="text-3xl font-light text-primary mb-2" data-testid="stats-revenue">8+</div>
                <div className="text-sm text-muted-foreground">{homepageContent?.statsExperienceLabel || 'Years'}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding bg-card">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-sans font-light mb-6">
            {homepageContent?.ctaTitle || 'Ready to Transform Your Space?'}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {homepageContent?.ctaDescription || "Let's collaborate to bring your vision to life."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              asChild
              data-testid="button-start-project"
            >
              <Link href="/contact">{homepageContent?.ctaButtonText || 'Start Your Project'}</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              asChild
              data-testid="button-view-portfolio"
            >
              <Link href="/portfolio">{homepageContent?.ctaSecondaryButtonText || 'View Our Portfolio'}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
