import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
      {/* Navigation Header */}
      <header className="fixed top-0 w-full z-50 glass-card border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-serif font-bold text-gradient cursor-pointer" data-testid="logo">
                  NIVORA
                </h1>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-baseline space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-foreground nav-active'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    data-testid={`nav-${item.key}`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link href="/admin">
                  <Button 
                    size="sm"
                    variant={isActive('/admin') ? "default" : "secondary"}
                    data-testid="nav-admin"
                  >
                    {t('nav.admin')}
                  </Button>
                </Link>
              </div>
              
              {/* Language Toggle */}
              <div className="flex items-center space-x-2 text-sm font-medium">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 transition-colors ${
                    language === 'en' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid="lang-en"
                >
                  ENG
                </button>
                <span className="text-muted-foreground">|</span>
                <button
                  onClick={() => setLanguage('vi')}
                  className={`px-2 py-1 transition-colors ${
                    language === 'vi' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid="lang-vi"
                >
                  VIE
                </button>
              </div>
            </div>
            
            {/* Mobile menu button and language toggle */}
            <div className="flex md:hidden items-center space-x-4">
              {/* Mobile Language Toggle */}
              <div className="flex items-center space-x-1 text-xs font-medium">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-1 transition-colors ${
                    language === 'en' ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                  data-testid="mobile-lang-en"
                >
                  ENG
                </button>
                <span className="text-muted-foreground">|</span>
                <button
                  onClick={() => setLanguage('vi')}
                  className={`px-1 transition-colors ${
                    language === 'vi' ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                  data-testid="mobile-lang-vi"
                >
                  VIE
                </button>
              </div>
              
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    data-testid="button-mobile-menu"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-6 mt-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-lg font-medium transition-colors ${
                          isActive(item.href)
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                        data-testid={`mobile-nav-${item.key}`}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button 
                        variant={isActive('/admin') ? "default" : "secondary"}
                        className="w-full"
                        data-testid="mobile-nav-admin"
                      >
                        {t('nav.admin')}
                      </Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-serif font-bold text-gradient mb-4">NIVORA</h3>
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
