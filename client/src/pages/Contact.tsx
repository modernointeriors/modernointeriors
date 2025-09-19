import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Contact Us</Badge>
          <h1 className="text-4xl md:text-6xl font-sans font-light mb-6" data-testid="heading-contact">Get In Touch</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to transform your space? Let's discuss your vision and bring it to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-sans">Start Your Project</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-sans font-light mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-light mb-1">Studio Location</h3>
                    <p className="text-muted-foreground" data-testid="text-address">
                      425 Park Avenue, Suite 2000<br />
                      New York, NY 10022
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-light mb-1">Phone</h3>
                    <p className="text-muted-foreground" data-testid="text-phone">
                      <a href="tel:+12125550123" className="hover:text-primary transition-colors">
                        +1 (212) 555-0123
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-light mb-1">Email</h3>
                    <p className="text-muted-foreground" data-testid="text-email">
                      <a href="mailto:hello@nivora.design" className="hover:text-primary transition-colors">
                        hello@nivora.design
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-light mb-1">Office Hours</h3>
                    <div className="text-muted-foreground" data-testid="text-hours">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: By appointment only</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-sans font-light mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-light mb-2">How long does a typical project take?</h4>
                    <p className="text-sm text-muted-foreground">
                      Project timelines vary based on scope and complexity. Residential projects typically range from 3-8 months, 
                      while commercial projects may take 6-18 months.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-light mb-2">Do you work on projects outside New York?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, we work with clients internationally. We have successfully completed projects across the US, 
                      Europe, and Asia.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-light mb-2">What is your design process?</h4>
                    <p className="text-sm text-muted-foreground">
                      Our process begins with an initial consultation, followed by concept development, design refinement, 
                      and project implementation with full project management support.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <div>
              <h3 className="font-light mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  data-testid="link-instagram"
                >
                  <i className="fab fa-instagram" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  data-testid="link-linkedin"
                >
                  <i className="fab fa-linkedin-in" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  data-testid="link-pinterest"
                >
                  <i className="fab fa-pinterest-p" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  data-testid="link-houzz"
                >
                  <i className="fab fa-houzz" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
