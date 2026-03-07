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
        className="project-card group relative overflow-hidden cursor-pointer w-full flex rounded-none transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-white/10 bg-white/5 border border-white/10 hover:border-white/20"
        data-index={index}
      >
        {/* Image - left side */}
        <div className="relative w-80 md:w-96 flex-shrink-0 h-64 overflow-hidden">
          <img
            src={projectImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            data-testid={`img-project-${project.id}`}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-500" />
        </div>

        {/* Content - right side */}
        <div className="flex flex-col justify-between p-8 flex-1">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-widest mb-2" data-testid={`text-category-${project.id}`}>
              {project.category}
            </p>
            <h3 className="text-white text-2xl font-light mb-3 group-hover:text-white/80 transition-colors" data-testid={`text-title-${project.id}`}>
              {project.title}
            </h3>
            {project.description && (
              <p className="text-white/50 text-sm font-light leading-relaxed line-clamp-2">
                {project.description}
              </p>
            )}
            {project.area && (
              <p className="text-white/40 text-xs mt-2" data-testid={`text-area-${project.id}`}>
                {project.area}
              </p>
            )}
          </div>

          {/* Bottom info */}
          <div className="flex items-end justify-between mt-4">
            <div className="flex gap-8 text-white">
              {project.completionYear && (
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Year</p>
                  <p className="font-light text-sm" data-testid={`text-year-${project.id}`}>
                    {project.completionYear}
                  </p>
                </div>
              )}
              {project.duration && (
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Duration</p>
                  <p className="font-light text-sm" data-testid={`text-duration-${project.id}`}>
                    {project.duration}
                  </p>
                </div>
              )}
              {project.location && (
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Location</p>
                  <p className="font-light text-sm">
                    {project.location}
                  </p>
                </div>
              )}
            </div>
            <span className="text-white/30 text-xs tracking-widest uppercase group-hover:text-white/60 transition-colors">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
