import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from "@/components/OptimizedImage";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const defaultImage = `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400`;
  const projectImage = Array.isArray(project.images) && project.images[0] || defaultImage;

  return (
    <Card className="group overflow-hidden hover-scale project-hover">
      <Link href={`/project/${project.id}`}>
        <div className="relative">
          <OptimizedImage
            src={projectImage}
            alt={project.title}
            width={600}
            height={256}
            wrapperClassName="w-full h-64"
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-testid={`img-project-${project.id}`}
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h3 className="text-lg font-serif font-semibold mb-2" data-testid={`text-title-${project.id}`}>
                {project.title}
              </h3>
              <p className="text-sm opacity-90 mb-4" data-testid={`text-category-${project.id}`}>
                {project.category} • {project.location || 'Location TBD'}
              </p>
              <span className="inline-block px-4 py-2 border border-white/50 rounded-md text-sm hover:bg-white hover:text-black transition-colors">
                View Project
              </span>
            </div>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{project.category}</Badge>
          {project.featured && <Badge variant="default">Featured</Badge>}
        </div>
        <Link href={`/project/${project.id}`}>
          <h3 className="text-xl font-serif font-semibold mb-2 hover:text-primary transition-colors">
            {project.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-3">
          {project.location || 'Location TBD'}
        </p>
        {project.description && (
          <p className="text-foreground/70 text-sm line-clamp-2">
            {project.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
