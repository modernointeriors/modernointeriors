import { useLocation } from "wouter";
import type { Project } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { getRoute } from "@/lib/routes";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const { language } = useLanguage();
  const [, navigate] = useLocation();

  const projectImage = Array.isArray(project.images) && project.images[0] ? project.images[0] : null;

  return (
    <div
      className="project-card group relative overflow-hidden cursor-pointer h-[28rem] w-full rounded-none bg-black"
      data-index={index}
      onClick={() => navigate(project.slug ? `${getRoute('portfolio', language)}/${project.slug}` : `/project/${project.id}`)}
    >
      {projectImage && (
        <img
          src={projectImage}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          data-testid={`img-project-${project.id}`}
        />
      )}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />

      <div className="absolute inset-0 p-6 pb-10 flex flex-col justify-between">
        <div>
          <h3
            className="text-white text-xl font-light mb-2"
            data-testid={`text-title-${project.id}`}
          >
            {project.title}
          </h3>
          <p
            className="text-white/80 text-sm uppercase tracking-wide mb-1"
            data-testid={`text-category-${project.id}`}
          >
            {project.category}
          </p>
          {project.area && (
            <p className="text-white/60 text-xs" data-testid={`text-area-${project.id}`}>
              {project.area}
            </p>
          )}
        </div>

        {(project.completionYear || project.duration) && (
          <div className="grid grid-cols-2 gap-4 text-white">
            {project.completionYear && (
              <div>
                <p className="text-white/60 text-[10px] uppercase tracking-wider mb-0.5">
                  {language === "vi" ? "Năm" : "Year"}
                </p>
                <p className="text-sm font-light" data-testid={`text-year-${project.id}`}>
                  {project.completionYear}
                </p>
              </div>
            )}
            {project.duration && (
              <div>
                <p className="text-white/60 text-[10px] uppercase tracking-wider mb-0.5">
                  {language === "vi" ? "Thời gian" : "Duration"}
                </p>
                <p className="text-sm font-light" data-testid={`text-duration-${project.id}`}>
                  {project.duration}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
