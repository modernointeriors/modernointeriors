import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, User, Eye } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import type { Project } from "@shared/schema";

export default function ProjectDetail() {
  const [, params] = useRoute("/project/:id");
  const projectId = params?.id;
  const [expanded, setExpanded] = useState(false);

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

  // Fetch all projects for "OTHER PROJECTS" section with smart filtering
  const { data: allProjects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    select: (data) => {
      if (!project) return [];
      
      // Filter out current project
      const otherProjects = data.filter(p => p.id !== project.id);
      
      // Sort by priority:
      // 1. Same category first
      // 2. Then by most recent (createdAt or updatedAt)
      const sortedProjects = otherProjects.sort((a, b) => {
        // Priority 1: Same category as current project (both must have categories)
        const aMatchesCategory = !!project.category && !!a.category && a.category === project.category;
        const bMatchesCategory = !!project.category && !!b.category && b.category === project.category;
        
        if (aMatchesCategory && !bMatchesCategory) return -1;
        if (!aMatchesCategory && bMatchesCategory) return 1;
        
        // Priority 2: Most recent projects (using updatedAt or createdAt)
        const aDate = new Date((a as any).updatedAt || (a as any).createdAt || 0);
        const bDate = new Date((b as any).updatedAt || (b as any).createdAt || 0);
        return bDate.getTime() - aDate.getTime();
      });
      
      // Return exactly 4 projects for consistent layout
      return sortedProjects.slice(0, 4);
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
            <h2 className="text-xl font-light mb-2 text-white">Project Not Found</h2>
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

  // Get images from new categorized fields with fallback to legacy fields
  const coverImages = Array.isArray(project.coverImages) ? project.coverImages : [];
  const contentImages = Array.isArray(project.contentImages) ? project.contentImages : [];
  const galleryImages = Array.isArray(project.galleryImages) ? project.galleryImages : 
                       Array.isArray(project.images) ? project.images : [];
  
  // Use cover images for main display, fallback to legacy fields if empty
  const mainImages = coverImages.length > 0 ? coverImages : 
                    contentImages.length > 0 ? contentImages :
                    [project.heroImage, ...galleryImages].filter(Boolean);
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with navigation */}
      <header className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="text-white text-lg font-light tracking-wider">
              <img 
                src="/attached_assets/logo.white.png" 
                alt="NIVORA STUDIO" 
                className="h-8 w-auto"
              />
            </div>
            <nav className="hidden md:flex items-center space-x-8 text-sm">
              <Link href="/" className="text-zinc-400 hover:text-white transition-colors">HOME</Link>
              <Link href="/about" className="text-zinc-400 hover:text-white transition-colors">ABOUT</Link>
              <Link href="/portfolio" className="text-zinc-400 hover:text-white transition-colors">PROJECTS</Link>
              <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors">CONTACTS</Link>
            </nav>
            <div className="flex items-center space-x-1 text-sm">
              <button className="text-zinc-400 hover:text-primary transition-colors px-2 py-1" data-testid="button-lang-eng">
                ENG
              </button>
              <span className="text-zinc-600">|</span>
              <button className="text-zinc-400 hover:text-primary transition-colors px-2 py-1" data-testid="button-lang-eng2">
                ENG
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Project Title Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-wider mb-8">
            <span className="text-zinc-400">PROJECTS</span>
            <span className="text-zinc-600 mx-4">•</span>
            <span className="text-white uppercase" data-testid="text-project-title">
              {project.title}
            </span>
          </h1>

          {/* Designer and Year Info Row */}
          <div className="flex justify-between items-center text-sm text-zinc-400">
            <div data-testid="text-designer">
              {project.designer && `[Interior designer] ${project.designer}`}
            </div>
            <div data-testid="text-year">
              {project.completionYear && `[Year] ${project.completionYear}`}
            </div>
          </div>
        </div>

        {/* Two Large Images Side by Side - Using contentImages (16:9 or 1:1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* First Content Image */}
          {(contentImages[0] || coverImages[0] || project.heroImage || galleryImages[0]) && (
            <div className="aspect-video">
              <OptimizedImage
                src={contentImages[0] || coverImages[0] || project.heroImage || galleryImages[0]}
                alt={project.title}
                width={600}
                height={337}
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover"
                priority={true}
                data-testid="img-main"
              />
            </div>
          )}

          {/* Second Content Image */}
          {(contentImages[1] || coverImages[1] || galleryImages[1]) && (
            <div className="aspect-video">
              <OptimizedImage
                src={contentImages[1] || coverImages[1] || galleryImages[1]}
                alt={`${project.title} - Secondary view`}
                width={600}
                height={337}
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover"
                data-testid="img-secondary"
              />
            </div>
          )}
        </div>

        {/* Content Text Below Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          {/* Left Text Content */}
          <div className="space-y-6">
            <p className="text-zinc-300 leading-relaxed text-base" data-testid="text-description">
              {project.detailedDescription || project.description || "An interior where strict graphite shades are combined with the warmth of terracotta furniture and soft textures."}
            </p>
          </div>

          {/* Right Text Content with Small Image */}
          <div className="space-y-6">
            {/* Small detail image - from gallery images or cover images */}
            {(galleryImages[0] || coverImages[0]) && (
              <div className="w-full max-w-sm">
                <OptimizedImage
                  src={galleryImages[0] || coverImages[0]}
                  alt={`${project.title} - Detail`}
                  width={400}
                  height={300}
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover"
                  data-testid="img-detail"
                />
              </div>
            )}
            
            <p className="text-zinc-300 leading-relaxed text-base">
              Elegant fireplace with laconic design creates an atmosphere of coziness and style, becoming an accent piece.
            </p>
          </div>
        </div>

        {/* View More Button - Only show if there are additional gallery images and not expanded */}
        {galleryImages.length > 1 && !expanded && (
          <div className="text-center mb-16">
            <button 
              onClick={() => {
                setExpanded(true);
                // Delay scroll to allow content to render
                setTimeout(() => {
                  document.getElementById('additional-gallery')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }, 100);
              }}
              className="border border-zinc-600 text-zinc-300 px-8 py-3 text-sm uppercase tracking-wider hover:bg-zinc-800 transition-colors inline-flex items-center gap-2" 
              data-testid="button-view-more"
              aria-expanded={expanded}
              aria-controls="additional-gallery"
            >
              <span className="text-lg">•</span>
              VIEW MORE
            </button>
          </div>
        )}

        {/* Additional Gallery Section - Detailed Content */}
        {expanded && galleryImages.length > 1 && (
          <div id="additional-gallery" className="mt-24 space-y-16" data-testid="section-additional" tabIndex={-1}>
            {/* Additional detailed text content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
              <div className="space-y-6">
                <h3 className="text-xl font-light tracking-wider text-white">Design Philosophy</h3>
                <p className="text-zinc-300 leading-relaxed">
                  The project embodies a sophisticated approach to modern interior design, where every element 
                  is carefully curated to create a harmonious balance between functionality and aesthetic appeal.
                </p>
                <p className="text-zinc-300 leading-relaxed">
                  Attention to detail is evident in the selection of materials, the play of light and shadow, 
                  and the thoughtful integration of architectural elements that define the character of the space.
                </p>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-light tracking-wider text-white">Material Selection</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Premium materials were selected to enhance both durability and visual impact. Natural textures 
                  and rich finishes create depth and warmth throughout the interior.
                </p>
                <p className="text-zinc-300 leading-relaxed">
                  The careful balance of matte and glossy surfaces, combined with strategic lighting placement, 
                  creates an atmosphere that evolves throughout the day.
                </p>
              </div>
            </div>

            {/* Additional Gallery Images (16:9 or 1:1 aspect ratio) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryImages.slice(1).map((image: string, index: number) => (
                <div key={index} className="aspect-video">
                  <OptimizedImage
                    src={image}
                    alt={`${project.title} - Gallery ${index + 2}`}
                    width={400}
                    height={225}
                    wrapperClassName="w-full h-full"
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    data-testid={`img-gallery-${index + 2}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OTHER PROJECTS Section - Horizontal Scroll */}
        {allProjects && allProjects.length > 0 && (
          <div className="mt-32 pt-16">
            <div className="text-sm text-zinc-500 uppercase tracking-wider mb-8">OTHER PROJECTS</div>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
                {allProjects.map((otherProject) => (
                  <Link key={otherProject.id} href={`/project/${otherProject.id}`}>
                    <div className="group cursor-pointer w-72 aspect-square flex-shrink-0">
                      <OptimizedImage
                        src={(Array.isArray(otherProject.coverImages) ? otherProject.coverImages[0] : '') || (Array.isArray(otherProject.contentImages) ? otherProject.contentImages[0] : '') || otherProject.heroImage || (Array.isArray(otherProject.galleryImages) ? otherProject.galleryImages[0] : '') || (Array.isArray(otherProject.images) ? otherProject.images[0] : '') || '/placeholder-project.jpg'} 
                        alt={otherProject.title}
                        width={288}
                        height={288}
                        wrapperClassName="w-full h-full"
                        className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                        sizes="288px"
                        data-testid={`img-other-project-${otherProject.id}`}
                      />
                      <div className="mt-4 space-y-2">
                        <h3 className="text-white font-light tracking-wider text-sm uppercase">
                          {otherProject.title}
                        </h3>
                        <p className="text-zinc-400 text-xs">
                          {otherProject.category}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}