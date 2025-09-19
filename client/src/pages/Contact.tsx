import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { insertInquirySchema, type InsertInquiry } from "@shared/schema";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: InsertInquiry) => {
      return await apiRequest('POST', '/api/inquiries', data);
    },
    onSuccess: () => {
      toast({
        title: "Request Sent Successfully",
        description: "We'll get back to you within 24 hours."
      });
      setFormData({ name: '', email: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/inquiries'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Required Fields",
        description: "Please fill in both name and email fields.",
        variant: "destructive"
      });
      return;
    }

    const inquiryData = {
      firstName: formData.name.split(' ')[0] || formData.name,
      lastName: formData.name.split(' ').slice(1).join(' ') || '',
      email: formData.email,
      projectType: 'consultation' as const,
      message: 'Free consultation request',
      phone: ''
    };

    mutation.mutate(inquiryData);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Request Section */}
      <section className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm tracking-widest text-gray-400 mb-4" data-testid="label-request">REQUEST</p>
            <h1 className="text-4xl md:text-6xl font-light mb-6" data-testid="heading-questions">
              HAVE ANY QUESTIONS?
            </h1>
            <p className="text-xl text-gray-400 mb-12" data-testid="text-consultation">
              Leave a request for a free consultation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <Input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-4 text-white placeholder-gray-400 focus:border-white focus-visible:ring-0"
                  data-testid="input-name"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-4 text-white placeholder-gray-400 focus:border-white focus-visible:ring-0"
                  data-testid="input-email"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-white text-black hover:bg-gray-100 px-8 py-3 font-medium tracking-wide"
                  data-testid="button-leave-request"
                >
                  {mutation.isPending ? 'SENDING...' : '• LEAVE A REQUEST'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}