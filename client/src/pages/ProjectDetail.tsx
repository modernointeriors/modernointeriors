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

  // Fetch all projects for "OTHER PROJECTS" section
  const { data: allProjects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    select: (data) => {
      // Filter out current project and get up to 4 other projects
      return data.filter(p => p.id !== project?.id).slice(0, 4);
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
      {/* Header with navigation */}
      <header className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="text-white text-lg font-light tracking-wider">
              NIVORA STUDIO
            </div>
            <nav className="hidden md:flex items-center space-x-8 text-sm">
              <Link href="/" className="text-zinc-400 hover:text-white transition-colors">HOME</Link>
              <Link href="/about" className="text-zinc-400 hover:text-white transition-colors">ABOUT</Link>
              <Link href="/portfolio" className="text-zinc-400 hover:text-white transition-colors">PROJECTS</Link>
              <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors">CONTACTS</Link>
            </nav>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-zinc-400">ENG</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">RU</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6">
        {/* Project Title Section */}
        <div className="mb-12">
          <h1 className="text-2xl font-light tracking-wider mb-8">
            <span className="text-zinc-400">PROJECTS</span>
            <span className="text-zinc-600 mx-3">•</span>
            <span className="text-white uppercase" data-testid="text-project-title">
              {project.title}
            </span>
          </h1>

          <div className="flex items-center justify-between mb-12">
            <div className="text-zinc-400">
              {project.designer && (
                <span data-testid="text-designer">[Interior designer] {project.designer}</span>
              )}
            </div>
            <div className="text-zinc-400">
              {project.completionYear && (
                <span data-testid="text-year">Year | {project.completionYear}</span>
              )}
            </div>
          </div>
        </div>

        {/* Main Images Grid - Two large images at top */}
        {galleryImages.length >= 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12">
            <div className="aspect-[4/5]">
              <OptimizedImage
                src={galleryImages[0]}
                alt={`${project.title} - Image 1`}
                width={600}
                height={750}
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover"
                priority={true}
                data-testid="img-gallery-1"
              />
            </div>
            <div className="aspect-[4/5]">
              <OptimizedImage
                src={galleryImages[1]}
                alt={`${project.title} - Image 2`}
                width={600}
                height={750}
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover"
                data-testid="img-gallery-2"
              />
            </div>
          </div>
        )}

        {/* Description Section with smaller image on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2">
            <p className="text-zinc-300 leading-relaxed text-base mb-8" data-testid="text-description">
              {project.detailedDescription || project.description || "An interior where solid granite shades are combined with the warmth of terracotta furniture and soft textures."}
            </p>
            
            {/* Small thumbnail image on the left under description */}
            {galleryImages[2] && (
              <div className="w-24 h-16">
                <OptimizedImage
                  src={galleryImages[2]}
                  alt={`${project.title} - Small thumbnail`}
                  width={96}
                  height={64}
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover"
                  data-testid="img-small-thumb"
                />
              </div>
            )}
          </div>

          {/* Smaller image on the right */}
          {galleryImages[3] && (
            <div className="aspect-square">
              <OptimizedImage
                src={galleryImages[3]}
                alt={`${project.title} - Side image`}
                width={400}
                height={400}
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover"
                data-testid="img-side"
              />
            </div>
          )}
        </div>

        {/* Additional Layout Section with text and image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <p className="text-zinc-300 leading-relaxed text-sm">
              Elegant finishes with second-design ceramic as complexes of corners and the flexibility to create a space.
            </p>
            
            {/* View More Button */}
            <div>
              <button className="border border-zinc-600 text-zinc-300 px-6 py-2 text-sm uppercase tracking-wider hover:bg-zinc-800 transition-colors" data-testid="button-view-more">
                + VIEW MORE
              </button>
            </div>
          </div>

          {/* Large bottom image */}
          {galleryImages[4] && (
            <div className="aspect-[4/5]">
              <OptimizedImage
                src={galleryImages[4]}
                alt={`${project.title} - Bottom image`}
                width={600}
                height={750}
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover"
                data-testid="img-bottom"
              />
            </div>
          )}
        </div>

        {/* OTHER PROJECTS Section - Only show if there are other projects */}
        {allProjects && allProjects.length > 0 && (
          <div className="mt-24 pt-16">
            <div className="text-sm text-zinc-500 uppercase tracking-wider mb-8">OTHER PROJECTS</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {allProjects.map((otherProject) => (
                <Link key={otherProject.id} href={`/project/${otherProject.id}`}>
                  <div className="group cursor-pointer aspect-square">
                    <OptimizedImage
                      src={otherProject.heroImage || (Array.isArray(otherProject.galleryImages) ? otherProject.galleryImages[0] : '') || (Array.isArray(otherProject.images) ? otherProject.images[0] : '') || '/placeholder-project.jpg'} 
                      alt={otherProject.title}
                      width={300}
                      height={300}
                      wrapperClassName="w-full h-full"
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      data-testid={`img-other-project-${otherProject.id}`}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}