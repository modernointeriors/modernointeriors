import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, ArrowLeft, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import OptimizedImage from "@/components/OptimizedImage";
import type { Article } from "@shared/schema";
import { useEffect } from "react";

export default function BlogDetail() {
  const { slug } = useParams();
  const { language } = useLanguage();

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
      document.title = article.metaTitle || `${article.title} | NIVORA Studio`;
      
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
      document.title = 'NIVORA Studio';
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

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.excerpt || '',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8" />
            <div className="h-12 bg-muted rounded w-3/4 mb-4" />
            <div className="h-6 bg-muted rounded w-1/2 mb-8" />
            <div className="h-64 bg-muted rounded mb-8" />
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/6" />
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

            <h1 className="text-4xl md:text-5xl font-sans font-bold mb-6 leading-tight" data-testid="article-title">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-8" data-testid="article-excerpt">
                {article.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between mb-8">
              {article.tags && Array.isArray(article.tags) && article.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {(article.tags as any[]).map((tag: any, index: number) => (
                    <Badge key={index} variant="secondary">
                      #{String(tag)}
                    </Badge>
                  ))}
                </div>
              ) : null}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                data-testid="button-share"
              >
                <Share2 className="h-4 w-4 mr-2" />
                {language === 'vi' ? 'Chia sẻ' : 'Share'}
              </Button>
            </div>
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

        {/* CTA Section */}
        <div className="mt-16 py-12 text-center border-t border-border">
          <h3 className="text-2xl font-sans font-bold mb-4">
            {language === 'vi' ? 'Cần tư vấn thiết kế?' : 'Need Design Consultation?'}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {language === 'vi' 
              ? 'Hãy để NIVORA Studio giúp bạn biến ý tưởng thành hiện thực với dịch vụ thiết kế chuyên nghiệp.'
              : 'Let NIVORA Studio help you turn your ideas into reality with our professional design services.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild data-testid="button-contact-cta">
              <Link href="/contact">
                {language === 'vi' ? 'Liên hệ tư vấn' : 'Contact for Consultation'}
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild data-testid="button-portfolio-cta">
              <Link href="/portfolio">
                {language === 'vi' ? 'Xem dự án' : 'View Our Projects'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}