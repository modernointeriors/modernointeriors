import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Large 404 Number */}
        <h1 className="text-8xl md:text-9xl font-light text-white/20 tracking-wider mb-8 font-serif">
          404
        </h1>
        
        {/* Page Not Found Title */}
        <h2 className="text-2xl md:text-3xl font-light text-white mb-4 tracking-wide">
          {language === 'vi' ? 'TRANG KHÔNG TỒN TẠI' : 'PAGE NOT FOUND'}
        </h2>
        
        {/* Description */}
        <p className="text-white/60 font-light mb-6 max-w-md mx-auto leading-relaxed">
          {language === 'vi' 
            ? 'Trang bạn tìm kiếm có thể đã được di chuyển, xóa hoặc không tồn tại.'
            : 'The page you are looking for might have been moved, deleted, or does not exist.'
          }
        </p>
        
        {/* Back to Home Link */}
        <Link 
          href="/"
          className="inline-block text-primary hover:text-white transition-colors duration-300 font-light tracking-wide text-xs"
          data-testid="back-to-home"
        >
          {language === 'vi' ? 'QUAY LẠI TRANG CHỦ' : 'BACK TO HOME'}
        </Link>
      </div>
    </div>
  );
}