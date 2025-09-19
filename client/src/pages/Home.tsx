import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Project, HomepageContent } from "@shared/schema";

export default function Home() {
  const { language } = useLanguage();
  const { data: featuredProjects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Matching Reference Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Header Content - Matching Reference Layout */}
        <div className="absolute top-8 left-8 z-20">
          <div className="text-white/90 text-sm font-light tracking-wider">
            {homepageContent?.heroStudio || 'STUDIO'}
          </div>
        </div>
        
        <div className="absolute top-8 left-8 mt-12 z-20 max-w-md">
          <p className="text-white/80 text-sm leading-relaxed">
            {homepageContent?.heroTagline || 'Transforming spaces into extraordinary experiences with sophisticated interior design'}
          </p>
        </div>
        
        {/* Large NIVORA Text Overlay */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-[8rem] md:text-[12rem] lg:text-[15rem] xl:text-[18rem] font-light text-white/95 tracking-wider leading-none" data-testid="hero-title">
            {homepageContent?.heroTitle || 'NIVORA'}
          </h1>
        </div>
        
        {/* Side Labels */}
        <div className="absolute left-8 bottom-1/3 z-20 text-white/70 text-sm font-light tracking-wider">
          {homepageContent?.heroArchitectureLabel || 'ARCHITECTURE'}
        </div>
        
        <div className="absolute right-8 bottom-1/3 z-20 text-white/70 text-sm font-light tracking-wider">
          {homepageContent?.heroInteriorLabel || 'INTERIOR'}
        </div>
        
        {/* Consultation Button */}
        <div className="absolute bottom-16 right-8 z-20">
          <Button 
            className="bg-white text-black hover:bg-white/90 px-8 py-3 text-sm font-medium tracking-wider"
            asChild
            data-testid="button-consultation"
          >
            <Link href="/contact">{homepageContent?.heroConsultationText || 'FREE CONSULTATION'}</Link>
          </Button>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown className="h-8 w-8" />
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="featured-projects" className="section-padding bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">{homepageContent?.featuredBadge || 'Featured Projects'}</Badge>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">{homepageContent?.featuredTitle || 'Transforming Spaces'}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {homepageContent?.featuredDescription || 'Discover our latest projects where innovation meets elegance.'}
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="animate-pulse bg-muted h-80 w-full" />
                  <CardContent className="p-8">
                    <div className="animate-pulse space-y-4">
                      <div className="h-6 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded" />
                        <div className="h-3 bg-muted rounded w-5/6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredProjects?.slice(0, 2).map((project) => (
                <Card key={project.id} className="group overflow-hidden hover-scale">
                  <div className="relative">
                    <img 
                      src={Array.isArray(project.images) && project.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'} 
                      alt={project.title}
                      className="w-full h-80 object-cover"
                      data-testid={`img-project-${project.id}`}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-serif font-semibold mb-2" data-testid={`text-title-${project.id}`}>{project.title}</h3>
                    <p className="text-muted-foreground mb-4" data-testid={`text-category-${project.id}`}>
                      {project.category} • {project.location}
                    </p>
                    <p className="text-foreground/80 mb-6" data-testid={`text-description-${project.id}`}>
                      {project.description}
                    </p>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {project.area && (
                        <div>
                          <h5 className="font-semibold mb-2">Area</h5>
                          <p className="text-muted-foreground">{project.area}</p>
                        </div>
                      )}
                      {project.duration && (
                        <div>
                          <h5 className="font-semibold mb-2">Duration</h5>
                          <p className="text-muted-foreground">{project.duration}</p>
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      asChild
                      data-testid={`button-view-project-${project.id}`}
                    >
                      <Link href={`/project/${project.id}`}>
                        View Full Project <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
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
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
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
