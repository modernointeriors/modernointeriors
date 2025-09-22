import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LayoutProps {
  children: React.ReactNode;
}

const getNavigation = (t: (key: string) => string) => [
  { name: t('nav.home'), href: '/', key: 'home' },
  { name: t('nav.about'), href: '/about', key: 'about' },
  { name: t('nav.projects'), href: '/portfolio', key: 'portfolio' },
  { name: t('nav.news'), href: '/blog', key: 'news' },
  { name: t('nav.contacts'), href: '/contact', key: 'contact' }
];

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navigation = getNavigation(t);

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
              onClick={() => setLanguage('en')}
              className={`transition-colors px-2 py-1 ${
                language === 'en' ? 'text-primary' : 'text-zinc-400 hover:text-primary'
              }`}
              data-testid="lang-en"
            >
              ENG
            </button>
            <span className="text-zinc-600">|</span>
            <button
              onClick={() => setLanguage('vi')}
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
                      href="/services" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Services
                    </Link>
                    <Link 
                      href="/about" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Our Story
                    </Link>
                    <Link 
                      href="/contact" 
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Corporate Office */}
            <div>
              <h4 className="text-sm tracking-widest text-white mb-6 font-light">CORPORATE OFFICE</h4>
              <div className="space-y-2">
                <p className="text-white/80 font-light">MARINA BAY SANDS</p>
                <p className="text-white/80 font-light">TOWER 2, LEVEL 39,</p>
                <p className="text-white/80 font-light">018956 SINGAPORE</p>
                <p className="text-white/80 font-light mt-4">+65 6734 2987</p>
              </div>
            </div>
            
            {/* Navigation */}
            <div>
              <h4 className="text-sm tracking-widest text-white mb-6 font-light">NAVIGATION</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-white/80 hover:text-white transition-colors font-light">HOME</Link></li>
                <li><Link href="/about" className="text-white/80 hover:text-white transition-colors font-light">ABOUT</Link></li>
                <li><Link href="/portfolio" className="text-white/80 hover:text-white transition-colors font-light">PROJECTS</Link></li>
                <li><Link href="/blog" className="text-white/80 hover:text-white transition-colors font-light" data-testid="footer-news">NEWS</Link></li>
                <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors font-light">CONTACTS</Link></li>
              </ul>
            </div>
            
            {/* Social Media */}
            <div>
              <h4 className="text-sm tracking-widest text-white mb-6 font-light">SOCIAL MEDIA</h4>
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
                    data-testid="footer-pinterest"
                  >
                    PINTEREST
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Join Our News */}
            <div>
              <h4 className="text-sm tracking-widest text-white mb-6 font-light">JOIN OUR NEWS</h4>
              <p className="text-white/80 mb-4 font-light">Receive notifications about new offers</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email"
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