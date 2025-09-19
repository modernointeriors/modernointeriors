import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, DollarSign, Ruler } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import type { Project } from "@shared/schema";

export default function ProjectDetail() {
  const [, params] = useRoute("/project/:id");
  const projectId = params?.id;

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-12 bg-muted rounded w-1/2" />
            <div className="h-96 bg-muted rounded-lg" />
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild data-testid="button-back-portfolio">
              <Link href="/portfolio">Back to Portfolio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-8"
          asChild
          data-testid="button-back"
        >
          <Link href="/portfolio">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Link>
        </Button>

        {/* Project Header */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{project.category}</Badge>
            {project.featured && <Badge variant="default">Featured</Badge>}
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6" data-testid="text-project-title">
            {project.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {project.description}
          </p>
        </div>

        {/* Project Images */}
        <div className="mb-12">
          {Array.isArray(project.images) && project.images.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {project.images.map((image: string, index: number) => (
                <div key={index} className="group relative overflow-hidden rounded-lg">
                  <OptimizedImage
                    src={image} 
                    alt={`${project.title} - Image ${index + 1}`}
                    width={800}
                    height={600}
                    wrapperClassName="w-full h-80 lg:h-96"
                    className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={index === 0} // First image loads immediately
                    data-testid={`img-project-${index}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
              <p className="text-muted-foreground">No images available</p>
            </div>
          )}
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-serif font-semibold mb-6">Project Overview</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {project.description || "This project showcases our commitment to creating exceptional spaces that blend functionality with aesthetic excellence. Every detail has been carefully considered to reflect the client's vision while maintaining our signature design philosophy."}
              </p>
            </div>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6">Project Details</h3>
                <div className="space-y-4">
                  {project.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground" data-testid="text-location">{project.location}</p>
                      </div>
                    </div>
                  )}

                  {project.area && (
                    <div className="flex items-start gap-3">
                      <Ruler className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Area</p>
                        <p className="text-sm text-muted-foreground" data-testid="text-area">{project.area}</p>
                      </div>
                    </div>
                  )}

                  {project.duration && (
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Duration</p>
                        <p className="text-sm text-muted-foreground" data-testid="text-duration">{project.duration}</p>
                      </div>
                    </div>
                  )}

                  {project.budget && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Budget</p>
                        <p className="text-sm text-muted-foreground" data-testid="text-budget">{project.budget}</p>
                      </div>
                    </div>
                  )}

                  {project.style && (
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 bg-primary rounded-full mt-1" />
                      <div>
                        <p className="font-medium">Style</p>
                        <p className="text-sm text-muted-foreground" data-testid="text-style">{project.style}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <Button 
                    size="lg" 
                    className="w-full"
                    asChild
                    data-testid="button-start-project"
                  >
                    <Link href="/contact">Start Your Project</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
