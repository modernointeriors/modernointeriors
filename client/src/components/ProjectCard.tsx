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
    <Link href={project.slug ? `/portfolio/${project.slug}` : `/project/${project.id}`}>
      <div
        className="project-card group relative overflow-hidden cursor-pointer w-full flex flex-col rounded-none transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-white/10"
        data-index={index}
      >
        {/* Image */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <img
            src={projectImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            data-testid={`img-project-${project.id}`}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500" />
          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <p className="text-white/80 text-[10px] uppercase tracking-widest bg-black/40 px-2 py-1 backdrop-blur-sm" data-testid={`text-category-${project.id}`}>
              {project.category}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="pt-4 pb-2 flex flex-col gap-2">
          <h3 className="text-white text-base font-light group-hover:text-white/70 transition-colors line-clamp-1" data-testid={`text-title-${project.id}`}>
            {project.title}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-white/50 text-xs font-light">
              {project.completionYear && (
                <span data-testid={`text-year-${project.id}`}>{project.completionYear}</span>
              )}
              {project.duration && (
                <span data-testid={`text-duration-${project.id}`}>{project.duration}</span>
              )}
              {project.location && (
                <span className="truncate max-w-[100px]">{project.location}</span>
              )}
            </div>
            <span className="text-white/30 text-[10px] tracking-widest uppercase group-hover:text-white/60 transition-colors flex-shrink-0">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
