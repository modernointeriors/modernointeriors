import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Trophy, Users2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const { language, t } = useLanguage();

  return (
    <main className="ml-16 pb-8 md:pb-6 mb-4">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] bg-black overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200")',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Main heading */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-white uppercase tracking-wide">
                    {language === "vi" 
                      ? "THIẾT KẾ KIẾN TRÚC VÀ NỘI THẤT"
                      : "ARCHITECTURAL & INTERIOR DESIGN"
                    }
                  </h1>
                  <div className="w-20 h-0.5 bg-white/40" />
                </div>
                <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-xl">
                  {language === "vi"
                    ? "Tạo ra những dự án kết hợp hoàn hảo giữa chức năng, thẩm mỹ và công nghệ tiên tiến nhất."
                    : "Creating projects that perfectly combine functionality, aesthetics, and the most advanced technology."
                  }
                </p>
                <Button
                  asChild
                  className="bg-transparent border border-white/40 text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-6 text-base rounded-none uppercase tracking-wider"
                  data-testid="button-order-project"
                >
                  <Link href="/contact">
                    {language === "vi" ? "ĐẶT DỰ ÁN" : "ORDER PROJECT"}
                  </Link>
                </Button>
              </div>

              {/* Right side - Tagline */}
              <div className="lg:text-right">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 uppercase tracking-wider leading-relaxed">
                  {language === "vi"
                    ? "ĐỔI MỚI TRONG MỌI DỰ ÁN"
                    : "INNOVATION IN EVERY PROJECT"
                  }
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-20 bg-black">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-sm font-light tracking-widest text-white/60 uppercase mb-4">
              {language === "vi" ? "NGUYÊN TẮC LÀM VIỆC" : "OUR PRINCIPLES"}
            </h2>
            <h3 className="text-3xl md:text-4xl font-light text-white uppercase tracking-wide">
              {language === "vi" 
                ? "NỀN TẢNG CỦA CÔNG VIỆC CHÚNG TÔI"
                : "THE FOUNDATION OF OUR WORK"
              }
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Principle 1 */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Sparkles className="w-8 h-8 text-white/40" />
                <h4 className="text-xl font-light text-white uppercase tracking-wide">
                  {language === "vi"
                    ? "VẬT LIỆU ĐỔI MỚI"
                    : "INNOVATIVE MATERIALS"
                  }
                </h4>
              </div>
              <p className="text-white/70 font-light leading-relaxed">
                {language === "vi"
                  ? "Chúng tôi sử dụng vật liệu và giải pháp chức năng tiên tiến nhất, không chỉ đáp ứng các tiêu chuẩn quốc tế mà còn vượt xa mong đợi của khách hàng. Mỗi dự án được tối ưu hóa với công nghệ hiện đại nhất."
                  : "We use the most advanced materials and functional solutions, not only meeting international standards but exceeding client expectations. Each project is optimized with cutting-edge technology."
                }
              </p>
            </div>

            {/* Principle 2 */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Trophy className="w-8 h-8 text-white/40" />
                <h4 className="text-xl font-light text-white uppercase tracking-wide">
                  {language === "vi"
                    ? "THIẾT KẾ ĐỘC ĐÁO"
                    : "UNIQUE DESIGN"
                  }
                </h4>
              </div>
              <p className="text-white/70 font-light leading-relaxed">
                {language === "vi"
                  ? "Mỗi thiết kế của chúng tôi đều độc đáo và được cá nhân hóa theo nhu cầu cụ thể của từng khách hàng. Chúng tôi kết hợp nghệ thuật và chức năng để tạo ra không gian sống hoàn hảo."
                  : "Each of our designs is unique and personalized to the specific needs of each client. We combine art and functionality to create perfect living spaces."
                }
              </p>
            </div>

            {/* Principle 3 */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Users2 className="w-8 h-8 text-white/40" />
                <h4 className="text-xl font-light text-white uppercase tracking-wide">
                  {language === "vi"
                    ? "QUẢN LÝ DỰ ÁN 3D/VR"
                    : "3D/VR PROJECT MANAGEMENT"
                  }
                </h4>
              </div>
              <p className="text-white/70 font-light leading-relaxed">
                {language === "vi"
                  ? "Ứng dụng công nghệ BIM và 3D/VR tiên tiến trong quá trình thiết kế, giúp khách hàng hình dung rõ ràng dự án trước khi thi công. Quản lý chuyên nghiệp với đội ngũ giàu kinh nghiệm."
                  : "Advanced BIM and 3D/VR technology application in the design process, helping clients visualize the project clearly before construction. Professional management with experienced teams."
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Showcase Section */}
      <section className="relative h-[80vh] min-h-[600px] bg-black overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="relative h-full flex items-end">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Service 1 */}
              <div className="space-y-4">
                <h4 className="text-lg font-light text-white uppercase tracking-wide">
                  {language === "vi" ? "THIẾT KẾ KIẾN TRÚC" : "ARCHITECTURAL DESIGN"}
                </h4>
                <p className="text-white/70 font-light text-sm leading-relaxed">
                  {language === "vi"
                    ? "Thiết kế kiến trúc hiện đại, kết hợp giữa thẩm mỹ và chức năng sử dụng. Từ biệt thự đến các công trình thương mại quy mô lớn."
                    : "Modern architectural design combining aesthetics and functionality. From villas to large-scale commercial projects."
                  }
                </p>
              </div>

              {/* Service 2 */}
              <div className="space-y-4">
                <h4 className="text-lg font-light text-white uppercase tracking-wide">
                  {language === "vi" ? "THIẾT KẾ NỘI THẤT" : "INTERIOR DESIGN"}
                </h4>
                <p className="text-white/70 font-light text-sm leading-relaxed">
                  {language === "vi"
                    ? "Thiết kế không gian nội thất cao cấp với sự chú trọng đến từng chi tiết. Tạo ra môi trường sống và làm việc lý tưởng."
                    : "Premium interior design with attention to every detail. Creating ideal living and working environments."
                  }
                </p>
              </div>

              {/* Service 3 */}
              <div className="space-y-4">
                <h4 className="text-lg font-light text-white uppercase tracking-wide">
                  {language === "vi" ? "QUẢN LÝ THI CÔNG" : "CONSTRUCTION MANAGEMENT"}
                </h4>
                <p className="text-white/70 font-light text-sm leading-relaxed">
                  {language === "vi"
                    ? "Quản lý toàn diện quá trình thi công từ A-Z. Đảm bảo chất lượng, tiến độ và ngân sách dự án được kiểm soát chặt chẽ."
                    : "Comprehensive construction management from A-Z. Ensuring quality, timeline and budget are strictly controlled."
                  }
                </p>
              </div>

              {/* Service 4 */}
              <div className="space-y-4">
                <h4 className="text-lg font-light text-white uppercase tracking-wide">
                  {language === "vi" ? "TƯ VẤN THIẾT KẾ" : "DESIGN CONSULTATION"}
                </h4>
                <p className="text-white/70 font-light text-sm leading-relaxed">
                  {language === "vi"
                    ? "Tư vấn chuyên sâu về thiết kế, lựa chọn vật liệu và giải pháp tối ưu cho từng không gian. Phù hợp với nhu cầu và ngân sách."
                    : "In-depth consultation on design, material selection and optimal solutions for each space. Tailored to needs and budget."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-light text-white" data-testid="stats-projects">150+</div>
              <div className="text-sm text-white/60 uppercase tracking-wider">
                {language === "vi" ? "Dự án hoàn thành" : "Projects Completed"}
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-light text-white" data-testid="stats-awards">25+</div>
              <div className="text-sm text-white/60 uppercase tracking-wider">
                {language === "vi" ? "Giải thưởng thiết kế" : "Design Awards"}
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-light text-white" data-testid="stats-clients">200+</div>
              <div className="text-sm text-white/60 uppercase tracking-wider">
                {language === "vi" ? "Khách hàng hài lòng" : "Happy Clients"}
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-light text-white" data-testid="stats-countries">12+</div>
              <div className="text-sm text-white/60 uppercase tracking-wider">
                {language === "vi" ? "Quốc gia" : "Countries"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-20 bg-black border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-sm font-light tracking-widest text-white/60 uppercase mb-4">
              {language === "vi" ? "QUY TRÌNH LÀM VIỆC" : "OUR PROCESS"}
            </h2>
            <h3 className="text-3xl md:text-4xl font-light text-white uppercase tracking-wide">
              {language === "vi" 
                ? "TỪ Ý TƯỞNG ĐẾN HIỆN THỰC"
                : "FROM CONCEPT TO REALITY"
              }
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="text-6xl font-light text-white/20">01</div>
              <h4 className="text-xl font-light text-white uppercase">
                {language === "vi" ? "Tư vấn & Khảo sát" : "Consultation & Survey"}
              </h4>
              <p className="text-white/70 font-light text-sm leading-relaxed">
                {language === "vi"
                  ? "Gặp gỡ, lắng nghe nhu cầu và khảo sát thực địa để hiểu rõ mong muốn của khách hàng."
                  : "Meeting, listening to needs and on-site survey to understand client desires."
                }
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="text-6xl font-light text-white/20">02</div>
              <h4 className="text-xl font-light text-white uppercase">
                {language === "vi" ? "Phát triển ý tưởng" : "Concept Development"}
              </h4>
              <p className="text-white/70 font-light text-sm leading-relaxed">
                {language === "vi"
                  ? "Phát triển ý tưởng thiết kế, bản vẽ sơ bộ và 3D visualization cho dự án."
                  : "Developing design concepts, preliminary drawings and 3D visualization for the project."
                }
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="text-6xl font-light text-white/20">03</div>
              <h4 className="text-xl font-light text-white uppercase">
                {language === "vi" ? "Thiết kế chi tiết" : "Detailed Design"}
              </h4>
              <p className="text-white/70 font-light text-sm leading-relaxed">
                {language === "vi"
                  ? "Hoàn thiện bản vẽ kỹ thuật, lựa chọn vật liệu và lập kế hoạch thi công chi tiết."
                  : "Completing technical drawings, material selection and detailed construction planning."
                }
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-4">
              <div className="text-6xl font-light text-white/20">04</div>
              <h4 className="text-xl font-light text-white uppercase">
                {language === "vi" ? "Thi công & Bàn giao" : "Construction & Handover"}
              </h4>
              <p className="text-white/70 font-light text-sm leading-relaxed">
                {language === "vi"
                  ? "Giám sát thi công chặt chẽ, đảm bảo chất lượng và bàn giao công trình hoàn hảo."
                  : "Strict construction supervision, ensuring quality and perfect project handover."
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-8 uppercase tracking-wide">
            {language === "vi"
              ? "SẴN SÀNG BẮT ĐẦU DỰ ÁN CỦA BẠN?"
              : "READY TO START YOUR PROJECT?"
            }
          </h2>
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
            {language === "vi"
              ? "Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí và nhận báo giá chi tiết cho dự án của bạn."
              : "Contact us today for a free consultation and detailed quote for your project."
            }
          </p>
          <Button
            asChild
            className="bg-white text-black hover:bg-white/90 transition-all duration-300 px-12 py-6 text-base rounded-none uppercase tracking-wider group"
            data-testid="button-contact-us"
          >
            <Link href="/contact">
              {language === "vi" ? "Liên hệ ngay" : "Contact Us"}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
