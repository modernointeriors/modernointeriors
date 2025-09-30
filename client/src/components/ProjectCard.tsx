import { Link } from "wouter";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const defaultImage = `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400`;
  const projectImage = Array.isArray(project.images) && project.images[0] || defaultImage;

  return (
    <div 
      className="project-card group relative overflow-hidden cursor-pointer h-[28rem] w-full flex-shrink-0 rounded-none"
      data-index={index}
    >
      <Link href={`/project/${project.id}`}>
        <img 
          src={projectImage}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`img-project-${project.id}`}
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Top - Title */}
          <div>
            <h3 className="text-white text-xl font-light mb-2" data-testid={`text-title-${project.id}`}>
              {project.title}
            </h3>
            <p className="text-white/80 text-sm uppercase tracking-wide" data-testid={`text-category-${project.id}`}>
              {project.category}
            </p>
          </div>
          
          {/* Bottom - Project Details */}
          {(project.area || project.duration) && (
            <div className="flex justify-between items-end">
              {project.duration && (
                <div>
                  <p className="text-white/80 text-xs uppercase tracking-wide mb-1">DURATION</p>
                  <p className="text-white font-light" data-testid={`text-duration-${project.id}`}>
                    {project.duration}
                  </p>
                </div>
              )}
              {project.area && (
                <div className="text-right">
                  <p className="text-white/80 text-xs uppercase tracking-wide mb-1">AREA</p>
                  <p className="text-white font-light" data-testid={`text-area-${project.id}`}>
                    {project.area}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
