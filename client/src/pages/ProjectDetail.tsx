import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, User, Eye } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import type { Project } from "@shared/schema";

export default function ProjectDetail() {
  const [, params] = useRoute("/project/:id");
  const projectId = params?.id;

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId,
  });

  // Set SEO meta tags when project data is loaded
  useEffect(() => {
    if (project) {
      const title = project.metaTitle || `${project.title} | NIVORA Design Studio`;
      const description = project.metaDescription || project.detailedDescription || project.description || `Interior design project by NIVORA Design Studio`;
      
      document.title = title;
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
      
      // Add Open Graph meta tags
      const updateMetaTag = (property: string, content: string) => {
        let metaTag = document.querySelector(`meta[property="${property}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('property', property);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content);
      };
      
      updateMetaTag('og:title', title);
      updateMetaTag('og:description', description);
      updateMetaTag('og:type', 'article');
      const firstGalleryImage = Array.isArray(project.galleryImages) ? project.galleryImages[0] : undefined;
      if (project.heroImage || firstGalleryImage) {
        updateMetaTag('og:image', project.heroImage || firstGalleryImage || '');
      }
    }
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'NIVORA Design Studio';
    };
  }, [project]);

  const { data: relatedProjects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    select: (data) => {
      if (!project?.relatedProjects || !Array.isArray(project.relatedProjects)) return [];
      const relatedIds = project.relatedProjects as string[];
      return data.filter(p => relatedIds.includes(p.id) && p.id !== project.id).slice(0, 3);
    },
    enabled: !!project,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="animate-pulse space-y-12">
            <div className="h-8 bg-zinc-800 rounded w-1/4" />
            <div className="h-16 bg-zinc-800 rounded w-1/2" />
            <div className="h-[70vh] bg-zinc-800 rounded-lg" />
            <div className="space-y-4">
              <div className="h-4 bg-zinc-800 rounded" />
              <div className="h-4 bg-zinc-800 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-white">Project Not Found</h2>
            <p className="text-zinc-400 mb-4">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild variant="outline" data-testid="button-back-portfolio">
              <Link href="/portfolio">Back to Portfolio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const galleryImages = Array.isArray(project.galleryImages) ? project.galleryImages : 
                       Array.isArray(project.images) ? project.images : [];
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                asChild
                className="text-zinc-400 hover:text-white"
                data-testid="button-back"
              >
                <Link href="/portfolio">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  PROJECTS
                </Link>
              </Button>
            </div>
            <div className="text-right text-sm text-zinc-500">
              <div className="uppercase tracking-wider">DISCOVER PAPER & BRAND</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Project Title Section */}
        <div className="mb-16">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-zinc-500 uppercase tracking-wider text-sm">PROJECTS</span>
            <span className="text-zinc-500">•</span>
            <span className="text-white uppercase tracking-wider text-sm font-medium" data-testid="text-project-title">
              {project.title}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-end">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {project.designer && (
                  <div className="text-sm text-zinc-400">
                    <span className="text-zinc-500">Interior Designer:</span> 
                    <span className="text-white ml-2" data-testid="text-designer">{project.designer}</span>
                  </div>
                )}
                {project.category && (
                  <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                    {project.category}
                  </Badge>
                )}
              </div>
            </div>

            <div className="text-right">
              {project.completionYear && (
                <div className="text-2xl font-light text-white" data-testid="text-year">
                  {project.completionYear}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hero Image */}
        {(project.heroImage || galleryImages[0]) && (
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-lg">
              <OptimizedImage
                src={project.heroImage || galleryImages[0]} 
                alt={project.title}
                width={1200}
                height={800}
                wrapperClassName="w-full h-[70vh]"
                className="w-full h-full"
                sizes="100vw"
                priority={true}
                data-testid="img-hero"
              />
            </div>
          </div>
        )}

        {/* Project Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
          <div className="lg:col-span-2">
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-zinc-300 leading-relaxed text-lg">
                {project.detailedDescription || project.description || "An interior where solid granite shades are combined with the warmth of terracotta furniture and soft textures."}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {project.location && (
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-zinc-500 mt-1" />
                <div>
                  <div className="text-zinc-500 text-sm uppercase tracking-wider mb-1">Location</div>
                  <div className="text-white" data-testid="text-location">{project.location}</div>
                </div>
              </div>
            )}

            {project.area && (
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-zinc-500 rounded-full mt-1" />
                <div>
                  <div className="text-zinc-500 text-sm uppercase tracking-wider mb-1">Area</div>
                  <div className="text-white" data-testid="text-area">{project.area}</div>
                </div>
              </div>
            )}

            {project.duration && (
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-zinc-500 mt-1" />
                <div>
                  <div className="text-zinc-500 text-sm uppercase tracking-wider mb-1">Duration</div>
                  <div className="text-white" data-testid="text-duration">{project.duration}</div>
                </div>
              </div>
            )}

            {project.style && (
              <div className="flex items-start space-x-3">
                <Eye className="h-5 w-5 text-zinc-500 mt-1" />
                <div>
                  <div className="text-zinc-500 text-sm uppercase tracking-wider mb-1">Style</div>
                  <div className="text-white" data-testid="text-style">{project.style}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Images */}
        {galleryImages.length > 1 && (
          <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {galleryImages.slice(1).map((image: string, index: number) => (
                <div key={index} className="group relative overflow-hidden rounded-lg">
                  <OptimizedImage
                    src={image} 
                    alt={`${project.title} - Gallery ${index + 1}`}
                    width={600}
                    height={400}
                    wrapperClassName="w-full h-80"
                    className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    data-testid={`img-gallery-${index}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Project Details */}
        <div className="mb-20">
          <div className="text-sm text-zinc-500 uppercase tracking-wider mb-8">OTHER PROJECTS</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.slice(0, 4).map((image: string, index: number) => (
              <div key={index} className="relative overflow-hidden rounded-lg aspect-square">
                <OptimizedImage
                  src={image} 
                  alt={`${project.title} - Thumbnail ${index + 1}`}
                  width={300}
                  height={300}
                  wrapperClassName="w-full h-full"
                  className="w-full h-full"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  data-testid={`img-thumb-${index}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects && relatedProjects.length > 0 && (
          <div className="border-t border-zinc-800 pt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {relatedProjects.slice(0, 2).map((relatedProject) => (
                <Link key={relatedProject.id} href={`/project/${relatedProject.id}`}>
                  <div className="group cursor-pointer">
                    <div className="text-sm text-zinc-500 uppercase tracking-wider mb-4">
                      NIVORA STUDIO
                    </div>
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-zinc-500 uppercase tracking-wider text-sm">PROJECTS</span>
                        <span className="text-zinc-500">•</span>
                        <span className="text-white uppercase tracking-wider text-sm font-medium">
                          {relatedProject.title}
                        </span>
                      </div>
                      {relatedProject.designer && (
                        <div className="text-sm text-zinc-400">
                          <span className="text-zinc-500">Interior Designer:</span> 
                          <span className="text-white ml-2">{relatedProject.designer}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <OptimizedImage
                        src={relatedProject.heroImage || (Array.isArray(relatedProject.images) ? relatedProject.images[0] : '') || '/placeholder-project.jpg'} 
                        alt={relatedProject.title}
                        width={500}
                        height={600}
                        wrapperClassName="w-full h-80"
                        className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        data-testid={`img-related-${relatedProject.id}`}
                      />
                    </div>

                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                      {relatedProject.description}
                    </p>

                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      data-testid={`button-view-project-${relatedProject.id}`}
                    >
                      ← VIEW PROJECT
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Contact CTA */}
        <div className="text-center pt-20 border-t border-zinc-800 mt-20">
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-zinc-200 px-8"
            asChild
            data-testid="button-start-project"
          >
            <Link href="/contact">Start Your Project</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}