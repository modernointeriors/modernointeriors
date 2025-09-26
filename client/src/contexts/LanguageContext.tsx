import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';

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
    'nav.news': 'NEWS',
    'nav.admin': 'Admin',
    
    // Hero Section
    'hero.studio': 'Moderno Interiors Design',
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
    
    // About Page
    'about.title': 'About Us',
    'about.subtitle': 'Where architectural vision meets interior perfection. We are a team of passionate designers creating extraordinary spaces worldwide.',
    'about.ourStory': 'Our Story',
    'about.storyParagraph1': 'Founded in 2015, Moderno Interiors has established itself as a premier interior design studio, creating extraordinary spaces that seamlessly blend functionality with artistic vision. Our award-winning team specializes in luxury residential and commercial projects worldwide.',
    'about.storyParagraph2': 'We believe that exceptional design has the power to transform not just spaces, but lives. Our approach combines innovative thinking with timeless elegance, resulting in interiors that are both visually stunning and perfectly suited to our clients\' lifestyles.',
    'about.storyParagraph3': 'Every project we undertake is a testament to our commitment to excellence, attention to detail, and dedication to creating environments that inspire and elevate the human experience.',
    'about.projectsCompleted': 'Projects Completed',
    'about.designAwards': 'Design Awards',
    'about.happyClients': 'Happy Clients',
    'about.countries': 'Countries',
    'about.philosophy': 'Our Philosophy',
    'about.philosophyTitle': 'Design is not just what it looks like and feels like — design is how it works.',
    'about.philosophyText': 'At Moderno Interiors, we believe that great design starts with understanding. Understanding our clients, their needs, their dreams, and their lifestyle. This philosophy drives every decision we make, ensuring that each project is not just beautiful, but truly functional and meaningful.',
    'about.ourTeam': 'Our Team',
    'about.teamSubtitle': 'Meet the passionate professionals who bring your vision to life',
    'about.viewFullProfile': 'View Full Profile',
    'about.email': 'Email',
    'about.phone': 'Phone',
    'about.linkedin': 'LinkedIn',
    'about.experience': 'Experience',
    'about.education': 'Education',
    'about.specialties': 'Specialties',
    'about.awards': 'Awards & Recognition',
    'about.closeProfile': 'Close',
    'about.philosophyHeading': 'Our Design Philosophy',
    'about.philosophySubtitle': 'We believe in creating spaces that tell stories, evoke emotions, and enhance the way people live and work.',
    'about.timelessElegance': 'Timeless Elegance',
    'about.timelessDesc': 'We create designs that transcend trends, focusing on timeless beauty and sophisticated aesthetics.',
    'about.functionalBeauty': 'Functional Beauty',
    'about.functionalDesc': 'Every element serves a purpose while contributing to the overall aesthetic harmony of the space.',
    'about.personalExpression': 'Personal Expression',
    'about.personalDesc': 'We collaborate closely with clients to ensure each design reflects their unique personality and lifestyle.',
    'about.meetTeam': 'Meet Our Team',
    'about.teamDescription': 'Our talented team of designers, architects, and project managers brings decades of combined experience.',
    'about.specialties': 'Specialties',
    'about.experience': 'Experience',
    'about.education': 'Education',
    'about.recentAwards': 'Recent Awards',
    'about.ourApproach': 'Our Approach',
    'about.approachSubtitle': 'Every project is unique, and our process is tailored to bring your vision to life with precision and care.',
    'about.discoveryConsultation': 'Discovery & Consultation',
    'about.discoveryDesc': 'We begin by understanding your lifestyle, preferences, and functional needs through detailed consultations.',
    'about.conceptDevelopment': 'Concept Development',
    'about.conceptDesc': 'Our team creates detailed mood boards, 3D renderings, and design concepts tailored to your vision.',
    'about.designExecution': 'Design & Execution',
    'about.executionDesc': 'From procurement to installation, we manage every detail to ensure flawless project delivery.',
    'about.finalStyling': 'Final Styling & Reveal',
    'about.stylingDesc': 'We add the finishing touches that transform your space into a masterpiece, ready for you to enjoy.',
    
    // Services Page
    'services.title': 'Our Services',
    'services.subtitle': 'Comprehensive design solutions tailored to transform your space into something extraordinary.',
    'services.residential': 'Residential Design',
    'services.residentialDesc': 'Complete home transformations from concept to completion, creating personalized living spaces that reflect your lifestyle.',
    'services.commercial': 'Commercial Design',
    'services.commercialDesc': 'Strategic workplace design that enhances productivity, brand identity, and employee wellbeing.',
    'services.architectural': 'Architectural Planning',
    'services.architecturalDesc': 'Comprehensive architectural services from initial concept through construction documentation.',
    'services.consultation': 'Design Consultation',
    'services.consultationDesc': 'Expert design guidance to help you make informed decisions for your space transformation.',
    'services.getStarted': 'Get Started',
    'services.contactUs': 'Contact Us Today',
    'services.ready': 'Ready to begin your design journey?',
    'services.readyDesc': 'Let\'s discuss your project and explore how we can bring your vision to life.',
    
    // Contact Page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Ready to transform your space? Let\'s start the conversation.',
    'contact.getInTouch': 'Get In Touch',
    'contact.getInTouchDesc': 'We\'d love to hear about your project and discuss how we can help bring your vision to life.',
    'contact.office': 'Our Office',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.hours': 'Business Hours',
    'contact.hoursValue': 'Monday - Friday: 9:00 AM - 6:00 PM',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number',
    'contact.form.address': 'Project Address',
    'contact.form.requirements': 'Project Requirements',
    'contact.form.submit': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.form.success': 'Request Sent Successfully',
    'contact.form.successDesc': 'We\'ll get back to you within 24 hours.',
    'contact.form.error': 'Error',
    'contact.form.errorDesc': 'Failed to send request. Please try again.',
    'contact.form.required': 'Please fill in all required fields.',
    
    // Admin
    'admin.logout': 'Logout',
    'admin.dashboard': 'Dashboard',
    'admin.projects': 'Projects',
    'admin.articles': 'Articles',
    'admin.services': 'Services',
    'admin.clients': 'Clients',
    'admin.inquiries': 'Inquiries',
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
    'nav.news': 'TIN TỨC',
    'nav.admin': 'Quản trị',
    
    // Hero Section
    'hero.studio': 'Moderno Interiors Design',
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
    
    // About Page
    'about.title': 'Giới Thiệu',
    'about.subtitle': 'Nơi tầm nhìn kiến trúc gặp gỡ sự hoàn hảo nội thất. Chúng tôi là đội ngũ các nhà thiết kế đam mê, tạo nên những không gian đặc biệt trên toàn thế giới.',
    'about.ourStory': 'Câu Chuyện Của Chúng Tôi',
    'about.storyParagraph1': 'Được thành lập năm 2015, Moderno Interiors đã khẳng định mình là studio thiết kế nội thất hàng đầu, tạo ra những không gian đặc biệt kết hợp hài hòa giữa tính năng và tầm nhìn nghệ thuật. Đội ngũ đoạt giải của chúng tôi chuyên về các dự án dân cư và thương mại cao cấp trên toàn thế giới.',
    'about.storyParagraph2': 'Chúng tôi tin rằng thiết kế đặc biệt có sức mạnh biến đổi không chỉ không gian, mà cả cuộc sống. Cách tiếp cận của chúng tôi kết hợp tư duy sáng tạo với vẻ đẹp vượt thời gian, tạo ra những nội thất vừa tuyệt đẹp về mặt thị giác vừa hoàn toàn phù hợp với lối sống của khách hàng.',
    'about.storyParagraph3': 'Mỗi dự án chúng tôi thực hiện là minh chứng cho cam kết về sự xuất sắc, sự chú ý đến chi tiết, và sự cống hiến để tạo ra những môi trường truyền cảm hứng và nâng cao trải nghiệm con người.',
    'about.projectsCompleted': 'Dự Án Hoàn Thành',
    'about.designAwards': 'Giải Thưởng Thiết Kế',
    'about.happyClients': 'Khách Hàng Hài Lòng',
    'about.countries': 'Quốc Gia',
    'about.philosophy': 'Triết Lý Của Chúng Tôi',
    'about.philosophyTitle': 'Thiết kế không chỉ là cách nó trông và cảm giác như thế nào — thiết kế là cách nó hoạt động.',
    'about.philosophyText': 'Tại Moderno Interiors, chúng tôi tin rằng thiết kế tuyệt vời bắt đầu từ sự hiểu biết. Hiểu biết khách hàng, nhu cầu, ước mơ và lối sống của họ. Triết lý này thúc đẩy mọi quyết định chúng tôi đưa ra, đảm bảo rằng mỗi dự án không chỉ đẹp mà còn thực sự có chức năng và ý nghĩa.',
    'about.ourTeam': 'Đội Ngũ Của Chúng Tôi',
    'about.teamSubtitle': 'Gặp gỡ các chuyên gia đam mê biến tầm nhìn của bạn thành hiện thực',
    'about.viewFullProfile': 'Xem Hồ Sơ Đầy Đủ',
    'about.email': 'Email',
    'about.phone': 'Điện Thoại',
    'about.linkedin': 'LinkedIn',
    'about.experience': 'Kinh Nghiệm',
    'about.education': 'Học Vấn',
    'about.specialties': 'Chuyên Môn',
    'about.awards': 'Giải Thưởng & Danh Hiệu',
    'about.closeProfile': 'Đóng',
    'about.philosophyHeading': 'Triết Lý Thiết Kế Của Chúng Tôi',
    'about.philosophySubtitle': 'Chúng tôi tin vào việc tạo ra những không gian kể chuyện, gợi cảm xúc và nâng cao cách con người sống và làm việc.',
    'about.timelessElegance': 'Vẻ Đẹp Vượt Thời Gian',
    'about.timelessDesc': 'Chúng tôi tạo ra những thiết kế vượt qua xu hướng, tập trung vào vẻ đẹp vượt thời gian và thẩm mỹ tinh tế.',
    'about.functionalBeauty': 'Vẻ Đẹp Chức Năng',
    'about.functionalDesc': 'Mỗi yếu tố đều phục vụ một mục đích trong khi góp phần vào sự hài hòa thẩm mỹ tổng thể của không gian.',
    'about.personalExpression': 'Thể Hiện Cá Nhân',
    'about.personalDesc': 'Chúng tôi hợp tác chặt chẽ với khách hàng để đảm bảo mỗi thiết kế phản ánh cá tính và lối sống độc đáo của họ.',
    'about.meetTeam': 'Gặp Gỡ Đội Ngũ ',
    'about.teamDescription': 'Đội ngũ tài năng gồm các nhà thiết kế, kiến trúc sư và quản lý dự án mang lại hàng thập kỷ kinh nghiệm kết hợp.',
    'about.specialties': 'Chuyên Môn',
    'about.experience': 'Kinh Nghiệm',
    'about.education': 'Học Vấn',
    'about.recentAwards': 'Giải Thưởng Gần Đây',
    'about.ourApproach': 'Phương Pháp Của Chúng Tôi',
    'about.approachSubtitle': 'Mỗi dự án đều độc đáo, và quy trình của chúng tôi được tùy chỉnh để biến tầm nhìn của bạn thành hiện thực với sự chính xác và chăm sóc.',
    'about.discoveryConsultation': 'Khám Phá & Tư Vấn',
    'about.discoveryDesc': 'Chúng tôi bắt đầu bằng cách hiểu rõ lối sống, sở thích và nhu cầu chức năng của bạn thông qua các cuộc tư vấn chi tiết.',
    'about.conceptDevelopment': 'Phát Triển Ý Tưởng',
    'about.conceptDesc': 'Đội ngũ của chúng tôi tạo ra bảng màu sắc chi tiết, hình ảnh 3D và các khái niệm thiết kế phù hợp với tầm nhìn của bạn.',
    'about.designExecution': 'Thiết Kế & Thực Hiện',
    'about.executionDesc': 'Từ mua sắm đến lắp đặt, chúng tôi quản lý mọi chi tiết để đảm bảo giao hàng dự án hoàn hảo.',
    'about.finalStyling': 'Trang Trí Cuối & Trình Bày',
    'about.stylingDesc': 'Chúng tôi thêm những nét hoàn thiện cuối cùng biến không gian của bạn thành kiệt tác, sẵn sàng để bạn thưởng thức.',
    
    // Services Page
    'services.title': 'Dịch Vụ Của Chúng Tôi',
    'services.subtitle': 'Giải pháp thiết kế toàn diện được tùy chỉnh để biến đổi không gian của bạn thành điều gì đó đặc biệt.',
    'services.residential': 'Thiết Kế Dân Cư',
    'services.residentialDesc': 'Biến đổi hoàn toàn ngôi nhà từ ý tưởng đến hoàn thiện, tạo ra những không gian sống cá nhân hóa phản ánh lối sống của bạn.',
    'services.commercial': 'Thiết Kế Thương Mại',
    'services.commercialDesc': 'Thiết kế nơi làm việc chiến lược giúp tăng năng suất, nhận diện thương hiệu và ph福利của nhân viên.',
    'services.architectural': 'Quy Hoạch Kiến Trúc',
    'services.architecturalDesc': 'Dịch vụ kiến trúc toàn diện từ ý tưởng ban đầu đến tài liệu xây dựng.',
    'services.consultation': 'Tư Vấn Thiết Kế',
    'services.consultationDesc': 'Hướng dẫn thiết kế chuyên nghiệp giúp bạn đưa ra quyết định sáng suốt cho việc biến đổi không gian.',
    'services.getStarted': 'Bắt Đầu',
    'services.contactUs': 'Liên Hệ Ngay Hôm Nay',
    'services.ready': 'Sẵn sàng bắt đầu hành trình thiết kế?',
    'services.readyDesc': 'Hãy thảo luận về dự án của bạn và khám phá cách chúng tôi có thể biến tầm nhìn của bạn thành hiện thực.',
    
    // Contact Page
    'contact.title': 'Liên Hệ',
    'contact.subtitle': 'Sẵn sàng biến đổi không gian của bạn? Hãy bắt đầu cuộc trò chuyện.',
    'contact.getInTouch': 'Liên Lạc',
    'contact.getInTouchDesc': 'Chúng tôi rất muốn nghe về dự án của bạn và thảo luận cách chúng tôi có thể giúp biến tầm nhìn của bạn thành hiện thực.',
    'contact.office': 'Văn Phòng Của Chúng Tôi',
    'contact.phone': 'Điện Thoại',
    'contact.email': 'Email',
    'contact.hours': 'Giờ Làm Việc',
    'contact.hoursValue': 'Thứ Hai - Thứ Sáu: 9:00 AM - 6:00 PM',
    'contact.form.name': 'Họ Và Tên',
    'contact.form.email': 'Địa Chỉ Email',
    'contact.form.phone': 'Số Điện Thoại',
    'contact.form.address': 'Địa Chỉ Dự Án',
    'contact.form.requirements': 'Yêu Cầu Dự Án',
    'contact.form.submit': 'Gửi Tin Nhắn',
    'contact.form.sending': 'Đang Gửi...',
    'contact.form.success': 'Yêu Cầu Đã Được Gửi Thành Công',
    'contact.form.successDesc': 'Chúng tôi sẽ phản hồi bạn trong vòng 24 giờ.',
    'contact.form.error': 'Lỗi',
    'contact.form.errorDesc': 'Không thể gửi yêu cầu. Vui lòng thử lại.',
    'contact.form.required': 'Vui lòng điền đầy đủ các trường bắt buộc.',
    
    // Admin
    'admin.logout': 'Đăng Xuất',
    'admin.dashboard': 'Bảng Điều Khiển',
    'admin.projects': 'Dự Án',
    'admin.articles': 'Bài Viết',
    'admin.services': 'Dịch Vụ',
    'admin.clients': 'Khách Hàng',
    'admin.inquiries': 'Yêu Cầu',
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