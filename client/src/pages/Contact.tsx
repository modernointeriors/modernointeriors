import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { insertInquirySchema, type InsertInquiry } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";

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
      <section className="pt-60 pb-1">
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
                    placeholder={t('contact.form.name')}
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-4 text-white placeholder-gray-400 focus:border-white focus-visible:ring-0"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder={t('contact.form.email')}
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
                    placeholder={t('contact.form.phone')}
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-4 text-white placeholder-gray-400 focus:border-white focus-visible:ring-0"
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder={t('contact.form.address')}
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
                  placeholder={t('contact.form.requirements')}
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
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-16 py-6 font-light tracking-[0.2em] transition-all duration-300 ease-in-out rounded-none uppercase text-sm"
                  data-testid="button-leave-request"
                >
                  {mutation.isPending ? t('contact.form.sending') : (language === 'vi' ? 'GỬI YÊU CẦU' : 'LEAVE A REQUEST')}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}