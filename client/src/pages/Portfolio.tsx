import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProjectCard from "@/components/ProjectCard";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Project } from "@shared/schema";

const categories = [
  { value: 'all', label: 'All Projects' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'architecture', label: 'Architecture' }
];

export default function Portfolio() {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects', activeCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeCategory !== 'all') {
        params.append('category', activeCategory);
      }
      const url = `/api/projects${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      return response.json();
    },
  });

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 uppercase">
            {language === 'vi' ? 'Tác phẩm của chúng tôi' : 'Our Work'}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-sans font-light mb-6" data-testid="heading-portfolio">
            {language === 'vi' ? 'Danh mục dự án' : 'Portfolio'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {language === 'vi' 
              ? 'Khám phá bộ sưu tập toàn diện các dự án thiết kế nội thất của chúng tôi qua nhiều danh mục khác nhau'
              : 'Explore our comprehensive collection of interior design projects across various categories'
            }
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={activeCategory === category.value ? "default" : "outline"}
              onClick={() => setActiveCategory(category.value)}
              className="px-6 py-3 font-light"
              data-testid={`filter-${category.value}`}
            >
              {language === 'vi' ? {
                'all': 'Tất cả dự án',
                'residential': 'Nhà ở',
                'commercial': 'Thương mại', 
                'architecture': 'Kiến trúc'
              }[category.value] : category.label}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/10 h-64 rounded-lg mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-light mb-2">
              {language === 'vi' ? 'Không tìm thấy dự án' : 'No projects found'}
            </h3>
            <p className="text-muted-foreground">
              {activeCategory === 'all' 
                ? (language === 'vi' ? 'Hiện tại chưa có dự án nào.' : 'No projects are available at the moment.')
                : (language === 'vi' ? `Không có dự án ${activeCategory === 'residential' ? 'nhà ở' : activeCategory === 'commercial' ? 'thương mại' : 'kiến trúc'} nào.` : `No ${activeCategory} projects are available.`)
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
