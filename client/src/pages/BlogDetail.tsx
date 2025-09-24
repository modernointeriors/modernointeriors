import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Eye, ArrowLeft, Share2, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import OptimizedImage from "@/components/OptimizedImage";
import type { Article } from "@shared/schema";
import { useEffect, useState } from "react";

// Related Articles Component
function RelatedArticles({ currentArticleId, language }: { currentArticleId: string; language: string }) {
  const { data: relatedArticles = [] } = useQuery<Article[]>({
    queryKey: ['/api/articles', 'related', currentArticleId, language],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('language', language);
      params.append('category', 'news');
      const response = await fetch(`/api/articles?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const articles = await response.json();
      return articles.filter((article: Article) => article.id !== currentArticleId).slice(0, 3);
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

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 py-12">
      <h3 className="text-2xl font-sans font-light mb-8">
        {language === 'vi' ? 'Những bài viết khác trong News' : 'Other News Articles'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {relatedArticles.map((article) => (
          <Card key={article.id} className="group overflow-hidden hover-scale project-hover" data-testid={`card-related-article-${article.id}`}>
            <Link href={`/blog/${article.slug}`}>
              <div className="relative">
                {article.featuredImage ? (
                  <OptimizedImage
                    src={article.featuredImage}
                    alt={article.title}
                    width={600}
                    height={192}
                    wrapperClassName="w-full h-48"
                    className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    data-testid={`img-related-article-${article.id}`}
                  />
                ) : (
                  <div className="w-full h-48 bg-black flex items-center justify-center">
                    <div className="text-6xl font-sans font-light text-primary/30">N</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
            
            <CardContent className="p-6">
              <h3 className="text-xl font-sans font-light mb-2 line-clamp-1" data-testid={`text-title-${article.id}`}>
                {article.title}
              </h3>
              <p className="text-muted-foreground mb-3 text-sm" data-testid={`text-category-${article.id}`}>
                News • {formatDate(String(article.publishedAt || article.createdAt))}
              </p>
              {article.excerpt && (
                <p className="text-foreground/80 mb-4 text-sm line-clamp-2" data-testid={`text-excerpt-${article.id}`}>
                  {article.excerpt}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: ['/api/articles/slug', slug, language],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('language', language);
      const response = await fetch(`/api/articles/slug/${slug}?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Article not found');
      }
      return response.json();
    },
    enabled: !!slug,
  });

  // Update document title and meta tags for SEO
  useEffect(() => {
    if (article) {
      document.title = article.metaTitle || `${article.title} | MODERNO INTERIORS Studio`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', article.metaDescription || article.excerpt || '');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = article.metaDescription || article.excerpt || '';
        document.head.appendChild(meta);
      }

      // Update meta keywords
      if (article.metaKeywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
          metaKeywords.setAttribute('content', article.metaKeywords);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'keywords';
          meta.content = article.metaKeywords;
          document.head.appendChild(meta);
        }
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

      updateOgTag('og:title', article.title);
      updateOgTag('og:description', article.excerpt || '');
      updateOgTag('og:type', 'article');
      updateOgTag('og:url', window.location.href);
      if (article.featuredImage) {
        updateOgTag('og:image', article.featuredImage);
      }
    }

    return () => {
      // Reset title when leaving
      document.title = 'MODERNO INTERIORS Studio';
    };
  }, [article]);

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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      toast({
        title: language === 'vi' ? 'Đã sao chép liên kết' : 'Link copied',
        description: language === 'vi' ? 'Liên kết đã được sao chép vào clipboard' : 'Link has been copied to clipboard',
      });
    } catch (error) {
      toast({
        title: language === 'vi' ? 'Lỗi' : 'Error',
        description: language === 'vi' ? 'Không thể sao chép liên kết' : 'Failed to copy link',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/4 mb-8" />
            <div className="h-12 bg-white/10 rounded w-3/4 mb-4" />
            <div className="h-6 bg-white/10 rounded w-1/2 mb-8" />
            <div className="h-64 bg-white/10 rounded mb-8" />
            <div className="space-y-4">
              <div className="h-4 bg-white/10 rounded" />
              <div className="h-4 bg-white/10 rounded w-5/6" />
              <div className="h-4 bg-white/10 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h1 className="text-2xl font-bold mb-4">
            {language === 'vi' ? 'Không tìm thấy bài viết' : 'Article Not Found'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {language === 'vi' 
              ? 'Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.' 
              : 'The article you\'re looking for doesn\'t exist or has been removed.'
            }
          </p>
          <Button asChild>
            <Link href="/blog">
              {language === 'vi' ? 'Quay lại Blog' : 'Back to Blog'}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          asChild 
          className="mb-8"
          data-testid="button-back-to-blog"
        >
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === 'vi' ? 'Quay lại Blog' : 'Back to Blog'}
          </Link>
        </Button>

        {/* Article Header */}
        <article className="prose prose-lg max-w-none">
          <div className="mb-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <Badge variant="outline">
                {getCategoryLabel(article.category)}
              </Badge>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(String(article.publishedAt || article.createdAt))}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {article.viewCount} {language === 'vi' ? 'lượt xem' : 'views'}
              </div>
              {article.featured && (
                <Badge className="bg-primary">
                  {language === 'vi' ? 'Nổi bật' : 'Featured'}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-sans font-light mb-6 leading-tight text-white" data-testid="article-title">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-8" data-testid="article-excerpt">
                {article.excerpt}
              </p>
            )}

            {article.tags && Array.isArray(article.tags) && article.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-8">
                {(article.tags as string[]).map((tag, index) => (
                  <Badge key={index} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="mb-8">
              <OptimizedImage
                src={article.featuredImage} 
                alt={article.title}
                width={1200}
                height={600}
                wrapperClassName="w-full h-64 md:h-96"
                className="w-full h-full rounded-lg"
                sizes="100vw"
                priority={true}
                data-testid="article-featured-image"
              />
            </div>
          )}

          {/* Article Content */}
          <div 
            className="prose prose-lg prose-gray dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: String(article.content) }}
            data-testid="article-content"
          />
        </article>

        {/* Published By and Share Section */}
        <div className="flex items-center justify-between mt-12 mb-8 border-t border-gray-800 pt-6">
          <div className="text-sm text-muted-foreground">
            <span>
              {language === 'vi' ? 'Được xuất bản bởi ' : 'Published by '}
              <span className="text-primary font-medium">MODERNO INTERIORS Studio</span>
            </span>
            <div className="mt-1">
              {formatDate(String(article.publishedAt || article.createdAt))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 hover:text-white transition-all"
            data-testid="button-share"
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                {language === 'vi' ? 'Đã sao chép!' : 'Copied!'}
              </>
            ) : (
              <>
                <Share2 className="h-5 w-5 mr-2" />
                {language === 'vi' ? 'Chia sẻ' : 'Share'}
              </>
            )}
          </Button>
        </div>

        {/* Related Articles Section */}
        <RelatedArticles currentArticleId={article.id} language={language} />
      </div>
    </div>
  );
}