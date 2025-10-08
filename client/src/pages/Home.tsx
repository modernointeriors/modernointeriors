import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Send, Sparkles, Headset, Users, Store } from "lucide-react";
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
  const [faq01Expanded, setFaq01Expanded] = useState(false);
  const [faq02Expanded, setFaq02Expanded] = useState(false);
  const [faq03Expanded, setFaq03Expanded] = useState(false);
  const [faq04Expanded, setFaq04Expanded] = useState(false);
  const [faq05Expanded, setFaq05Expanded] = useState(false);

  // Typing animation for process steps
  const [stepTexts, setStepTexts] = useState({
    step01: '',
    step02: '',
    step03: '',
    step04: '',
    step05: ''
  });

  // Typing animation for Step 01
  useEffect(() => {
    if (!step01Expanded) {
      setStepTexts(prev => ({ ...prev, step01: '' }));
      return;
    }

    const text = language === 'vi' 
      ? 'Chúng tôi bắt đầu bằng việc lắng nghe và phân tích sâu nhu cầu, sở thích và ngân sách của bạn. Một buổi khảo sát thực tế tại công trình sẽ giúp chúng tôi đưa ra những tư vấn phù hợp nhất.'
      : 'We begin by carefully listening to and analyzing your needs, preferences, and budget. An on-site survey of your property allows us to provide the most tailored advice.';

    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setStepTexts(prev => ({ ...prev, step01: text.slice(0, index) }));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [step01Expanded, language]);

  // Typing animation for Step 02
  useEffect(() => {
    if (!step02Expanded) {
      setStepTexts(prev => ({ ...prev, step02: '' }));
      return;
    }

    const text = language === 'vi' 
      ? 'Những ý tưởng sáng tạo được phác thảo, kết hợp cùng giải pháp công năng thông minh và thẩm mỹ tinh tế. Chúng tôi sẽ trình bày và thống nhất cùng bạn phương án thiết kế tối ưu nhất trước khi chính thức hợp tác.'
      : 'Creative ideas are sketched out, combining intelligent functional solutions with sophisticated aesthetics. We will present and finalize the optimal design proposal with you before formalizing our partnership.';

    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setStepTexts(prev => ({ ...prev, step02: text.slice(0, index) }));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [step02Expanded, language]);

  // Typing animation for Step 03
  useEffect(() => {
    if (!step03Expanded) {
      setStepTexts(prev => ({ ...prev, step03: '' }));
      return;
    }

    const text = language === 'vi' 
      ? 'Không gian mơ ước của bạn sẽ được tái hiện sống động qua các bản vẽ phối cảnh 3D và moodboard vật liệu, màu sắc. Bạn sẽ thấy trước ngôi nhà của mình một cách chân thực nhất và cùng chúng tôi tinh chỉnh đến khi hoàn toàn ưng ý.'
      : 'Your dream space is brought to life through vivid 3D renderings and mood boards showcasing materials and colors. You get to see your future home with stunning realism, and we\'ll fine-tune every detail with you until it\'s perfect.';

    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setStepTexts(prev => ({ ...prev, step03: text.slice(0, index) }));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [step03Expanded, language]);

  // Typing animation for Step 04
  useEffect(() => {
    if (!step04Expanded) {
      setStepTexts(prev => ({ ...prev, step04: '' }));
      return;
    }

    const text = language === 'vi' 
      ? 'Quá trình thi công được lập kế hoạch và quản lý chặt chẽ bởi đội ngũ giám sát giàu kinh nghiệm. Chúng tôi cam kết đảm bảo đúng tiến độ, tuân thủ thiết kế và thường xuyên cập nhật thông tin minh bạch đến bạn.'
      : 'The construction process is meticulously planned and managed by our experienced supervision team. We are committed to on-time delivery, strict adherence to the design, and providing you with regular, transparent progress updates.';

    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setStepTexts(prev => ({ ...prev, step04: text.slice(0, index) }));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [step04Expanded, language]);

  // Typing animation for Step 05
  useEffect(() => {
    if (!step05Expanded) {
      setStepTexts(prev => ({ ...prev, step05: '' }));
      return;
    }

    const text = language === 'vi' 
      ? 'Dự án kết thúc bằng việc nghiệm thu kỹ lưỡng và bàn giao trọn vẹn. Nhưng mối quan hệ của chúng ta thì không. Với chính sách bảo hành, bảo trì uy tín, chúng tôi cam kết sẽ luôn đồng hành để đảm bảo không gian của bạn luôn hoàn hảo.'
      : 'The project concludes with a thorough inspection and seamless handover. But our relationship doesn\'t end there. With our reliable warranty and maintenance policy, we are committed to being your long-term partner, ensuring your space remains perfect.';

    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setStepTexts(prev => ({ ...prev, step05: text.slice(0, index) }));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [step05Expanded, language]);

  // Scroll animation with specific directions and stagger delays
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const element = entry.target;
            element.classList.add('animated');
            
            // All cards use simple fade-in from bottom
            if (element.classList.contains('project-card') || 
                element.classList.contains('article-card') ||
                element.classList.contains('advantage-card')) {
              element.classList.add('animate-fade-in-up');
            }
            // Buttons and arrows from right
            else if (element.classList.contains('view-more-btn') || 
                     element.tagName === 'BUTTON') {
              element.classList.add('animate-slide-in-from-right');
            }
            // Titles and other elements from left
            else {
              element.classList.add('animate-slide-in-from-left');
            }
          }
        });
      },
      { threshold: 0.08, rootMargin: '50px 0px -50px 0px' }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll('.scroll-animate, .advantage-card, .process-step, .project-card, .article-card, .view-more-btn');
      elements.forEach((el) => observer.observe(el));
    };

    observeElements();

    const timer = setTimeout(observeElements, 600);

    // Reset and re-trigger animation when back to top
    const handleScroll = () => {
      if (window.scrollY < 50) {
        document.querySelectorAll('.animated').forEach((el) => {
          el.classList.remove('animated', 'animate-fade-in-up', 'animate-slide-in-from-left', 'animate-slide-in-from-right');
        });
        // Re-trigger animations after a brief delay
        setTimeout(() => {
          observeElements();
        }, 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Quick contact form state (matching Contact page)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    requirements: ''
  });

  // Typing animation for form placeholders
  const [placeholders, setPlaceholders] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    requirements: ''
  });

  useEffect(() => {
    // Only run typing animation when form is expanded
    if (!contactFormExpanded) {
      // Reset placeholders when form is closed
      setPlaceholders({
        name: '',
        email: '',
        phone: '',
        address: '',
        requirements: ''
      });
      return;
    }

    const texts = {
      name: language === 'vi' ? 'Họ và tên' : 'Name',
      email: 'E-mail',
      phone: language === 'vi' ? 'Điện thoại' : 'Phone',
      address: language === 'vi' ? 'Địa chỉ' : 'Address',
      requirements: language === 'vi' ? 'Yêu cầu / Mô tả dự án' : 'Requirements / Project Description'
    };

    const delays = {
      name: 0,
      email: 200,
      phone: 400,
      address: 600,
      requirements: 800
    };

    const timeouts: NodeJS.Timeout[] = [];
    const intervals: NodeJS.Timeout[] = [];

    const typeText = (field: keyof typeof texts, text: string, delay: number) => {
      const timeout = setTimeout(() => {
        let index = 0;
        const interval = setInterval(() => {
          if (index <= text.length) {
            setPlaceholders(prev => ({ ...prev, [field]: text.slice(0, index) }));
            index++;
          } else {
            clearInterval(interval);
          }
        }, 50);
        intervals.push(interval);
      }, delay);
      timeouts.push(timeout);
    };

    typeText('name', texts.name, delays.name);
    typeText('email', texts.email, delays.email);
    typeText('phone', texts.phone, delays.phone);
    typeText('address', texts.address, delays.address);
    typeText('requirements', texts.requirements, delays.requirements);

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [language, contactFormExpanded]);

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
      <section id="featured-projects" className="py-16 bg-card">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-sm font-light tracking-widest text-muted-foreground uppercase scroll-animate">
                {homepageContent?.featuredBadge || t('featured.projectsTitle')}
              </h2>
            </div>
            <div className="flex items-start justify-between">
              <div className="max-w-4xl">
                <p className="text-2xl md:text-3xl font-light text-foreground leading-relaxed scroll-animate">
                  {homepageContent?.featuredDescription || t('featured.projectsDesc')}
                </p>
              </div>
              <div className="flex-shrink-0 ml-8">
                <Button 
                  variant="ghost" 
                  size="default"
                  asChild
                  className="rounded-none hover:bg-transparent text-white/60 hover:text-white view-more-btn scroll-animate transition-colors duration-300"
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
                  {featuredProjects?.slice(0, 10).map((project, index) => (
                    <div 
                      key={project.id} 
                      className="group relative overflow-hidden cursor-pointer h-[28rem] w-72 flex-shrink-0 rounded-none project-card"
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

      {/* Quality Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden scroll-animate">
        <img 
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Quality Interior Design"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 w-full items-center">
            <div className="text-white space-y-6 scroll-animate">
              <p className="text-3xl md:text-5xl font-light leading-relaxed">
                {language === 'vi' 
                  ? 'Mỗi chi tiết được lựa chọn để nội thất phục vụ lâu dài và trông hoàn hảo.'
                  : 'Each detail is selected so that the interior will serve for a long time and look impeccable.'}
              </p>
            </div>
            <div className="text-white space-y-6 scroll-animate">
              <p className="text-xl md:text-2xl font-light leading-relaxed">
                {language === 'vi'
                  ? 'Chúng tôi chỉ sử dụng vật liệu và nội thất chất lượng cao từ các nhà sản xuất đáng tin cậy.'
                  : 'We use only high-quality materials and furniture from trusted manufacturers.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured News Section */}
      <section id="featured-news" className="py-16 bg-background">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-sm font-light tracking-widest text-muted-foreground uppercase scroll-animate">
                {t('featured.newsTitle')}
              </h2>
            </div>
            <div className="flex items-start justify-between">
              <div className="max-w-4xl">
                <p className="text-2xl md:text-3xl font-light text-foreground leading-relaxed scroll-animate">
                  {t('featured.newsDesc')}
                </p>
              </div>
              <div className="flex-shrink-0 ml-8">
                <Button 
                  variant="ghost" 
                  size="default"
                  asChild
                  className="rounded-none hover:bg-transparent text-white/60 hover:text-white view-more-btn scroll-animate transition-colors duration-300"
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
                  {featuredArticles?.slice(0, 10).map((article, index) => (
                    <Card 
                      key={article.id} 
                      className="group overflow-hidden cursor-pointer h-[28rem] w-72 flex-shrink-0 rounded-none article-card"
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
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
              {/* Left side text */}
              <p className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-white scroll-animate">
                {language === 'vi' 
                  ? 'Mỗi chi tiết được lựa chọn để nội thất phục vụ lâu dài và luôn hoàn hảo.'
                  : 'Each detail is selected so that the interior will serve for a long time and look impeccable.'
                }
              </p>
              
              {/* Right side content */}
              <p className="text-xl md:text-2xl font-light leading-relaxed text-white scroll-animate">
                {language === 'vi' 
                  ? 'Chúng tôi chỉ sử dụng vật liệu chất lượng cao và đồ nội thất từ các nhà sản xuất uy tín.'
                  : 'We use only high-quality materials and furniture from trusted manufacturers.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section 
        className="py-16 bg-black"
        onMouseEnter={handleProcessSectionMouseEnter}
        onMouseLeave={handleProcessSectionMouseLeave}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="mb-16">
            <h2 className="text-sm font-light tracking-widest text-white/60 mb-8 scroll-animate">
              {language === 'vi' ? 'HÀNH TRÌNH KIẾN TẠO KHÔNG GIAN SỐNG CỦA BẠN' : 'THE JOURNEY TO YOUR DREAM SPACE'}
            </h2>
            <div className="max-w-4xl">
              <p className="text-2xl md:text-3xl font-light text-white leading-relaxed scroll-animate">
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
            <div className="pb-8 group transition-colors cursor-pointer process-step scroll-animate animate-delay-100">
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
                  className={`w-5 h-5 text-white/40 group-hover:text-white transition-all ${
                    step01Expanded ? 'rotate-90 text-white' : ''
                  }`} 
                />
              </div>
              
              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                step01Expanded ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'
              }`}>
                <div className="border-l-2 border-white/20 pl-8">
                  <p className="text-white/70 font-light">
                    {stepTexts.step01}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 02 */}
            <div className="pb-8 group transition-colors cursor-pointer process-step scroll-animate animate-delay-200">
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
                  className={`w-5 h-5 text-white/40 group-hover:text-white transition-all ${
                    step02Expanded ? 'rotate-90 text-white' : ''
                  }`} 
                />
              </div>
              
              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                step02Expanded ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'
              }`}>
                <div className="border-l-2 border-white/20 pl-8">
                  <p className="text-white/70 font-light">
                    {stepTexts.step02}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 03 - With Expandable Content */}
            <div className="pb-8 group transition-colors cursor-pointer process-step scroll-animate animate-delay-300">
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
                  className={`w-5 h-5 text-white/40 group-hover:text-white transition-all ${
                    step03Expanded ? 'rotate-90 text-white' : ''
                  }`} 
                />
              </div>
              
              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                step03Expanded ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'
              }`}>
                <div className="border-l-2 border-white/20 pl-8">
                  <p className="text-white/70 font-light">
                    {stepTexts.step03}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 04 */}
            <div className="pb-8 group transition-colors cursor-pointer process-step scroll-animate animate-delay-400">
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
                  className={`w-5 h-5 text-white/40 group-hover:text-white transition-all ${
                    step04Expanded ? 'rotate-90 text-white' : ''
                  }`} 
                />
              </div>
              
              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                step04Expanded ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'
              }`}>
                <div className="border-l-2 border-white/20 pl-8">
                  <p className="text-white/70 font-light">
                    {stepTexts.step04}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 05 */}
            <div className="pb-8 group transition-colors cursor-pointer process-step scroll-animate animate-delay-500">
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
                  className={`w-5 h-5 text-white/40 group-hover:text-white transition-all ${
                    step05Expanded ? 'rotate-90 text-white' : ''
                  }`} 
                />
              </div>
              
              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                step05Expanded ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'
              }`}>
                <div className="border-l-2 border-white/20 pl-8">
                  <p className="text-white/70 font-light">
                    {stepTexts.step05}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-black">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16">
            <h2 className="text-sm font-light tracking-widest text-muted-foreground uppercase mb-4 scroll-animate">
              {language === 'vi' ? 'LỢI THẾ CẠNH TRANH' : 'ADVANTAGES'}
            </h2>
            <h3 className="text-3xl md:text-4xl font-light text-white scroll-animate">
              {language === 'vi' ? 'Tại sao chọn Moderno Interiors' : 'Why Choose Moderno Interiors'}
            </h3>
          </div>

          {/* Advantages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {/* Advantage 1 */}
            <div className="group advantage-card scroll-animate transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-95 hover:shadow-2xl hover:shadow-white/10 p-6 rounded-none">
              <div className="mb-6">
                <div className="w-16 h-16 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white/40 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              <h4 className="text-lg font-light text-white/60 group-hover:text-white mb-4 uppercase tracking-wide transition-colors duration-300">
                {language === 'vi' ? 'Sáng Tạo & Cá Nhân Hóa' : 'Innovation & Customization'}
              </h4>
              <p className="text-white/50 group-hover:text-white/90 font-light text-sm leading-relaxed transition-colors duration-300">
                {language === 'vi' 
                  ? 'Với hơn 200+ bằng sáng chế quốc gia và 8.000+ SKU, chúng tôi mang đến vô số lựa chọn cho không gian của bạn. Mỗi năm, hơn 300+ sản phẩm mới được ra mắt để đáp ứng xu hướng thiết kế hiện đại.'
                  : 'With over 200+ national patents and 8,000+ SKUs, we offer endless choices for your space. Each year, over 300+ new products are launched to meet modern design trends.'
                }
              </p>
            </div>

            {/* Advantage 2 */}
            <div className="group advantage-card scroll-animate transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-95 hover:shadow-2xl hover:shadow-white/10 p-6 rounded-none">
              <div className="mb-6">
                <div className="w-16 h-16 flex items-center justify-center">
                  <Headset className="w-8 h-8 text-white/40 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              <h4 className="text-lg font-light text-white/60 group-hover:text-white mb-4 uppercase tracking-wide transition-colors duration-300">
                {language === 'vi' ? 'Dịch Vụ Trọn Gói' : 'End-to-End Customer Service'}
              </h4>
              <p className="text-white/50 group-hover:text-white/90 font-light text-sm leading-relaxed transition-colors duration-300">
                {language === 'vi' 
                  ? 'Từ thiết kế đến thi công, từ logistics đến bảo hành, chúng tôi cung cấp dịch vụ toàn diện. Hệ thống đào tạo và marketing chuyên nghiệp được tích hợp trong gói khuyến mãi thương hiệu của chúng tôi.'
                  : 'From design to construction, from logistics to warranty, we provide comprehensive services. Professional training and marketing systems are included in our brand promotion package.'
                }
              </p>
            </div>

            {/* Advantage 3 */}
            <div className="group advantage-card scroll-animate transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-95 hover:shadow-2xl hover:shadow-white/10 p-6 rounded-none">
              <div className="mb-6">
                <div className="w-16 h-16 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white/40 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              <h4 className="text-lg font-light text-white/60 group-hover:text-white mb-4 uppercase tracking-wide transition-colors duration-300">
                {language === 'vi' ? 'Đội Ngũ Thiết Kế Chuyên Nghiệp' : 'Professional Design Team'}
              </h4>
              <p className="text-white/50 group-hover:text-white/90 font-light text-sm leading-relaxed transition-colors duration-300">
                {language === 'vi' 
                  ? 'Chúng tôi vinh dự được trao nhiều giải thưởng thiết kế uy tín tại Đức, Nhật Bản, Trung Quốc và khu vực châu Á-Thái Bình Dương. Đội ngũ thiết kế chuyên nghiệp sẽ mang đến giải pháp hoàn hảo cho không gian của bạn.'
                  : 'We have been honored with multiple prestigious design awards in Germany, Japan, China, and across the Asia-Pacific region. Our professional design team will provide the perfect solution for your space.'
                }
              </p>
            </div>

            {/* Advantage 4 */}
            <div className="group advantage-card scroll-animate transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-95 hover:shadow-2xl hover:shadow-white/10 p-6 rounded-none">
              <div className="mb-6">
                <div className="w-16 h-16 flex items-center justify-center">
                  <Store className="w-8 h-8 text-white/40 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              <h4 className="text-lg font-light text-white/60 group-hover:text-white mb-4 uppercase tracking-wide transition-colors duration-300">
                {language === 'vi' ? 'Showroom & Triển Lãm' : 'Showroom & Exhibition'}
              </h4>
              <p className="text-white/50 group-hover:text-white/90 font-light text-sm leading-relaxed transition-colors duration-300">
                {language === 'vi' 
                  ? 'Chúng tôi sở hữu showroom 50.000m² do công ty quản lý với hơn 300+ nhà phân phối trên toàn quốc. Đội ngũ chuyên gia thiết kế và triển lãm chuyên nghiệp đảm bảo trải nghiệm tuyệt vời cho khách hàng.'
                  : 'We have a 50,000m² company-owned flagship showroom and 300+ distributors nationwide. Our dedicated design and exhibition professionals ensure excellent customer experience.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-black overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="mb-8">
            <h2 className="text-sm font-light tracking-widest text-muted-foreground uppercase scroll-animate">
              {language === 'vi' ? 'ĐỐI TÁC CỦA CHÚNG TÔI' : 'OUR PARTNERS'}
            </h2>
          </div>
          <div className="flex items-start justify-between">
            <div className="max-w-4xl">
              <p className="text-2xl md:text-3xl font-light text-foreground leading-relaxed scroll-animate" data-testid="text-partners-description">
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
      <section className="py-16 bg-black">
        <div 
          className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8"
          onMouseEnter={handleContactMouseEnter}
          onMouseLeave={handleContactMouseLeave}
        >
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-sm font-light tracking-widest text-muted-foreground uppercase scroll-animate">
                {language === 'vi' ? 'CÓ THẮC MẮC GÌ KHÔNG?' : 'HAVE ANY QUESTIONS?'}
              </h2>
            </div>
            <div className="flex items-start justify-between">
              <div className="max-w-4xl">
                <p className="text-2xl md:text-3xl font-light text-foreground leading-relaxed scroll-animate" data-testid="text-consultation">
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
              className="flex items-center gap-4 group transition-all duration-300 view-more-btn scroll-animate"
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
                    placeholder={placeholders.name}
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-4 text-white placeholder-gray-400 focus:border-white focus-visible:ring-0"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder={placeholders.email}
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
                    placeholder={placeholders.phone}
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-4 text-white placeholder-gray-400 focus:border-white focus-visible:ring-0"
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder={placeholders.address}
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
                  placeholder={placeholders.requirements}
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

      {/* FAQ Section */}
      <section className="py-16 bg-black">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="mb-16">
            <h2 className="text-sm font-light tracking-widest text-white/60 mb-8 scroll-animate">
              {language === 'vi' ? 'CÂU HỎI THƯỜNG GẶP' : 'FREQUENTLY ASKED QUESTIONS'}
            </h2>
            <div className="max-w-4xl">
              <p className="text-2xl md:text-3xl font-light text-white leading-relaxed scroll-animate">
                {language === 'vi' 
                  ? 'TÌM HIỂU THÊM VỀ QUY TRÌNH THIẾT KẾ VÀ DỊCH VỤ CỦA CHÚNG TÔI.'
                  : 'LEARN MORE ABOUT OUR DESIGN PROCESS AND SERVICES.'
                }
              </p>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-8">
            {/* FAQ 01 */}
            <div className="pb-8 group transition-colors cursor-pointer scroll-animate animate-delay-100">
              <div 
                className="flex items-center justify-between"
                onClick={() => setFaq01Expanded(!faq01Expanded)}
              >
                <div className="flex items-center gap-8">
                  <span className="text-white/40 font-light text-lg">[01]</span>
                  <h3 className="text-xl md:text-2xl font-light text-white">
                    {language === 'vi' ? 'Chi phí thiết kế nội thất được tính như thế nào?' : 'How is the interior design cost calculated?'}
                  </h3>
                </div>
                <ArrowRight 
                  className={`w-5 h-5 text-white/40 group-hover:text-white transition-all ${
                    faq01Expanded ? 'rotate-90 text-white' : ''
                  }`} 
                />
              </div>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                faq01Expanded ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'
              }`}>
                <div className="border-l-2 border-white/20 pl-8">
                  <p className="text-white/70 font-light">
                    {language === 'vi'
                      ? 'Chi phí thiết kế nội thất phụ thuộc vào diện tích, phong cách thiết kế, chất liệu sử dụng và độ phức tạp của dự án. Chúng tôi cung cấp báo giá chi tiết sau buổi khảo sát và tư vấn ban đầu, đảm bảo minh bạch và phù hợp với ngân sách của bạn.'
                      : 'Interior design costs depend on the area, design style, materials used, and project complexity. We provide a detailed quote after the initial survey and consultation, ensuring transparency and alignment with your budget.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ 02 */}
            <div className="pb-8 group transition-colors cursor-pointer scroll-animate animate-delay-200">
              <div 
                className="flex items-center justify-between"
                onClick={() => setFaq02Expanded(!faq02Expanded)}
              >
                <div className="flex items-center gap-8">
                  <span className="text-white/40 font-light text-lg">[02]</span>
                  <h3 className="text-xl md:text-2xl font-light text-white">
                    {language === 'vi' ? 'Thời gian hoàn thành một dự án là bao lâu?' : 'How long does it take to complete a project?'}
                  </h3>
                </div>
                <ArrowRight 
                  className={`w-5 h-5 text-white/40 group-hover:text-white transition-all ${
                    faq02Expanded ? 'rotate-90 text-white' : ''
                  }`} 
                />
              </div>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                faq02Expanded ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'
              }`}>
                <div className="border-l-2 border-white/20 pl-8">
                  <p className="text-white/70 font-light">
                    {language === 'vi'
                      ? 'Thời gian thực hiện dự án thường dao động từ 2-6 tháng tùy thuộc vào quy mô và yêu cầu. Giai đoạn thiết kế mất khoảng 2-4 tuần, sau đó là thi công và hoàn thiện. Chúng tôi cam kết tiến độ rõ ràng và cập nhật thường xuyên.'
                      : 'Project completion time typically ranges from 2-6 months depending on scale and requirements. The design phase takes about 2-4 weeks, followed by construction and finishing. We commit to clear timelines and regular updates.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ 03 */}
            <div className="pb-8 group transition-colors cursor-pointer scroll-animate animate-delay-300">
              <div 
                className="flex items-center justify-between"
                onClick={() => setFaq03Expanded(!faq03Expanded)}
              >
                <div className="flex items-center gap-8">
                  <span className="text-white/40 font-light text-lg">[03]</span>
                  <h3 className="text-xl md:text-2xl font-light text-white">
                    {language === 'vi' ? 'Tôi có thể tham gia vào quá trình thiết kế không?' : 'Can I participate in the design process?'}
                  </h3>
                </div>
                <ArrowRight 
                  className={`w-5 h-5 text-white/40 group-hover:text-white transition-all ${
                    faq03Expanded ? 'rotate-90 text-white' : ''
                  }`} 
                />
              </div>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                faq03Expanded ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'
              }`}>
                <div className="border-l-2 border-white/20 pl-8">
                  <p className="text-white/70 font-light">
                    {language === 'vi'
                      ? 'Hoàn toàn có thể! Sự tham gia của bạn là rất quan trọng. Chúng tôi khuyến khích bạn chia sẻ ý tưởng, góp ý trong suốt quá trình từ khâu concept đến hoàn thiện. Mọi quyết định quan trọng đều được trao đổi và thống nhất với bạn.'
                      : 'Absolutely! Your participation is crucial. We encourage you to share ideas and feedback throughout the process from concept to completion. All important decisions are discussed and agreed upon with you.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ 04 */}
            <div className="pb-8 group transition-colors cursor-pointer scroll-animate animate-delay-400">
              <div 
                className="flex items-center justify-between"
                onClick={() => setFaq04Expanded(!faq04Expanded)}
              >
                <div className="flex items-center gap-8">
                  <span className="text-white/40 font-light text-lg">[04]</span>
                  <h3 className="text-xl md:text-2xl font-light text-white">
                    {language === 'vi' ? 'Có thể sửa đổi thiết kế sau khi đã duyệt không?' : 'Can the design be modified after approval?'}
                  </h3>
                </div>
                <ArrowRight 
                  className={`w-5 h-5 text-white/40 group-hover:text-white transition-all ${
                    faq04Expanded ? 'rotate-90 text-white' : ''
                  }`} 
                />
              </div>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                faq04Expanded ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'
              }`}>
                <div className="border-l-2 border-white/20 pl-8">
                  <p className="text-white/70 font-light">
                    {language === 'vi'
                      ? 'Có thể điều chỉnh trong giai đoạn thiết kế. Sau khi duyệt bản vẽ thi công, mọi thay đổi sẽ được đánh giá về tác động đến tiến độ và chi phí. Chúng tôi luôn cố gắng đáp ứng yêu cầu của bạn một cách hợp lý nhất.'
                      : 'Modifications are possible during the design phase. After construction drawings are approved, any changes will be assessed for impact on timeline and costs. We always strive to accommodate your requests reasonably.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ 05 */}
            <div className="pb-8 group transition-colors cursor-pointer scroll-animate animate-delay-500">
              <div 
                className="flex items-center justify-between"
                onClick={() => setFaq05Expanded(!faq05Expanded)}
              >
                <div className="flex items-center gap-8">
                  <span className="text-white/40 font-light text-lg">[05]</span>
                  <h3 className="text-xl md:text-2xl font-light text-white">
                    {language === 'vi' ? 'Chúng tôi có bảo hành sau khi hoàn thành không?' : 'Do you provide warranty after completion?'}
                  </h3>
                </div>
                <ArrowRight 
                  className={`w-5 h-5 text-white/40 group-hover:text-white transition-all ${
                    faq05Expanded ? 'rotate-90 text-white' : ''
                  }`} 
                />
              </div>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                faq05Expanded ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0'
              }`}>
                <div className="border-l-2 border-white/20 pl-8">
                  <p className="text-white/70 font-light">
                    {language === 'vi'
                      ? 'Chúng tôi cam kết bảo hành 12-24 tháng cho công trình thi công và 1-5 năm cho đồ nội thất tùy từng sản phẩm. Đội ngũ kỹ thuật sẵn sàng hỗ trợ bảo trì và sửa chữa trong thời gian bảo hành.'
                      : 'We commit to a 12-24 month warranty for construction work and 1-5 years for furniture depending on the product. Our technical team is ready to support maintenance and repairs during the warranty period.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
