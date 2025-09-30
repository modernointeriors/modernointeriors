import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import HeroSlider from "@/components/HeroSlider";
import ScrollableContainer from "@/components/ScrollableContainer";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import type { Project, HomepageContent, Article, Partner } from "@shared/schema";

export default function Home() {
  const [, navigate] = useLocation();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showLoading, setShowLoading] = useState(true);
  const [step01Expanded, setStep01Expanded] = useState(false);
  const [step02Expanded, setStep02Expanded] = useState(false);
  const [step03Expanded, setStep03Expanded] = useState(false);
  const [step04Expanded, setStep04Expanded] = useState(false);
  const [step05Expanded, setStep05Expanded] = useState(false);
  const [contactFormExpanded, setContactFormExpanded] = useState(false);
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | null>(null);
  const [processSectionHoverTimer, setProcessSectionHoverTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Quick contact form state (matching Contact page)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    requirements: ''
  });
  const { data: allProjects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const { data: featuredProjects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects', 'featured'],
    queryFn: async () => {
      const response = await fetch('/api/projects?featured=true');
      return response.json();
    },
  });

  const { data: stats } = useQuery<{
    totalProjects: number;
    activeClients: number;
    newInquiries: number;
    revenue: string;
  }>({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: homepageContent } = useQuery<HomepageContent>({
    queryKey: ['/api/homepage-content', language],
    queryFn: async () => {
      const response = await fetch(`/api/homepage-content?language=${language}`);
      return response.json();
    },
  });

  const { data: featuredArticles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles', 'featured', language],
    queryFn: async () => {
      const response = await fetch(`/api/articles?featured=true&language=${language}`);
      return response.json();
    },
  });

  const { data: partners, isLoading: partnersLoading } = useQuery<Partner[]>({
    queryKey: ['/api/partners'],
    queryFn: async () => {
      const response = await fetch('/api/partners?active=true');
      return response.json();
    },
  });

  // Quick contact form mutation (matching Contact page)
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/inquiries', data);
    },
    onSuccess: () => {
      toast({
        title: language === 'vi' ? 'Gửi yêu cầu thành công' : 'Request Sent Successfully',
        description: language === 'vi' 
          ? 'Chúng tôi sẽ liên hệ lại với bạn trong vòng 24 giờ.'
          : "We'll get back to you within 24 hours."
      });
      setFormData({ name: '', email: '', phone: '', address: '', requirements: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/inquiries'] });
    },
    onError: () => {
      toast({
        title: language === 'vi' ? 'Lỗi' : 'Error',
        description: language === 'vi' 
          ? 'Không thể gửi yêu cầu. Vui lòng thử lại.'
          : 'Failed to send request. Please try again.',
        variant: "destructive"
      });
    }
  });

  // Controlled loading animation
  useEffect(() => {
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds total loading time
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      
      setLoadingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        // Wait a bit then hide loading screen
        setTimeout(() => {
          setShowLoading(false);
        }, 300);
      }
    }, 16); // 60fps for smoother animation
    
    return () => clearInterval(interval);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (processSectionHoverTimer) {
        clearTimeout(processSectionHoverTimer);
      }
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }
    };
  }, [processSectionHoverTimer, autoCloseTimer]);

  // Handle Process Section auto-close functionality
  const handleProcessSectionMouseLeave = () => {
    const timer = setTimeout(() => {
      // Close all expanded steps
      setStep01Expanded(false);
      setStep02Expanded(false);
      setStep03Expanded(false);
      setStep04Expanded(false);
      setStep05Expanded(false);
    }, 4000); // 4 seconds after mouse leaves entire section
    setProcessSectionHoverTimer(timer);
  };

  const handleProcessSectionMouseEnter = () => {
    if (processSectionHoverTimer) {
      clearTimeout(processSectionHoverTimer);
      setProcessSectionHoverTimer(null);
    }
  };

  // Auto-close handlers for Quick Contact section
  const handleContactMouseEnter = () => {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      setAutoCloseTimer(null);
    }
  };

  const handleContactMouseLeave = () => {
    if (contactFormExpanded) {
      const timer = setTimeout(() => {
        setContactFormExpanded(false);
      }, 4000); // 4 seconds - between 3-5s as requested
      setAutoCloseTimer(timer);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: language === 'vi' ? 'Trường bắt buộc' : 'Required Fields',
        description: language === 'vi' 
          ? 'Vui lòng điền họ tên, email và số điện thoại.'
          : 'Please fill in name, email, and phone fields.',
        variant: 'destructive'
      });
      return;
    }

    const inquiryData = {
      firstName: formData.name.split(' ')[0] || formData.name,
      lastName: formData.name.split(' ').slice(1).join(' ') || '',
      email: formData.email,
      phone: formData.phone,
      projectType: 'consultation' as const,
      message: `Address: ${formData.address}\n\nRequirements: ${formData.requirements}`
    };

    mutation.mutate(inquiryData);
  };


  return (
    <div className="min-h-screen bg-black">
      {/* Full Screen Loading Overlay */}
      {showLoading && (
        <div className="fixed inset-0 bg-black text-white flex items-center justify-center z-[9999]">
          <div className="text-center">
            <div className="mb-8">
              <img 
                src="/attached_assets/logo.white.png" 
                alt="Moderno Interiors" 
                className="h-24 md:h-32 w-auto mx-auto"
              />
            </div>
            <div className="w-80 mx-auto">
              <Progress 
                value={loadingProgress} 
                className="h-1 bg-white/20" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Hero Slider Section - IIDA Style */}
      <HeroSlider projects={allProjects || []} />

      {/* Featured Projects Section */}
      <section id="featured-projects" className="py-8 md:py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-sm font-light tracking-widest text-muted-foreground uppercase">
                {homepageContent?.featuredBadge || t('featured.projectsTitle')}
              </h2>
            </div>
            <div className="flex items-start justify-between">
              <div className="max-w-4xl">
                <p className="text-2xl md:text-3xl font-light text-foreground leading-relaxed">
                  {homepageContent?.featuredDescription || t('featured.projectsDesc')}
                </p>
              </div>
              <div className="flex-shrink-0 ml-8">
                <Button 
                  variant="outline" 
                  size="default"
                  asChild
                  className="rounded-none border-white hover:bg-white hover:text-black"
                  data-testid="button-view-more-projects"
                >
                  <Link href="/portfolio">
                    {t('common.viewMoreProjects')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="group relative overflow-hidden cursor-pointer h-[28rem] w-72 flex-shrink-0 rounded-none">
                    <div className="animate-pulse bg-white/10 h-full w-full" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Scrollable Projects Grid - 5 columns visible, scroll to see up to 10 */}
              <ScrollableContainer>
                <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                  {featuredProjects?.slice(0, 10).map((project) => (
                    <div 
                      key={project.id} 
                      className="group relative overflow-hidden cursor-pointer h-[28rem] w-72 flex-shrink-0 rounded-none"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                    <img 
                      src={Array.isArray(project.images) && project.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      data-testid={`img-project-${project.id}`}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-6 pb-12 flex flex-col justify-between">
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
                            <div className="text-white/90">
                              <span className="text-xs uppercase tracking-wide opacity-70">
                                {language === 'vi' ? 'THỜI GIAN' : 'DURATION'}
                              </span>
                              <p className="text-sm font-light">{project.duration}</p>
                            </div>
                          )}
                          {project.area && (
                            <div className="text-white/90 text-right">
                              <span className="text-xs uppercase tracking-wide opacity-70">
                                {language === 'vi' ? 'DIỆN TÍCH' : 'AREA'}
                              </span>
                              <p className="text-sm font-light">{project.area}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  ))}
                </div>
              </ScrollableContainer>
              
            </>
          )}
        </div>
      </section>

      {/* Featured News Section */}
      <section id="featured-news" className="py-8 md:py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-sm font-light tracking-widest text-muted-foreground uppercase">
                {t('featured.newsTitle')}
              </h2>
            </div>
            <div className="flex items-start justify-between">
              <div className="max-w-4xl">
                <p className="text-2xl md:text-3xl font-light text-foreground leading-relaxed">
                  {t('featured.newsDesc')}
                </p>
              </div>
              <div className="flex-shrink-0 ml-8">
                <Button 
                  variant="outline" 
                  size="default"
                  asChild
                  className="rounded-none border-white hover:bg-white hover:text-black"
                  data-testid="button-view-more-news"
                >
                  <Link href="/blog">
                    {t('common.viewMoreNews')} 
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {articlesLoading ? (
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="overflow-hidden h-[28rem] w-72 flex-shrink-0 rounded-none">
                    <div className="animate-pulse bg-white/10 h-48 w-full" />
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-5 bg-white/10 rounded w-3/4" />
                        <div className="h-3 bg-white/10 rounded w-1/2" />
                        <div className="space-y-2">
                          <div className="h-3 bg-white/10 rounded" />
                          <div className="h-3 bg-white/10 rounded w-5/6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Scrollable Articles Grid - 5 columns visible, scroll to see up to 10 */}
              <ScrollableContainer>
                <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                  {featuredArticles?.slice(0, 10).map((article) => (
                    <Card 
                      key={article.id} 
                      className="group overflow-hidden hover-scale cursor-pointer h-[28rem] w-72 flex-shrink-0 rounded-none"
                      onClick={() => navigate(`/blog/${article.slug}`)}
                    >
                      <div className="relative">
                        <img 
                          src={article.featuredImage || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'} 
                          alt={article.title}
                          className="w-full h-48 object-cover"
                          data-testid={`img-article-${article.id}`}
                        />
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-sans font-light mb-2 line-clamp-2" data-testid={`text-article-title-${article.id}`}>
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground mb-3 text-sm">
                          {article.publishedAt && new Date(article.publishedAt).toLocaleDateString(
                            language === 'vi' ? 'vi-VN' : 'en-US',
                            { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }
                          )}
                        </p>
                        <p className="text-foreground/80 text-sm line-clamp-3" data-testid={`text-article-excerpt-${article.id}`}>
                          {article.excerpt || 'Discover insights and trends in interior design...'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollableContainer>
              
            </>
          )}
        </div>
      </section>

      {/* Quality Materials Hero Section */}
      <section className="relative h-[70vh] bg-black overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/attached_assets/stock_images/contemporary_bedroom_e9bd2ed1.jpg")',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
              {/* Left side text */}
              <div className="text-white">
                <p className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed">
                  {language === 'vi' 
                    ? 'Mỗi chi tiết được lựa chọn để nội thất phục vụ lâu dài và luôn hoàn hảo.'
                    : 'Each detail is selected so that the interior will serve for a long time and look impeccable.'
                  }
                </p>
              </div>
              
              {/* Right side content */}
              <div className="text-white">
                <div className="mb-8">
                  <p className="text-xl md:text-2xl font-light leading-relaxed">
                    {language === 'vi' 
                      ? 'Chúng tôi chỉ sử dụng vật liệu chất lượng cao và đồ nội thất từ các nhà sản xuất uy tín.'
                      : 'We use only high-quality materials and furniture from trusted manufacturers.'
                    }
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="secondary" 
                    size="lg"
                    asChild
                    className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-medium"
                    data-testid="button-consultation"
                  >
                    <Link href="/contact">
                      • {language === 'vi' ? 'TƯ VẤN' : 'CONSULTATION'}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section 
        className="py-8 md:py-12 bg-black"
        onMouseEnter={handleProcessSectionMouseEnter}
        onMouseLeave={handleProcessSectionMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="mb-16">
            <h2 className="text-sm font-light tracking-widest text-white/60 mb-8">
              {language === 'vi' ? 'HÀNH TRÌNH KIẾN TẠO KHÔNG GIAN SỐNG CỦA BẠN' : 'THE JOURNEY TO YOUR DREAM SPACE'}
            </h2>
            <div className="max-w-4xl">
              <p className="text-2xl md:text-3xl font-light text-white leading-relaxed">
                {language === 'vi' 
                  ? 'TỪ Ý TƯỞNG ĐẾN HIỆN THỰC, CHÚNG TÔI ĐỒNG HÀNH CÙNG BẠN QUA MỘT QUY TRÌNH 5 BƯỚC TINH GỌN, HIỆU QUẢ VÀ ĐẦY CẢM HỨNG.'
                  : 'FROM CONCEPT TO REALITY, WE GUIDE YOU THROUGH A STREAMLINED, EFFICIENT, AND INSPIRING 5-STEP PROCESS.'
                }
              </p>
            </div>
          </div>

          {/* Process Steps */}
          <div className="space-y-8">
            {/* Step 01 */}
            <div className="pb-8 group transition-colors cursor-pointer">
              <div 
                className="flex items-center justify-between"
                onClick={() => setStep01Expanded(!step01Expanded)}
              >
                <div className="flex items-center gap-8">
                  <span className="text-white/40 font-light text-lg">[01]</span>
                  <h3 className="text-xl md:text-2xl font-light text-white">
                    {language === 'vi' ? 'KHỞI ĐẦU & THẤU HIỂU' : 'DISCOVERY & UNDERSTANDING'}
                  </h3>
                </div>
                <ArrowRight 
                  className={`w-5 h-5 text-white/40 group-hover:text-primary transition-all ${
                    step01Expanded ? 'rotate-90 text-primary' : ''
                  }`} 
                />
              </div>
              
              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                step01Expanded ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'
              }`}>
                <div className="border-l-2 border-white/20 pl-8">
                  <p className="text-white/70 font-light">
                    {language === 'vi' 
                      ? 'Chúng tôi bắt đầu bằng việc lắng nghe và phân tích sâu nhu cầu, sở thích và ngân sách của bạn. Một buổi khảo sát thực tế tại công trình sẽ giúp chúng tôi đưa ra những tư vấn phù hợp nhất.'
                      : 'We begin by carefully listening to and analyzing your needs, preferences, and budget. An on-site survey of your property allows us to provide the most tailored advice.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Step 02 */}
            <div className="pb-8 group transition-colors cursor-pointer">
              <div 
                className="flex items-center justify-between"
                onClick={() => setStep02Expanded(!step02Expanded)}
              >
                <div className="flex items-center gap-8">
                  <span className="text-white/40 font-light text-lg">[02]</span>
                  <h3 className="text-xl md:text-2xl font-light text-white">
                    {language === 'vi' ? 'ĐỊNH HÌNH PHONG CÁCH' : 'STYLE & CONCEPT DEVELOPMENT'}
                  </h3>
                </div>
                <ArrowRight 
                  className={`w-5 h-5 text-white/40 group-hover:text-primary transition-all ${
                    step02Expanded ? 'rotate-90 text-primary' : ''
                  }`} 
                />
              </div>
              
              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                step02Expanded ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'
              }`}>
                <div className="border-l-2 border-white/20 pl-8">
                  <p className="text-white/70 font-light">
                    {language === 'vi' 
                      ? 'Những ý tưởng sáng tạo được phác thảo, kết hợp cùng giải pháp công năng thông minh và thẩm mỹ tinh tế. Chúng tôi sẽ trình bày và thống nhất cùng bạn phương án thiết kế tối ưu nhất trước khi chính thức hợp tác.'
                      : 'Creative ideas are sketched out, combining intelligent functional solutions with sophisticated aesthetics. We will present and finalize the optimal design proposal with you before formalizing our partnership.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Step 03 - With Expandable Content */}
            <div className="pb-8 group transition-colors cursor-pointer">
              <div 
                className="flex items-center justify-between"
                onClick={() => setStep03Expanded(!step03Expanded)}
              >
                <div className="flex items-center gap-8">
                  <span className="text-white/40 font-light text-lg">[03]</span>
                  <h3 className="text-xl md:text-2xl font-light text-white">
                    {language === 'vi' ? 'TRỰC QUAN HÓA KHÔNG GIAN' : 'VISUALIZING THE SPACE'}
                  </h3>
                </div>
                <ArrowRight 
                  className={`w-5 h-5 text-white/40 group-hover:text-primary transition-all ${
                    step03Expanded ? 'rotate-90 text-primary' : ''
                  }`} 
                />
              </div>
              
              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                step03Expanded ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'
              }`}>
                <div className="border-l-2 border-white/20 pl-8">
                  <p className="text-white/70 font-light">
                    {language === 'vi' 
                      ? 'Không gian mơ ước của bạn sẽ được tái hiện sống động qua các bản vẽ phối cảnh 3D và moodboard vật liệu, màu sắc. Bạn sẽ thấy trước ngôi nhà của mình một cách chân thực nhất và cùng chúng tôi tinh chỉnh đến khi hoàn toàn ưng ý.'
                      : 'Your dream space is brought to life through vivid 3D renderings and mood boards showcasing materials and colors. You get to see your future home with stunning realism, and we\'ll fine-tune every detail with you until it\'s perfect.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Step 04 */}
            <div className="pb-8 group transition-colors cursor-pointer">
              <div 
                className="flex items-center justify-between"
                onClick={() => setStep04Expanded(!step04Expanded)}
              >
                <div className="flex items-center gap-8">
                  <span className="text-white/40 font-light text-lg">[04]</span>
                  <h3 className="text-xl md:text-2xl font-light text-white">
                    {language === 'vi' ? 'HIỆN THỰC HÓA CHUYÊN NGHIỆP' : 'PROFESSIONAL EXECUTION'}
                  </h3>
                </div>
                <ArrowRight 
                  className={`w-5 h-5 text-white/40 group-hover:text-primary transition-all ${
                    step04Expanded ? 'rotate-90 text-primary' : ''
                  }`} 
                />
              </div>
              
              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                step04Expanded ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'
              }`}>
                <div className="border-l-2 border-white/20 pl-8">
                  <p className="text-white/70 font-light">
                    {language === 'vi' 
                      ? 'Quá trình thi công được lập kế hoạch và quản lý chặt chẽ bởi đội ngũ giám sát giàu kinh nghiệm. Chúng tôi cam kết đảm bảo đúng tiến độ, tuân thủ thiết kế và thường xuyên cập nhật thông tin minh bạch đến bạn.'
                      : 'The construction process is meticulously planned and managed by our experienced supervision team. We are committed to on-time delivery, strict adherence to the design, and providing you with regular, transparent progress updates.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Step 05 */}
            <div className="pb-8 group transition-colors cursor-pointer">
              <div 
                className="flex items-center justify-between"
                onClick={() => setStep05Expanded(!step05Expanded)}
              >
                <div className="flex items-center gap-8">
                  <span className="text-white/40 font-light text-lg">[05]</span>
                  <h3 className="text-xl md:text-2xl font-light text-white">
                    {language === 'vi' ? 'BÀN GIAO & ĐỒNG HÀNH DÀI LÂU' : 'HANDOVER & LONG-TERM PARTNERSHIP'}
                  </h3>
                </div>
                <ArrowRight 
                  className={`w-5 h-5 text-white/40 group-hover:text-primary transition-all ${
                    step05Expanded ? 'rotate-90 text-primary' : ''
                  }`} 
                />
              </div>
              
              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                step05Expanded ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'
              }`}>
                <div className="border-l-2 border-white/20 pl-8">
                  <p className="text-white/70 font-light">
                    {language === 'vi' 
                      ? 'Dự án kết thúc bằng việc nghiệm thu kỹ lưỡng và bàn giao trọn vẹn. Nhưng mối quan hệ của chúng ta thì không. Với chính sách bảo hành, bảo trì uy tín, chúng tôi cam kết sẽ luôn đồng hành để đảm bảo không gian của bạn luôn hoàn hảo.'
                      : 'The project concludes with a thorough inspection and seamless handover. But our relationship doesn\'t end there. With our reliable warranty and maintenance policy, we are committed to being your long-term partner, ensuring your space remains perfect.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 bg-black border-t border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="mb-8">
            <h2 className="text-sm font-light tracking-widest text-muted-foreground uppercase">
              {language === 'vi' ? 'ĐỐI TÁC CỦA CHÚNG TÔI' : 'OUR PARTNERS'}
            </h2>
          </div>
          <div className="flex items-start justify-between">
            <div className="max-w-4xl">
              <p className="text-2xl md:text-3xl font-light text-foreground leading-relaxed" data-testid="text-partners-description">
                {language === 'vi' 
                  ? 'Chúng tôi tự hào hợp tác với những thương hiệu uy tín hàng đầu, mang đến những sản phẩm và dịch vụ chất lượng cao nhất cho khách hàng.'
                  : 'We are proud to work with leading prestigious brands, bringing the highest quality products and services to our clients.'
                }
              </p>
            </div>
          </div>
        </div>

        {partners && partners.length > 0 && (
          <div className="space-y-8">
            {/* First row - scrolling right */}
            <div className="relative overflow-hidden">
              <div className="flex animate-scroll-right whitespace-nowrap">
                {/* Multiple duplicates for seamless loop */}
                {Array.from({ length: 6 }).map((_, setIndex) => (
                  <div key={`set-${setIndex}`} className="flex">
                    {partners.slice(0, Math.ceil(partners.length / 2)).map((partner) => (
                      <div
                        key={`row1-${setIndex}-${partner.id}`}
                        className="flex-shrink-0 w-48 h-24 mx-4 flex items-center justify-center"
                        data-testid={`partner-logo-row1-${partner.id}`}
                      >
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Second row - scrolling left */}
            <div className="relative overflow-hidden">
              <div className="flex animate-scroll-left whitespace-nowrap">
                {/* Multiple duplicates for seamless loop */}
                {Array.from({ length: 6 }).map((_, setIndex) => (
                  <div key={`set-${setIndex}`} className="flex">
                    {partners.slice(Math.ceil(partners.length / 2)).map((partner) => (
                      <div
                        key={`row2-${setIndex}-${partner.id}`}
                        className="flex-shrink-0 w-48 h-24 mx-4 flex items-center justify-center"
                        data-testid={`partner-logo-row2-${partner.id}`}
                      >
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {partnersLoading && (
          <div className="space-y-8">
            {/* Loading skeleton for partners */}
            {[1, 2].map((row) => (
              <div key={row} className="flex justify-center">
                <div className="flex space-x-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="w-48 h-24 bg-white/10 rounded animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Contact Section */}
      <section className="py-24 bg-black border-t border-white/10">
        <div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          onMouseEnter={handleContactMouseEnter}
          onMouseLeave={handleContactMouseLeave}
        >
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-sm font-light tracking-widest text-muted-foreground uppercase">
                {language === 'vi' ? 'CÓ THẮC MẮC GÌ KHÔNG?' : 'HAVE ANY QUESTIONS?'}
              </h2>
            </div>
            <div className="flex items-start justify-between">
              <div className="max-w-4xl">
                <p className="text-2xl md:text-3xl font-light text-foreground leading-relaxed" data-testid="text-consultation">
                  {language === 'vi' 
                    ? 'Để lại yêu cầu tư vấn miễn phí và chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.'
                    : 'Leave a request for a free consultation and we will contact you as soon as possible.'
                  }
                </p>
              </div>
            </div>
          </div>
            
          {/* Expand/Collapse Button */}
          <button
              onClick={() => setContactFormExpanded(!contactFormExpanded)}
              className="flex items-center gap-4 group transition-all duration-300"
              data-testid="button-toggle-form"
            >
              <span className="text-xl font-light tracking-widest uppercase">
                {language === 'vi' ? 'GỬI YÊU CẦU' : 'LEAVE A REQUEST'}
              </span>
              <div className={`transition-transform duration-300 ${contactFormExpanded ? 'rotate-90' : 'rotate-0'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

          {/* Expandable Form */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
            contactFormExpanded ? 'max-h-[800px] opacity-100 mt-8' : 'max-h-0 opacity-0'
          }`}>
            <form onSubmit={handleSubmit} className="max-w-3xl">
            <div className="space-y-4">
              {/* First row - Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    placeholder={language === 'vi' ? 'Họ và tên' : 'Name'}
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-4 text-white placeholder-gray-400 focus:border-white focus-visible:ring-0"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder={language === 'vi' ? 'E-mail' : 'E-mail'}
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-4 text-white placeholder-gray-400 focus:border-white focus-visible:ring-0"
                    data-testid="input-email"
                  />
                </div>
              </div>
              
              {/* Second row - Phone and Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="tel"
                    placeholder={language === 'vi' ? 'Điện thoại' : 'Phone'}
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-4 text-white placeholder-gray-400 focus:border-white focus-visible:ring-0"
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder={language === 'vi' ? 'Địa chỉ' : 'Address'}
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-4 text-white placeholder-gray-400 focus:border-white focus-visible:ring-0"
                    data-testid="input-address"
                  />
                </div>
              </div>
              
              {/* Third row - Requirements */}
              <div>
                <Textarea
                  placeholder={language === 'vi' ? 'Yêu cầu / Mô tả dự án' : 'Requirements / Project Description'}
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  className="bg-transparent border border-gray-600 rounded-none px-4 py-4 text-white placeholder-gray-400 focus:border-white focus-visible:ring-0 min-h-[120px] resize-none"
                  data-testid="textarea-requirements"
                />
              </div>
              
              {/* Submit button */}
              <div className="flex justify-start pt-6">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-transparent border border-white/30 text-white hover:border-white hover:bg-white/10 px-8 py-3 font-light tracking-widest uppercase transition-all duration-300 ease-in-out rounded-none"
                  data-testid="button-leave-request"
                >
                  {mutation.isPending 
                    ? (language === 'vi' ? 'ĐANG GỬI...' : 'SENDING...') 
                    : (language === 'vi' ? 'GỬI YÊU CẦU' : 'LEAVE A REQUEST')
                  }
                </Button>
              </div>
            </div>
            </form>
          </div>
        </div>
      </section>

      {/* International Network Section */}
      <section className="py-24 bg-card border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-sm font-light tracking-widest text-muted-foreground uppercase">
                {language === 'vi' ? 'MẠNG LƯỚI TOÀN CẦU' : 'GLOBAL NETWORK'}
              </h2>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-light text-foreground leading-relaxed">
                {language === 'vi' ? 'Mạng Lưới Quốc Tế' : 'International Network'}
              </p>
            </div>
          </div>

          {/* World Map with Markers */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            {/* Background map */}
            <svg 
              className="absolute inset-0 w-full h-full opacity-20"
              viewBox="0 0 1000 500" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Simplified world map outline */}
              <path 
                d="M 100 100 L 150 80 L 180 90 L 200 85 L 220 100 L 240 95 L 260 110 L 280 100 L 300 120 L 280 140 L 260 150 L 240 145 L 220 160 L 200 155 L 180 170 L 160 165 L 140 180 L 120 175 L 100 190 Z M 350 80 L 400 70 L 450 85 L 480 80 L 510 95 L 530 90 L 550 105 L 530 120 L 510 130 L 490 125 L 470 140 L 450 135 L 430 150 L 410 145 L 390 160 L 370 155 L 350 170 Z M 600 90 L 650 85 L 680 100 L 710 95 L 740 110 L 760 105 L 780 120 L 800 115 L 820 130 L 800 145 L 780 155 L 760 150 L 740 165 L 720 160 L 700 175 L 680 170 L 660 185 L 640 180 L 620 195 L 600 190 Z M 150 250 L 180 240 L 210 255 L 230 250 L 250 265 L 270 260 L 290 275 L 270 290 L 250 300 L 230 295 L 210 310 L 190 305 L 170 320 L 150 315 Z M 350 300 L 380 295 L 410 310 L 430 305 L 450 320 L 470 315 L 490 330 L 470 345 L 450 355 L 430 350 L 410 365 L 390 360 L 370 375 L 350 370 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>

            {/* Location Markers */}
            <div className="absolute inset-0">
              {/* Canada */}
              <div className="absolute" style={{ top: '20%', left: '15%' }}>
                <div className="relative group">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer">
                    <svg className="w-4 h-4 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Canada
                  </span>
                </div>
              </div>

              {/* Mexico */}
              <div className="absolute" style={{ top: '35%', left: '18%' }}>
                <div className="relative group">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer">
                    <svg className="w-4 h-4 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Mexico
                  </span>
                </div>
              </div>

              {/* Bolivia */}
              <div className="absolute" style={{ top: '65%', left: '25%' }}>
                <div className="relative group">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer">
                    <svg className="w-4 h-4 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Bolivia
                  </span>
                </div>
              </div>

              {/* South Africa */}
              <div className="absolute" style={{ top: '75%', left: '48%' }}>
                <div className="relative group">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer">
                    <svg className="w-4 h-4 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    South Africa
                  </span>
                </div>
              </div>

              {/* UK */}
              <div className="absolute" style={{ top: '22%', left: '45%' }}>
                <div className="relative group">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer">
                    <svg className="w-4 h-4 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    UK
                  </span>
                </div>
              </div>

              {/* France */}
              <div className="absolute" style={{ top: '28%', left: '47%' }}>
                <div className="relative group">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer">
                    <svg className="w-4 h-4 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    France
                  </span>
                </div>
              </div>

              {/* Russia */}
              <div className="absolute" style={{ top: '18%', left: '62%' }}>
                <div className="relative group">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer">
                    <svg className="w-4 h-4 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Russia
                  </span>
                </div>
              </div>

              {/* UAE */}
              <div className="absolute" style={{ top: '42%', left: '55%' }}>
                <div className="relative group">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer">
                    <svg className="w-4 h-4 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    UAE
                  </span>
                </div>
              </div>

              {/* India */}
              <div className="absolute" style={{ top: '45%', left: '64%' }}>
                <div className="relative group">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer">
                    <svg className="w-4 h-4 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    India
                  </span>
                </div>
              </div>

              {/* Mongolia */}
              <div className="absolute" style={{ top: '28%', left: '70%' }}>
                <div className="relative group">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer">
                    <svg className="w-4 h-4 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Mongolia
                  </span>
                </div>
              </div>

              {/* China */}
              <div className="absolute" style={{ top: '35%', left: '72%' }}>
                <div className="relative group">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer">
                    <svg className="w-4 h-4 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    China
                  </span>
                </div>
              </div>

              {/* Vietnam - Highlighted */}
              <div className="absolute" style={{ top: '45%', left: '75%' }}>
                <div className="relative group">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg">
                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap font-medium">
                    Vietnam
                  </span>
                </div>
              </div>

              {/* Philippines */}
              <div className="absolute" style={{ top: '50%', left: '80%' }}>
                <div className="relative group">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer">
                    <svg className="w-4 h-4 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Philippines
                  </span>
                </div>
              </div>

              {/* Indonesia */}
              <div className="absolute" style={{ top: '62%', left: '77%' }}>
                <div className="relative group">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer">
                    <svg className="w-4 h-4 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Indonesia
                  </span>
                </div>
              </div>

              {/* Australia */}
              <div className="absolute" style={{ top: '75%', left: '85%' }}>
                <div className="relative group">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer">
                    <svg className="w-4 h-4 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Australia
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
