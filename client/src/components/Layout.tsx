import { useState } from "react";
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
  { name: t('nav.contacts'), href: '/contact', key: 'contact' }
];

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navigation = getNavigation(t);

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Vertical Navigation Sidebar - IIDA Style */}
      <aside className="fixed top-0 left-0 h-screen w-20 z-50 bg-black border-r border-white/10 flex flex-col items-center justify-center">
        {/* Hamburger Menu at Center */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="lg"
              className="text-white hover:text-[#FAA61A] w-18 h-18 rounded-none hover:bg-transparent flex items-center justify-center"
              aria-label="Open navigation menu"
              data-testid="button-main-menu"
            >
              <Menu size={64} strokeWidth={4} className="rotate-90" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] sm:w-[400px] bg-background border-border [&>button]:hidden">
            <SheetHeader>
              <SheetTitle className="text-lg font-serif font-bold text-primary">
                <img 
                  src="/attached_assets/logo.white.png" 
                  alt="NIVORA" 
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
                        className={`block text-lg font-medium transition-colors hover:text-primary ${
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
                  <p className="text-xs text-muted-foreground">
                    © 2024 NIVORA Design Studio
                  </p>
                </div>
              </div>
            </SheetContent>
        </Sheet>
      </aside>

      {/* Language Toggle - Top Right */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2 text-xs font-medium">
        <button
          onClick={() => setLanguage('en')}
          className={`px-2 py-1 transition-colors ${
            language === 'en' ? 'text-primary' : 'text-white/80 hover:text-primary'
          }`}
          data-testid="lang-en"
        >
          ENG
        </button>
        <span className="text-white/60 flex flex-col space-y-1">
          <div className="w-3 h-0.5 bg-white/60"></div>
          <div className="w-3 h-0.5 bg-white/60"></div>
        </span>
        <button
          onClick={() => setLanguage('vi')}
          className={`px-2 py-1 transition-colors ${
            language === 'vi' ? 'text-primary' : 'text-white/80 hover:text-primary'
          }`}
          data-testid="lang-vi"
        >
          VIE
        </button>
      </div>

      {/* Mobile Bottom Actions */}
      <div className="md:hidden fixed bottom-0 left-20 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border p-4">
        <div className="flex space-x-3">
          <Link href="/contact" className="flex-1">
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full text-muted-foreground hover:text-primary"
              data-testid="mobile-button-contact"
            >
              Get Started
            </Button>
          </Link>
          <Link href="/portfolio" className="flex-1">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              data-testid="mobile-button-portfolio"
            >
              Portfolio
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content - Adjusted for vertical sidebar */}
      <main className="ml-20 pb-20 md:pb-0">{children}</main>

      {/* Footer - Adjusted for vertical sidebar */}
      <footer className="ml-20 bg-card border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <img 
                src="/attached_assets/logo.white.png" 
                alt="NIVORA" 
                className="h-16 w-auto mb-4"
              />
              <p className="text-muted-foreground mb-6 max-w-md">
                Transforming spaces through innovative interior design and architectural excellence. 
                Creating environments that inspire and elevate the human experience.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid="footer-instagram"
                >
                  <i className="fab fa-instagram text-xl" />
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid="footer-linkedin"
                >
                  <i className="fab fa-linkedin-in text-xl" />
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid="footer-pinterest"
                >
                  <i className="fab fa-pinterest-p text-xl" />
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid="footer-houzz"
                >
                  <i className="fab fa-houzz text-xl" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">Residential Design</Link></li>
                <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">Commercial Design</Link></li>
                <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">Architecture</Link></li>
                <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">Consultation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/portfolio" className="text-muted-foreground hover:text-primary transition-colors">Portfolio</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 NIVORA Design Studio. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}