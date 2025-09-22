import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage, type Language } from "@/contexts/LanguageContext";

interface LayoutProps {
  children: React.ReactNode;
}

const getNavigation = (t: (key: string) => string, language: string) => {
  const prefix = language === 'en' ? '/en' : '/vi';
  return [
    { name: t('nav.home'), href: `${prefix}`, key: 'home' },
    { name: t('nav.about'), href: `${prefix}/about`, key: 'about' },
    { name: t('nav.projects'), href: `${prefix}/portfolio`, key: 'portfolio' },
    { name: t('nav.news'), href: `${prefix}/blog`, key: 'news' },
    { name: t('nav.contacts'), href: `${prefix}/contact`, key: 'contact' }
  ];
};

export default function Layout({ children }: LayoutProps) {
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navigation = getNavigation(t, language);

  // Language switching with URL update
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    // Get current page path without language prefix
    const currentPage = location.replace(/^\/(en|vi)/, '') || '/';
    const newPath = lang === 'en' ? `/en${currentPage}` : `/vi${currentPage}`;
    navigate(newPath, { replace: true });
  };

  // No URL-based language detection needed

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";
      
      if (direction === "down" && scrollY > 100) {
        setIsScrolled(true);
      } else if (direction === "up" || scrollY < 50) {
        setIsScrolled(false);
      }
      
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header with Navigation */}
      <header className={`fixed top-0 left-16 right-0 z-50 bg-black/50 backdrop-blur-sm transition-transform duration-300 ${
        isScrolled ? '-translate-y-full' : 'translate-y-0'
      }`}>
        <div className="flex items-center justify-between py-4 px-6">
          {/* Logo */}
          <div className="text-white text-lg font-light tracking-wider">
            <img 
              src="/attached_assets/logo.white.png" 
              alt="MODERNO INTERIORS STUDIO" 
              className="h-8 w-auto"
            />
          </div>
          
          {/* Language Selector */}
          <div className="flex items-center space-x-1 text-sm">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`transition-colors px-2 py-1 ${
                language === 'en' ? 'text-primary' : 'text-zinc-400 hover:text-primary'
              }`}
              data-testid="lang-en"
            >
              ENG
            </button>
            <span className="text-zinc-600">|</span>
            <button
              onClick={() => handleLanguageChange('vi')}
              className={`transition-colors px-2 py-1 ${
                language === 'vi' ? 'text-primary' : 'text-zinc-400 hover:text-primary'
              }`}
              data-testid="lang-vi"
            >
              VIE
            </button>
          </div>
        </div>
      </header>

      {/* Vertical Navigation Sidebar - IIDA Style */}
      <aside className="fixed top-0 left-0 h-screen w-16 z-40 bg-black border-r border-white/10 flex flex-col items-center justify-center">
        {/* Hamburger Menu at Center */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="lg"
              className="group text-white hover:text-primary w-14 h-14 rounded-none hover:bg-transparent flex items-center justify-center"
              aria-label="Open navigation menu"
              data-testid="button-main-menu"
            >
              <div className="flex flex-col items-center justify-center space-y-2 rotate-90 group-hover:text-primary">
                <div className="w-8 h-0.5 bg-white group-hover:bg-primary transition-colors"></div>
                <div className="w-8 h-0.5 bg-white group-hover:bg-primary transition-colors"></div>
                <div className="w-8 h-0.5 bg-white group-hover:bg-primary transition-colors"></div>
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] sm:w-[400px] bg-background border-border [&>button]:hidden">
            <SheetHeader>
              <SheetTitle className="text-lg font-sans font-light text-primary">
                <img 
                  src="/attached_assets/logo.white.png" 
                  alt="MODERNO INTERIORS" 
                  className="h-12 w-auto"
                />
              </SheetTitle>
              <SheetDescription className="sr-only">Navigation menu</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col h-full">
                {/* Navigation Menu */}
                <div className="flex-1 py-8">
                  <div className="space-y-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block text-lg font-light transition-colors hover:text-primary ${
                          isActive(item.href)
                            ? 'text-primary'
                            : 'text-foreground'
                        }`}
                        data-testid={`menu-nav-${item.key}`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Additional Menu Items - Moved to bottom */}
                <div className="pb-6 border-t border-border pt-8">
                  <div className="space-y-4">
                    <Link 
                      href={`${language === 'en' ? '/en' : '/vi'}/services`} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Services
                    </Link>
                    <Link 
                      href={`${language === 'en' ? '/en' : '/vi'}/about`} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Our Story
                    </Link>
                    <Link 
                      href={`${language === 'en' ? '/en' : '/vi'}/contact`} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Get in Touch
                    </Link>
                  </div>
                </div>
                
                {/* Menu Footer */}
                <div className="py-6 border-t border-border">
                </div>
              </div>
            </SheetContent>
        </Sheet>
      </aside>


      {/* Main Content - Adjusted for header and sidebar */}
      <main className="ml-16 pb-20 md:pb-16 mb-8">{children}</main>

      {/* Footer - Updated with dark design matching the provided image */}
      <footer className="ml-16 bg-black text-white pt-24 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            {/* Corporate Office */}
            <div>
              <h4 className="text-sm tracking-widest text-white mb-6 font-light">
                {language === 'vi' ? 'VĂN PHÒNG CHÍNH' : 'CORPORATE OFFICE'}
              </h4>
              <div className="space-y-1">
                {language === 'vi' ? (
                  <>
                    <p className="text-white/80 font-light">Lầu 1, Tòa nhà Sabay</p>
                    <p className="text-white/80 font-light">140B Nguyễn Văn Trỗi</p>
                    <p className="text-white/80 font-light">Quận Phú Nhuận</p>
                    <p className="text-white/80 font-light">TP. Hồ Chí Minh, Việt Nam</p>
                  </>
                ) : (
                  <>
                    <p className="text-white/80 font-light">1st Floor, Sabay Building</p>
                    <p className="text-white/80 font-light">140B Nguyen Van Troi</p>
                    <p className="text-white/80 font-light">Phuong 8, Quan Phu Nhuan</p>
                    <p className="text-white/80 font-light">Ho Chi Minh City, Vietnam</p>
                  </>
                )}
                <p className="text-white/80 font-light mt-4">094 367 9879</p>
              </div>
            </div>
            
            {/* Navigation */}
            <div>
              <h4 className="text-sm tracking-widest text-white mb-6 font-light">
                {language === 'vi' ? 'ĐIỀU HƯỚNG' : 'NAVIGATION'}
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href={`${language === 'en' ? '/en' : '/vi'}`} className="text-white/80 hover:text-white transition-colors font-light">
                    {language === 'vi' ? 'TRANG CHỦ' : 'HOME'}
                  </Link>
                </li>
                <li>
                  <Link href={`${language === 'en' ? '/en' : '/vi'}/about`} className="text-white/80 hover:text-white transition-colors font-light">
                    {language === 'vi' ? 'GIỚI THIỆU' : 'ABOUT'}
                  </Link>
                </li>
                <li>
                  <Link href={`${language === 'en' ? '/en' : '/vi'}/portfolio`} className="text-white/80 hover:text-white transition-colors font-light">
                    {language === 'vi' ? 'DỰ ÁN' : 'PROJECTS'}
                  </Link>
                </li>
                <li>
                  <Link href={`${language === 'en' ? '/en' : '/vi'}/blog`} className="text-white/80 hover:text-white transition-colors font-light" data-testid="footer-news">
                    {language === 'vi' ? 'TIN TỨC' : 'NEWS'}
                  </Link>
                </li>
                <li>
                  <Link href={`${language === 'en' ? '/en' : '/vi'}/contact`} className="text-white/80 hover:text-white transition-colors font-light">
                    {language === 'vi' ? 'LIÊN HỆ' : 'CONTACTS'}
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Social Media */}
            <div>
              <h4 className="text-sm tracking-widest text-white mb-6 font-light">
                {language === 'vi' ? 'MẠNG XÃ HỘI' : 'SOCIAL MEDIA'}
              </h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://www.instagram.com/moderno.interiors/" 
                    className="text-white/80 hover:text-white transition-colors font-light"
                    data-testid="footer-instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    INSTAGRAM
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.facebook.com/moderno.interiors.design" 
                    className="text-white/80 hover:text-white transition-colors font-light"
                    data-testid="footer-facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    FACEBOOK
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.tiktok.com/@moderno.interiors" 
                    className="text-white/80 hover:text-white transition-colors font-light"
                    data-testid="footer-tiktok"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    TIKTOK
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-white/80 hover:text-white transition-colors font-light"
                    data-testid="footer-zalo"
                  >
                    ZALO
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Join Our News */}
            <div>
              <h4 className="text-sm tracking-widest text-white mb-6 font-light">
                {language === 'vi' ? 'ĐĂNG KÝ TIN TỨC' : 'JOIN OUR NEWS'}
              </h4>
              <p className="text-white/80 mb-4 font-light">
                {language === 'vi' ? 'Nhận thông báo về các ưu đãi mới' : 'Receive notifications about new offers'}
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder={language === 'vi' ? 'Email' : 'Email'}
                  className="bg-transparent border-0 border-b border-gray-600 text-white/80 placeholder-gray-400 focus:outline-none focus:border-white flex-grow px-0 py-2 font-light"
                  data-testid="newsletter-email"
                />
                <button className="ml-2 text-white/80 hover:text-white transition-colors font-light">
                  →
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 text-center border-t border-gray-800">
            <p className="text-white/60 text-sm font-light">
              © 2025 Moderno Interiors Design
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}