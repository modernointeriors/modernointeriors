import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import OptimizedImage from "@/components/OptimizedImage";
import type { Article } from "@shared/schema";
import { useState, useEffect } from "react";

const categories = [
  { value: 'all', label: 'All Articles' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'news', label: 'News' },
  { value: 'tips', label: 'Design Tips' },
  { value: 'projects', label: 'Project Highlights' },
  { value: 'design-trends', label: 'Design Trends' }
];

export default function Blog() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  // SEO meta tags
  useEffect(() => {
    const title = language === 'vi' ? 'Tin tức & Blog | MODERNO INTERIORS Studio' : 'News & Blog | MODERNO INTERIORS Studio';
    const description = language === 'vi' 
      ? 'Khám phá những xu hướng thiết kế mới nhất, mẹo hay và những dự án truyền cảm hứng từ MODERNO INTERIORS Studio'
      : 'Discover the latest design trends, helpful tips, and inspiring projects from MODERNO INTERIORS Studio';
      
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
      document.title = 'MODERNO INTERIORS Studio';
    };
  }, [language]);

  const { data: allArticles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles', activeCategory, language],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('language', language);
      if (activeCategory !== 'all' && activeCategory !== 'newest' && activeCategory !== 'oldest') {
        params.append('category', activeCategory);
      }
      const response = await fetch(`/api/articles?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      let articles = await response.json();
      
      // Sort articles based on activeCategory
      if (activeCategory === 'newest') {
        articles.sort((a: Article, b: Article) => {
          const dateA = new Date(a.publishedAt || a.createdAt);
          const dateB = new Date(b.publishedAt || b.createdAt);
          return dateB.getTime() - dateA.getTime(); // Newest first
        });
      } else if (activeCategory === 'oldest') {
        articles.sort((a: Article, b: Article) => {
          const dateA = new Date(a.publishedAt || a.createdAt);
          const dateB = new Date(b.publishedAt || b.createdAt);
          return dateA.getTime() - dateB.getTime(); // Oldest first
        });
      }
      
      return articles;
    },
  });

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(allArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const articles = allArticles.slice(startIndex, endIndex);

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-8 mt-16">
        {/* Previous button */}
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 text-sm font-light tracking-widest transition-colors ${
            currentPage === 1 
              ? 'opacity-30 cursor-not-allowed text-white/50' 
              : 'text-white/70 hover:text-white'
          }`}
          data-testid="pagination-prev"
        >
          <ChevronLeft className="w-4 h-4" />
          {language === 'vi' ? 'TRƯỚC' : 'PREV'}
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-6">
          {pages.map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`text-lg font-light transition-all duration-300 ${
                currentPage === page 
                  ? 'text-white border-b-2 border-white pb-1'
                  : 'text-white/50 hover:text-white/80'
              }`}
              data-testid={`pagination-page-${page}`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-2 text-sm font-light tracking-widest transition-colors ${
            currentPage === totalPages 
              ? 'opacity-30 cursor-not-allowed text-white/50' 
              : 'text-white/70 hover:text-white'
          }`}
          data-testid="pagination-next"
        >
          {language === 'vi' ? 'TIẾP' : 'NEXT'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

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
          <h1 className="text-4xl md:text-6xl font-sans font-light mb-6" data-testid="heading-blog">
            {language === 'vi' ? 'Tin tức & Cảm hứng' : 'News & Inspiration'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {language === 'vi' 
              ? 'Khám phá những xu hướng thiết kế mới nhất, mẹo hay và những dự án truyền cảm hứng từ MODERNO INTERIORS Studio'
              : 'Discover the latest design trends, helpful tips, and inspiring projects from MODERNO INTERIORS Studio'
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
                'all': 'Tất cả bài viết',
                'newest': 'Mới nhất',
                'oldest': 'Cũ nhất',
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
                <div className="bg-white/10 h-48 rounded-lg mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-light mb-2">
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Card key={article.id} className="group overflow-hidden hover-scale project-hover" data-testid={`card-article-${article.id}`}>
                  <Link href={`/blog/${article.slug}`}>
                    <div className="relative">
                      {article.featuredImage ? (
                        <OptimizedImage
                          src={article.featuredImage}
                          alt={article.title}
                          width={600}
                          height={256}
                          wrapperClassName="w-full h-64"
                          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          data-testid={`img-article-${article.id}`}
                        />
                      ) : (
                        <div className="w-full h-64 bg-black flex items-center justify-center">
                          <div className="text-6xl font-sans font-light text-primary/30">N</div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="text-center text-white p-4">
                          <h3 className="text-lg font-sans font-light mb-2" data-testid={`text-title-${article.id}`}>
                            {article.title}
                          </h3>
                          <p className="text-sm opacity-90 mb-4" data-testid={`text-category-${article.id}`}>
                            {getCategoryLabel(article.category)} • {formatDate(String(article.publishedAt || article.createdAt))}
                          </p>
                          <span className="inline-block px-4 py-2 border border-white/50 rounded-md text-sm hover:bg-white hover:text-black transition-colors">
                            {language === 'vi' ? 'Xem bài viết' : 'View Article'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{getCategoryLabel(article.category)}</Badge>
                      {article.featured && <Badge variant="default">{language === 'vi' ? 'Nổi bật' : 'Featured'}</Badge>}
                    </div>
                    <Link href={`/blog/${article.slug}`}>
                      <h3 className="text-xl font-sans font-light mb-2 hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-3">
                      {formatDate(String(article.publishedAt || article.createdAt))}
                    </p>
                    {article.excerpt && (
                      <p className="text-foreground/70 text-sm line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <Pagination />
          </>
        )}
      </div>
      
      {/* Show results info */}
      {!isLoading && allArticles.length > 0 && (
        <div className="text-center text-muted-foreground text-sm mt-8">
          {language === 'vi' 
            ? `Hiển thị ${startIndex + 1}-${Math.min(endIndex, allArticles.length)} trong tổng số ${allArticles.length} bài viết`
            : `Showing ${startIndex + 1}-${Math.min(endIndex, allArticles.length)} of ${allArticles.length} articles`
          }
        </div>
      )}
    </div>
  );
}