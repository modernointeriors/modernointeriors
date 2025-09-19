import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { useState } from "react";
import { Mail, Phone, Linkedin, Award, Star, Users, Calendar } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";

const teamMembers = [
  {
    id: '1',
    name: 'Michael Chen',
    role: 'Principal Designer & Founder',
    bio: '15+ years creating luxury residential spaces with international recognition.',
    fullBio: 'Michael founded NIVORA in 2015 with a vision to transform how people experience interior spaces. His work has been featured in Architectural Digest, Elle Decor, and House Beautiful. He holds a Master\'s in Interior Architecture from Parsons and has won numerous international design awards.',
    specialties: ['Luxury Residential', 'Hotel Design', 'Color Theory'],
    experience: '15+ years',
    education: 'M.A. Interior Architecture, Parsons',
    awards: ['ADC Gold Medal 2023', 'IDA Designer of the Year 2022', 'Best Residential Design 2021'],
    email: 'michael.chen@nivora.studio',
    phone: '+1 (555) 123-4567',
    linkedin: 'https://linkedin.com/in/michaelchen',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400'
  },
  {
    id: '2',
    name: 'Sarah Williams',
    role: 'Creative Director',
    bio: 'Architectural design and space planning expert with a passion for sustainable design.',
    fullBio: 'Sarah brings architectural precision to every interior project. With a background in both architecture and interior design, she specializes in sustainable practices and innovative space planning. She leads our design team and ensures every project meets our high standards for both beauty and functionality.',
    specialties: ['Sustainable Design', 'Space Planning', 'Commercial Interiors'],
    experience: '12+ years',
    education: 'B.Arch Architecture, MIT',
    awards: ['Green Design Excellence 2023', 'Sustainable Interior Award 2022'],
    email: 'sarah.williams@nivora.studio',
    phone: '+1 (555) 123-4568',
    linkedin: 'https://linkedin.com/in/sarahwilliams',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612c8e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400'
  },
  {
    id: '3',
    name: 'David Rodriguez',
    role: 'Senior Project Manager',
    bio: 'Commercial design specialist ensuring seamless project execution and client satisfaction.',
    fullBio: 'David oversees all project timelines and client relationships, ensuring every NIVORA project is delivered on time and exceeds expectations. His background in project management and client services makes him an invaluable part of our team, coordinating between designers, contractors, and clients.',
    specialties: ['Project Management', 'Client Relations', 'Quality Control'],
    experience: '10+ years',
    education: 'MBA Business Management, UCLA',
    awards: ['Excellence in Project Management 2023', 'Client Service Award 2022'],
    email: 'david.rodriguez@nivora.studio',
    phone: '+1 (555) 123-4569',
    linkedin: 'https://linkedin.com/in/davidrodriguez',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400'
  },
  {
    id: '4',
    name: 'Emily Zhang',
    role: 'Senior Interior Designer',
    bio: 'Specializes in contemporary luxury and minimalist aesthetics with attention to detail.',
    fullBio: 'Emily is our lead designer for contemporary projects, known for her minimalist approach and exquisite attention to detail. She has a unique ability to create serene, functional spaces that feel both luxurious and livable. Her work often features clean lines, natural materials, and thoughtful lighting design.',
    specialties: ['Contemporary Design', 'Minimalism', 'Lighting Design'],
    experience: '8+ years',
    education: 'B.F.A. Interior Design, RISD',
    awards: ['Rising Star Designer 2023', 'Contemporary Design Excellence 2022'],
    email: 'emily.zhang@nivora.studio',
    phone: '+1 (555) 123-4570',
    linkedin: 'https://linkedin.com/in/emilyzhang',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400'
  },
  {
    id: '5',
    name: 'Marcus Thompson',
    role: 'Design Consultant',
    bio: 'Expert in hospitality and restaurant design with a focus on creating memorable experiences.',
    fullBio: 'Marcus brings specialized expertise in hospitality design, having worked on over 50 restaurant and hotel projects worldwide. His designs create immersive experiences that enhance both functionality and brand identity. He understands the unique challenges of commercial spaces and delivers solutions that drive business success.',
    specialties: ['Hospitality Design', 'Restaurant Interiors', 'Brand Integration'],
    experience: '11+ years',
    education: 'M.A. Hospitality Design, Cornell',
    awards: ['Best Restaurant Design 2023', 'Hospitality Excellence Award 2022'],
    email: 'marcus.thompson@nivora.studio',
    phone: '+1 (555) 123-4571',
    linkedin: 'https://linkedin.com/in/marcusthompson',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400'
  }
];


export default function About() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">About Us</Badge>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6" data-testid="heading-about">About NIVORA</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Where architectural vision meets interior perfection. We are a team of passionate designers creating extraordinary spaces worldwide.
          </p>
        </div>

        {/* Company Story */}
        <section id="story" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8">Our Story</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2015, NIVORA has established itself as a premier interior design studio, 
                creating extraordinary spaces that seamlessly blend functionality with artistic vision. 
                Our award-winning team specializes in luxury residential and commercial projects worldwide.
              </p>
              <p>
                We believe that exceptional design has the power to transform not just spaces, but lives. 
                Our approach combines innovative thinking with timeless elegance, resulting in interiors 
                that are both visually stunning and perfectly suited to our clients' lifestyles.
              </p>
              <p>
                Every project we undertake is a testament to our commitment to excellence, attention to detail, 
                and dedication to creating environments that inspire and elevate the human experience.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-light text-primary mb-2" data-testid="stats-projects">150+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-primary mb-2" data-testid="stats-awards">25+</div>
                <div className="text-sm text-muted-foreground">Design Awards</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-primary mb-2" data-testid="stats-clients">200+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-primary mb-2" data-testid="stats-countries">12+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <OptimizedImage
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="NIVORA design team collaborating in modern studio"
              width={800}
              height={600}
              wrapperClassName="w-full"
              className="w-full h-full rounded-xl shadow-2xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
              data-testid="img-team-collaboration"
            />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full -z-10" />
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-accent/10 rounded-full -z-10" />
          </div>
        </section>

        {/* Our Philosophy */}
        <section id="philosophy" className="bg-card rounded-2xl p-12 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Our Design Philosophy</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We believe in creating spaces that tell stories, evoke emotions, and enhance the way people live and work.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-primary rounded-full" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Timeless Elegance</h3>
              <p className="text-muted-foreground">
                We create designs that transcend trends, focusing on timeless beauty and sophisticated aesthetics.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-primary rounded-full" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Functional Beauty</h3>
              <p className="text-muted-foreground">
                Every element serves a purpose while contributing to the overall aesthetic harmony of the space.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-primary rounded-full" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Personal Expression</h3>
              <p className="text-muted-foreground">
                We collaborate closely with clients to ensure each design reflects their unique personality and lifestyle.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our talented team of designers, architects, and project managers brings decades of combined experience.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card 
                key={member.id} 
                className={`text-center hover-scale transition-all duration-300 cursor-pointer ${
                  selectedMember === member.id ? 'ring-2 ring-primary shadow-xl' : ''
                }`}
                onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
                data-testid={`card-member-${member.id}`}
              >
                <CardContent className="p-6">
                  <OptimizedImage
                    src={member.image} 
                    alt={member.name}
                    width={96}
                    height={96}
                    wrapperClassName="w-24 h-24 mx-auto mb-4"
                    className="w-full h-full rounded-full border-4 border-primary/10"
                    sizes="96px"
                    data-testid={`img-member-${member.id}`}
                  />
                  <h3 className="text-lg font-serif font-semibold mb-1" data-testid={`text-name-${member.id}`}>
                    {member.name}
                  </h3>
                  <p className="text-primary mb-3 font-medium text-sm" data-testid={`text-role-${member.id}`}>
                    {member.role}
                  </p>
                  
                  {selectedMember === member.id ? (
                    <div className="space-y-4 text-left">
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        {member.fullBio}
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center">
                            <Star className="w-4 h-4 mr-2 text-primary" />
                            Specialties
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {member.specialties.map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="font-medium flex items-center mb-1">
                              <Calendar className="w-3 h-3 mr-1 text-primary" />
                              Experience
                            </span>
                            <span className="text-muted-foreground">{member.experience}</span>
                          </div>
                          <div>
                            <span className="font-medium flex items-center mb-1">
                              <Award className="w-3 h-3 mr-1 text-primary" />
                              Education
                            </span>
                            <span className="text-muted-foreground">{member.education}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center">
                            <Award className="w-4 h-4 mr-2 text-primary" />
                            Recent Awards
                          </h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {member.awards.map((award, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-1 h-1 bg-primary rounded-full mr-2" />
                                {award}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex justify-center space-x-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            asChild
                            data-testid={`button-email-${member.id}`}
                          >
                            <a href={`mailto:${member.email}`}>
                              <Mail className="w-4 h-4" />
                            </a>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            asChild
                            data-testid={`button-phone-${member.id}`}
                          >
                            <a href={`tel:${member.phone}`}>
                              <Phone className="w-4 h-4" />
                            </a>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            asChild
                            data-testid={`button-linkedin-${member.id}`}
                          >
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground" data-testid={`text-bio-${member.id}`}>
                      {member.bio}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Our Approach Section */}
        <section id="approach" className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Our Approach</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every project is unique, and our process is tailored to bring your vision to life with precision and care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Discovery & Consultation</h3>
              <p className="text-muted-foreground text-sm">
                We begin by understanding your lifestyle, preferences, and functional needs through detailed consultations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Concept Development</h3>
              <p className="text-muted-foreground text-sm">
                Our team creates detailed mood boards, 3D renderings, and design concepts tailored to your vision.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Design Implementation</h3>
              <p className="text-muted-foreground text-sm">
                We coordinate with trusted contractors and artisans to bring every detail to life with precision.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Final Styling</h3>
              <p className="text-muted-foreground text-sm">
                The finishing touches that transform your space into a perfectly curated environment.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact-cta" className="text-center mb-24">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Let's Create Something Amazing Together
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Ready to transform your space? We'd love to hear about your project and discuss how we can bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  asChild
                  data-testid="button-start-project"
                >
                  <Link href="/contact">Start Your Project</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                  data-testid="button-view-work"
                >
                  <Link href="/portfolio">View Our Work</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
