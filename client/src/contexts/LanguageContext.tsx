import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'HOME',
    'nav.about': 'ABOUT',
    'nav.portfolio': 'PORTFOLIO',
    'nav.projects': 'PROJECTS',
    'nav.services': 'SERVICES',
    'nav.contact': 'CONTACT',
    'nav.contacts': 'CONTACTS',
    'nav.admin': 'Admin',
    
    // Hero Section
    'hero.studio': 'MODERNO INTERIORS STUDIO',
    'hero.tagline': 'From concept to realization — creating structures that inspire and endure.',
    'hero.architecture': 'Architecture',
    'hero.interior': 'Interior Design',
    'hero.consultation': 'CONSULTATION',
    
    // Common
    'common.viewWork': 'View Our Work',
    'common.startProject': 'Start Project',
    'common.readyTransform': 'Ready to Transform Your Space?',
    'common.collaborate': 'Let\'s collaborate to create an extraordinary environment that reflects your vision and elevates your lifestyle.',
    'common.startYourProject': 'Start Your Project',
    'common.viewPortfolio': 'View Portfolio',
    
    // Featured Projects
    'featured.badge': 'Featured Project',
    'featured.title': 'Luxury Portfolio',
    'featured.description': 'Discover our most prestigious projects, where sophisticated design meets uncompromising quality.',
    
    // Stats
    'stats.projects': 'Projects Completed',
    'stats.clients': 'Happy Clients', 
    'stats.awards': 'Awards Won',
    'stats.experience': 'Years Experience',
  },
  vi: {
    // Navigation
    'nav.home': 'TRANG CHỦ',
    'nav.about': 'GIỚI THIỆU',
    'nav.portfolio': 'DANH MỤC',
    'nav.projects': 'DỰ ÁN',
    'nav.services': 'DỊCH VỤ',
    'nav.contact': 'LIÊN HỆ',
    'nav.contacts': 'LIÊN HỆ',
    'nav.admin': 'Quản trị',
    
    // Hero Section
    'hero.studio': 'MODERNO INTERIORS STUDIO',
    'hero.tagline': 'Từ ý tưởng đến hiện thực — tạo nên những công trình truyền cảm hứng và bền vững.',
    'hero.architecture': 'Kiến trúc',
    'hero.interior': 'Thiết kế nội thất',
    'hero.consultation': 'TƯ VẤN',
    
    // Common
    'common.viewWork': 'Xem Các Dự Án',
    'common.startProject': 'Bắt Đầu Dự Án',
    'common.readyTransform': 'Sẵn Sàng Thay Đổi Không Gian Của Bạn?',
    'common.collaborate': 'Hãy cùng chúng tôi tạo nên một môi trường đặc biệt phản ánh tầm nhìn và nâng cao phong cách sống của bạn.',
    'common.startYourProject': 'Bắt Đầu Dự Án',
    'common.viewPortfolio': 'Xem Danh Mục',
    
    // Featured Projects
    'featured.badge': 'Dự Án Nổi Bật',
    'featured.title': 'Danh Mục Cao Cấp',
    'featured.description': 'Khám phá những dự án uy tín nhất của chúng tôi, nơi thiết kế tinh tế gặp gỡ chất lượng không thỏa hiệp.',
    
    // Stats
    'stats.projects': 'Dự Án Hoàn Thành',
    'stats.clients': 'Khách Hàng Hài Lòng',
    'stats.awards': 'Giải Thưởng',
    'stats.experience': 'Năm Kinh Nghiệm',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}