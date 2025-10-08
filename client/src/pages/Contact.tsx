import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { insertInquirySchema, type InsertInquiry } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight } from "lucide-react";

export default function Contact() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    requirements: ''
  });
  const { toast } = useToast();
  const [faq01Expanded, setFaq01Expanded] = useState(false);
  const [faq02Expanded, setFaq02Expanded] = useState(false);
  const [faq03Expanded, setFaq03Expanded] = useState(false);
  const [faq04Expanded, setFaq04Expanded] = useState(false);
  const [faq05Expanded, setFaq05Expanded] = useState(false);
  
  // Typing animation for placeholders
  const [placeholders, setPlaceholders] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    requirements: ''
  });

  // Typing animation for FAQ
  const [faqTexts, setFaqTexts] = useState({
    faq01: '',
    faq02: '',
    faq03: '',
    faq04: '',
    faq05: ''
  });

  useEffect(() => {
    const texts = {
      name: t('contact.form.name'),
      email: t('contact.form.email'),
      phone: t('contact.form.phone'),
      address: t('contact.form.address'),
      requirements: t('contact.form.requirements')
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
  }, [t]);

  // Typing animation for FAQ 01
  useEffect(() => {
    if (!faq01Expanded) {
      setFaqTexts(prev => ({ ...prev, faq01: '' }));
      return;
    }

    const text = language === 'vi'
      ? 'Chi phí thiết kế nội thất phụ thuộc vào diện tích, phong cách thiết kế, chất liệu sử dụng và độ phức tạp của dự án. Chúng tôi cung cấp báo giá chi tiết sau buổi khảo sát và tư vấn ban đầu, đảm bảo minh bạch và phù hợp với ngân sách của bạn.'
      : 'Interior design costs depend on the area, design style, materials used, and project complexity. We provide a detailed quote after the initial survey and consultation, ensuring transparency and alignment with your budget.';

    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setFaqTexts(prev => ({ ...prev, faq01: text.slice(0, index) }));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [faq01Expanded, language]);

  // Typing animation for FAQ 02
  useEffect(() => {
    if (!faq02Expanded) {
      setFaqTexts(prev => ({ ...prev, faq02: '' }));
      return;
    }

    const text = language === 'vi'
      ? 'Thời gian thực hiện dự án thường dao động từ 2-6 tháng tùy thuộc vào quy mô và yêu cầu. Giai đoạn thiết kế mất khoảng 2-4 tuần, sau đó là thi công và hoàn thiện. Chúng tôi cam kết tiến độ rõ ràng và cập nhật thường xuyên.'
      : 'Project completion time typically ranges from 2-6 months depending on scale and requirements. The design phase takes about 2-4 weeks, followed by construction and finishing. We commit to clear timelines and regular updates.';

    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setFaqTexts(prev => ({ ...prev, faq02: text.slice(0, index) }));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [faq02Expanded, language]);

  // Typing animation for FAQ 03
  useEffect(() => {
    if (!faq03Expanded) {
      setFaqTexts(prev => ({ ...prev, faq03: '' }));
      return;
    }

    const text = language === 'vi'
      ? 'Hoàn toàn có thể! Sự tham gia của bạn là rất quan trọng. Chúng tôi khuyến khích bạn chia sẻ ý tưởng, góp ý trong suốt quá trình từ khâu concept đến hoàn thiện. Mọi quyết định quan trọng đều được trao đổi và thống nhất với bạn.'
      : 'Absolutely! Your participation is crucial. We encourage you to share ideas and feedback throughout the process from concept to completion. All important decisions are discussed and agreed upon with you.';

    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setFaqTexts(prev => ({ ...prev, faq03: text.slice(0, index) }));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [faq03Expanded, language]);

  // Typing animation for FAQ 04
  useEffect(() => {
    if (!faq04Expanded) {
      setFaqTexts(prev => ({ ...prev, faq04: '' }));
      return;
    }

    const text = language === 'vi'
      ? 'Có thể điều chỉnh trong giai đoạn thiết kế. Sau khi duyệt bản vẽ thi công, mọi thay đổi sẽ được đánh giá về tác động đến tiến độ và chi phí. Chúng tôi luôn cố gắng đáp ứng yêu cầu của bạn một cách hợp lý nhất.'
      : 'Modifications are possible during the design phase. After construction drawings are approved, any changes will be assessed for impact on timeline and costs. We always strive to accommodate your requests reasonably.';

    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setFaqTexts(prev => ({ ...prev, faq04: text.slice(0, index) }));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [faq04Expanded, language]);

  // Typing animation for FAQ 05
  useEffect(() => {
    if (!faq05Expanded) {
      setFaqTexts(prev => ({ ...prev, faq05: '' }));
      return;
    }

    const text = language === 'vi'
      ? 'Chúng tôi cam kết bảo hành 12-24 tháng cho công trình thi công và 1-5 năm cho đồ nội thất tùy từng sản phẩm. Đội ngũ kỹ thuật sẵn sàng hỗ trợ bảo trì và sửa chữa trong thời gian bảo hành.'
      : 'We commit to a 12-24 month warranty for construction work and 1-5 years for furniture depending on the product. Our technical team is ready to support maintenance and repairs during the warranty period.';

    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setFaqTexts(prev => ({ ...prev, faq05: text.slice(0, index) }));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [faq05Expanded, language]);

  const mutation = useMutation({
    mutationFn: async (data: InsertInquiry) => {
      return await apiRequest('POST', '/api/inquiries', data);
    },
    onSuccess: () => {
      toast({
        title: t('contact.form.success'),
        description: t('contact.form.successDesc')
      });
      setFormData({ name: '', email: '', phone: '', address: '', requirements: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/inquiries'] });
    },
    onError: () => {
      toast({
        title: t('contact.form.error'),
        description: t('contact.form.errorDesc'),
        variant: "destructive"
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: t('contact.form.error'),
        description: t('contact.form.required'),
        variant: "destructive"
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
    <div className="min-h-screen bg-black text-white">
      {/* Request Section */}
      <section className="pt-60 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-5xl font-light mb-4" data-testid="heading-questions">
              {t('contact.title')}
            </h1>
            <p className="text-lg text-gray-400 mb-6" data-testid="text-consultation">
              {t('contact.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
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
              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-transparent border border-white/30 text-white hover:border-white hover:bg-white/10 px-8 py-3 font-light tracking-widest uppercase transition-all duration-300 ease-in-out rounded-none"
                  data-testid="button-leave-request"
                >
                  {mutation.isPending ? t('contact.form.sending') : (language === 'vi' ? 'GỬI YÊU CẦU' : 'LEAVE A REQUEST')}
                </Button>
              </div>
            </div>
          </form>
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
                    {faqTexts.faq01}
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
                    {faqTexts.faq02}
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
                    {faqTexts.faq03}
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
                    {faqTexts.faq04}
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
                    {faqTexts.faq05}
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