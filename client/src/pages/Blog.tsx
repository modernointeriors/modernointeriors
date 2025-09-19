import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Article } from "@shared/schema";
import { useState, useEffect } from "react";

const categories = [
  { value: 'all', label: 'All Articles' },
  { value: 'news', label: 'News' },
  { value: 'tips', label: 'Design Tips' },
  { value: 'projects', label: 'Project Highlights' },
  { value: 'design-trends', label: 'Design Trends' }
];

export default function Blog() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');

  // SEO meta tags
  useEffect(() => {
    const title = language === 'vi' ? 'Tin tức & Blog | NIVORA Studio' : 'News & Blog | NIVORA Studio';
    const description = language === 'vi' 
      ? 'Khám phá những xu hướng thiết kế mới nhất, mẹo hay và những dự án truyền cảm hứng từ NIVORA Studio'
      : 'Discover the latest design trends, helpful tips, and inspiring projects from NIVORA Studio';
      
    document.title = title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
    
    // Open Graph tags
    const updateOgTag = (property: string, content: string) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (ogTag) {
        ogTag.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.content = content;
        document.head.appendChild(meta);
      }
    };
    
    updateOgTag('og:title', title);
    updateOgTag('og:description', description);
    updateOgTag('og:type', 'website');
    updateOgTag('og:url', window.location.href);
    
    return () => {
      // Reset title when leaving
      document.title = 'NIVORA Studio';
    };
  }, [language]);

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles', activeCategory, language],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('language', language);
      if (activeCategory !== 'all') {
        params.append('category', activeCategory);
      }
      const response = await fetch(`/api/articles?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      return response.json();
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap = {
      en: {
        news: 'News',
        tips: 'Design Tips',
        projects: 'Project Highlights',
        'design-trends': 'Design Trends',
        general: 'General'
      },
      vi: {
        news: 'Tin tức',
        tips: 'Mẹo thiết kế',
        projects: 'Dự án nổi bật',
        'design-trends': 'Xu hướng thiết kế',
        general: 'Chung'
      }
    };
    return categoryMap[language][category as keyof typeof categoryMap.en] || category;
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            {language === 'vi' ? 'Tin tức & Blog' : 'News & Blog'}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6" data-testid="heading-blog">
            {language === 'vi' ? 'Tin tức & Cảm hứng' : 'News & Inspiration'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {language === 'vi' 
              ? 'Khám phá những xu hướng thiết kế mới nhất, mẹo hay và những dự án truyền cảm hứng từ NIVORA Studio'
              : 'Discover the latest design trends, helpful tips, and inspiring projects from NIVORA Studio'
            }
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={activeCategory === category.value ? "default" : "secondary"}
              onClick={() => setActiveCategory(category.value)}
              className="px-6 py-3 font-medium"
              data-testid={`filter-${category.value}`}
            >
              {language === 'vi' ? {
                'all': 'Tất cả bài viết',
                'news': 'Tin tức',
                'tips': 'Mẹo thiết kế',
                'projects': 'Dự án nổi bật',
                'design-trends': 'Xu hướng thiết kế'
              }[category.value] : category.label}
            </Button>
          ))}
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-48 rounded-lg mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">
              {language === 'vi' ? 'Không tìm thấy bài viết' : 'No articles found'}
            </h3>
            <p className="text-muted-foreground">
              {activeCategory === 'all' 
                ? (language === 'vi' ? 'Hiện tại chưa có bài viết nào.' : 'No articles are available at the moment.')
                : (language === 'vi' ? `Không có bài viết nào trong danh mục ${getCategoryLabel(activeCategory)}.` : `No articles found in ${getCategoryLabel(activeCategory)} category.`)
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="group overflow-hidden hover-scale" data-testid={`article-card-${article.id}`}>
                <div className="relative">
                  {article.featuredImage ? (
                    <img 
                      src={article.featuredImage} 
                      alt={article.title}
                      className="w-full h-48 object-cover"
                      data-testid={`img-article-${article.id}`}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <div className="text-6xl font-serif font-bold text-primary/30">N</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {article.featured && (
                    <Badge className="absolute top-4 left-4 bg-primary">
                      {language === 'vi' ? 'Nổi bật' : 'Featured'}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <Badge variant="outline" className="text-xs">
                      {getCategoryLabel(article.category)}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(String(article.publishedAt || article.createdAt))}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.viewCount}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-serif font-semibold mb-3 line-clamp-2" data-testid={`text-title-${article.id}`}>
                    {article.title}
                  </h3>
                  
                  {article.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`text-excerpt-${article.id}`}>
                      {article.excerpt}
                    </p>
                  )}
                  
                  {article.tags && Array.isArray(article.tags) && article.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(article.tags as any[]).slice(0, 3).map((tag: any, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{String(tag)}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  
                  <Button 
                    variant="outline" 
                    asChild
                    className="w-full"
                    data-testid={`button-read-article-${article.id}`}
                  >
                    <Link href={`/blog/${article.slug}`}>
                      {language === 'vi' ? 'Đọc thêm' : 'Read More'} 
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}