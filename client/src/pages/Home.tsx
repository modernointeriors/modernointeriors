import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroSlider from "@/components/HeroSlider";
import ScrollableContainer from "@/components/ScrollableContainer";
import { Progress } from "@/components/ui/progress";
import type { Project, HomepageContent, Article } from "@shared/schema";

export default function Home() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showLoading, setShowLoading] = useState(true);
  const [step01Expanded, setStep01Expanded] = useState(false);
  const [step02Expanded, setStep02Expanded] = useState(false);
  const [step03Expanded, setStep03Expanded] = useState(false);
  const [step04Expanded, setStep04Expanded] = useState(false);
  const [step05Expanded, setStep05Expanded] = useState(false);
  const [processSectionHoverTimer, setProcessSectionHoverTimer] = useState<NodeJS.Timeout | null>(null);
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
                alt="MODERNO INTERIORS" 
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
                {homepageContent?.featuredBadge || 'Featured Projects'}
              </h2>
            </div>
            <div className="flex items-start justify-between">
              <div className="max-w-4xl">
                <p className="text-2xl md:text-3xl font-light text-foreground leading-relaxed">
                  {homepageContent?.featuredDescription || 'Discover our latest projects where innovation meets elegance.'}
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
                    View More Projects <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="overflow-hidden w-80 flex-shrink-0">
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
              {/* Scrollable Projects Grid */}
              <ScrollableContainer>
                <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                  {featuredProjects?.slice(0, 10).map((project) => (
                    <Card 
                      key={project.id} 
                      className="group overflow-hidden hover-scale cursor-pointer w-80 flex-shrink-0"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      <div className="relative">
                        <img 
                          src={Array.isArray(project.images) && project.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'} 
                          alt={project.title}
                          className="w-full h-48 object-cover"
                          data-testid={`img-project-${project.id}`}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-sans font-light mb-2 line-clamp-1" data-testid={`text-title-${project.id}`}>{project.title}</h3>
                        <p className="text-muted-foreground mb-3 text-sm" data-testid={`text-category-${project.id}`}>
                          {project.category} • {project.location}
                        </p>
                        <p className="text-foreground/80 mb-4 text-sm line-clamp-2" data-testid={`text-description-${project.id}`}>
                          {project.description}
                        </p>
                        {(project.area || project.duration) && (
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            {project.area && (
                              <div>
                                <h5 className="font-light mb-1">Area</h5>
                                <p className="text-muted-foreground">{project.area}</p>
                              </div>
                            )}
                            {project.duration && (
                              <div>
                                <h5 className="font-light mb-1">Duration</h5>
                                <p className="text-muted-foreground">{project.duration}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
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
                {language === 'vi' ? 'Tin tức nổi bật' : 'Featured News'}
              </h2>
            </div>
            <div className="flex items-start justify-between">
              <div className="max-w-4xl">
                <p className="text-2xl md:text-3xl font-light text-foreground leading-relaxed">
                  {language === 'vi' 
                    ? 'Khám phá những xu hướng thiết kế mới nhất và các bài viết chuyên sâu từ đội ngũ chuyên gia của chúng tôi.'
                    : 'Discover the latest design trends and expert insights from our professional team.'}
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
                    {language === 'vi' ? 'Xem thêm tin tức' : 'View More News'} 
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
                  <Card key={i} className="overflow-hidden w-80 flex-shrink-0">
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
              {/* Scrollable Articles Grid */}
              <ScrollableContainer>
                <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                  {featuredArticles?.slice(0, 10).map((article) => (
                    <Card 
                      key={article.id} 
                      className="group overflow-hidden hover-scale cursor-pointer w-80 flex-shrink-0"
                      onClick={() => navigate(`/blog/${article.slug}`)}
                    >
                      <div className="relative">
                        <img 
                          src={article.featuredImage || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'} 
                          alt={article.title}
                          className="w-full h-48 object-cover"
                          data-testid={`img-article-${article.id}`}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
    </div>
  );
}
