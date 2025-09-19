import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Building, Compass, Palette, Sofa, Lightbulb } from "lucide-react";
import type { Service } from "@shared/schema";

const defaultServices = [
  {
    id: '1',
    title: 'Residential Design',
    description: 'Complete home transformations from concept to completion, creating personalized living spaces that reflect your lifestyle.',
    icon: 'home',
    features: ['Space Planning', 'Custom Furniture', 'Color Consultation', 'Project Management'],
    order: 1,
    active: true
  },
  {
    id: '2',
    title: 'Commercial Design',
    description: 'Strategic workplace design that enhances productivity, brand identity, and employee wellbeing.',
    icon: 'building',
    features: ['Office Design', 'Retail Spaces', 'Hospitality Design', 'Brand Integration'],
    order: 2,
    active: true
  },
  {
    id: '3',
    title: 'Architectural Planning',
    description: 'Comprehensive architectural services from initial concept through construction documentation.',
    icon: 'compass',
    features: ['3D Visualization', 'Technical Drawings', 'Building Permits', 'Construction Admin'],
    order: 3,
    active: true
  },
  {
    id: '4',
    title: 'Design Consultation',
    description: 'Expert design guidance to help you make informed decisions for your space transformation.',
    icon: 'palette',
    features: ['Design Analysis', 'Budget Planning', 'Timeline Strategy', 'Style Direction'],
    order: 4,
    active: true
  },
  {
    id: '5',
    title: 'Furniture Selection',
    description: 'Curated furniture and decor selections that perfectly complement your design aesthetic.',
    icon: 'sofa',
    features: ['Custom Pieces', 'Vintage Sourcing', 'Art Curation', 'Accessory Selection'],
    order: 5,
    active: true
  },
  {
    id: '6',
    title: 'Lighting Design',
    description: 'Comprehensive lighting solutions that enhance ambiance and functionality throughout your space.',
    icon: 'lightbulb',
    features: ['Ambient Lighting', 'Task Lighting', 'Accent Features', 'Smart Controls'],
    order: 6,
    active: true
  }
];

const iconMap = {
  home: Home,
  building: Building,
  compass: Compass,
  palette: Palette,
  sofa: Sofa,
  lightbulb: Lightbulb
};

export default function Services() {
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  // Use API services if available, otherwise fall back to default
  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Our Services</Badge>
          <h1 className="text-4xl md:text-6xl font-sans font-light mb-6" data-testid="heading-services">Design Excellence</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From concept to completion, we offer comprehensive design services tailored to your unique vision and lifestyle.
          </p>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-white/10 rounded-xl mb-6" />
                  <div className="space-y-4">
                    <div className="h-6 bg-white/10 rounded w-3/4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-white/10 rounded" />
                      <div className="h-4 bg-white/10 rounded w-5/6" />
                    </div>
                    <div className="space-y-2 pt-4">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-3 bg-white/10 rounded w-4/5" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayServices.map((service) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Home;
              
              return (
                <Card key={service.id} className="glass-card hover-scale">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-sans font-light mb-4" data-testid={`text-title-${service.id}`}>
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {service.description}
                    </p>
                    {Array.isArray(service.features) && service.features.length > 0 && (
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {service.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        <section className="mt-24 bg-card rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-sans font-light mb-6">
            Ready to Begin Your Design Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss your project and create a space that perfectly reflects your vision and lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              asChild
              data-testid="button-get-quote"
            >
              <Link href="/contact">Get Free Quote</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              asChild
              data-testid="button-view-portfolio"
            >
              <Link href="/portfolio">View Our Work</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
