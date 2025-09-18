import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const teamMembers = [
  {
    id: '1',
    name: 'Michael Chen',
    role: 'Principal Designer',
    bio: '15+ years creating luxury residential spaces with international recognition.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400'
  },
  {
    id: '2',
    name: 'Sarah Williams',
    role: 'Creative Director',
    bio: 'Architectural design and space planning expert with a passion for sustainable design.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612c8e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400'
  },
  {
    id: '3',
    name: 'David Rodriguez',
    role: 'Project Manager',
    bio: 'Commercial design specialist ensuring seamless project execution and client satisfaction.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400'
  }
];

export default function About() {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
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
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="NIVORA design team collaborating in modern studio" 
              className="rounded-xl shadow-2xl w-full"
              data-testid="img-team-collaboration"
            />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full -z-10" />
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-accent/10 rounded-full -z-10" />
          </div>
        </div>

        {/* Our Philosophy */}
        <section className="bg-card rounded-2xl p-12 mb-24">
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
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our talented team of designers, architects, and project managers brings decades of combined experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="text-center hover-scale">
                <CardContent className="p-8">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                    data-testid={`img-member-${member.id}`}
                  />
                  <h3 className="text-xl font-serif font-semibold mb-2" data-testid={`text-name-${member.id}`}>
                    {member.name}
                  </h3>
                  <p className="text-primary mb-4 font-medium" data-testid={`text-role-${member.id}`}>
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-bio-${member.id}`}>
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mb-24">
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
