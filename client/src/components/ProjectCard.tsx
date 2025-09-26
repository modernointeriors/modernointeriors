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
    <Card className="group overflow-hidden hover-scale project-hover h-[28rem] rounded-none">
      <Link href={`/project/${project.id}`}>
        <div className="relative">
          <OptimizedImage
            src={projectImage}
            alt={project.title}
            width={600}
            height={192}
            wrapperClassName="w-full h-full"
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-testid={`img-project-${project.id}`}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-sans font-light mb-2 line-clamp-1" data-testid={`text-title-${project.id}`}>
          {project.title}
        </h3>
        <p className="text-muted-foreground mb-3 text-sm" data-testid={`text-category-${project.id}`}>
          {project.category} • {project.location || 'Location TBD'}
        </p>
        {project.description && (
          <p className="text-foreground/80 mb-4 text-sm line-clamp-2" data-testid={`text-description-${project.id}`}>
            {project.description}
          </p>
        )}
        {(project.area || project.duration) && (
          <div className="grid grid-cols-2 gap-3 text-xs">
            {project.area && (
              <div>
                <h5 className="font-light mb-1">AREA</h5>
                <p className="text-muted-foreground">{project.area}</p>
              </div>
            )}
            {project.duration && (
              <div>
                <h5 className="font-light mb-1">DURATION</h5>
                <p className="text-muted-foreground">{project.duration}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
