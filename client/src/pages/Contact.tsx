import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { insertInquirySchema, type InsertInquiry } from "@shared/schema";

export default function Contact() {
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
        title: "Request Sent Successfully",
        description: "We'll get back to you within 24 hours."
      });
      setFormData({ name: '', email: '', phone: '', address: '', requirements: '' });
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
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Required Fields",
        description: "Please fill in name, email, and phone fields.",
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
      <section className="pt-32 pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-light mb-6" data-testid="heading-questions">
              HAVE ANY QUESTIONS?
            </h1>
            <p className="text-xl text-gray-400 mb-8" data-testid="text-consultation">
              Leave a request for a free consultation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* First row - Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    type="text"
                    placeholder="Name *"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-4 text-white placeholder-gray-400 focus:border-white focus-visible:ring-0"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="E-mail *"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-4 text-white placeholder-gray-400 focus:border-white focus-visible:ring-0"
                    data-testid="input-email"
                  />
                </div>
              </div>
              
              {/* Second row - Phone and Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    type="tel"
                    placeholder="Phone *"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-4 text-white placeholder-gray-400 focus:border-white focus-visible:ring-0"
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Address"
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
                  placeholder="Requirements / Project Description"
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
                  className="bg-white text-black hover:bg-gray-100 hover:scale-105 hover:shadow-lg px-8 py-3 font-medium tracking-wide transition-all duration-300 ease-in-out"
                  data-testid="button-leave-request"
                >
                  {mutation.isPending ? 'SENDING...' : 'LEAVE A REQUEST'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}