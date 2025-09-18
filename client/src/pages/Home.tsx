import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ArrowRight } from "lucide-react";
import type { Project } from "@shared/schema";

export default function Home() {
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
          }}
        >
          <div className="hero-gradient absolute inset-0"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="hero-text font-serif font-bold text-white mb-6 tracking-tighter" data-testid="hero-title">
            NIVORA
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-light max-w-2xl mx-auto leading-relaxed">
            Where architectural vision meets interior perfection. Creating extraordinary spaces that inspire and elevate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => scrollToSection('featured-projects')}
              data-testid="button-view-work"
            >
              View Our Work
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
              asChild
              data-testid="link-contact"
            >
              <Link href="/contact">Start Project</Link>
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown className="h-8 w-8" />
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="featured-projects" className="section-padding bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Featured Project</Badge>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">Luxury Portfolio</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover our most prestigious projects, where sophisticated design meets uncompromising quality.
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
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div>
                <div className="text-3xl font-light text-primary mb-2" data-testid="stats-clients">{stats.activeClients}+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-light text-primary mb-2" data-testid="stats-inquiries">{stats.newInquiries}+</div>
                <div className="text-sm text-muted-foreground">Awards Won</div>
              </div>
              <div>
                <div className="text-3xl font-light text-primary mb-2" data-testid="stats-revenue">8+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding bg-card">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Let's collaborate to create an extraordinary environment that reflects your vision and elevates your lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              asChild
              data-testid="button-start-project"
            >
              <Link href="/contact">Start Your Project</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              asChild
              data-testid="button-view-portfolio"
            >
              <Link href="/portfolio">View Portfolio</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
