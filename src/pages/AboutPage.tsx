import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { 
  Crown, 
  Award, 
  Users, 
  Heart, 
  Sparkles, 
  Shield,
  MapPin,
  Star
} from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Crown,
      title: 'Craftsmanship Excellence',
      description: 'Each piece is meticulously crafted by master artisans with decades of expertise, ensuring unparalleled quality and attention to detail.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We believe every customer deserves personalized attention and care. Your satisfaction and trust are our highest priorities.'
    },
    {
      icon: Shield,
      title: 'Authentic Quality',
      description: 'We source only the finest materials and guarantee the authenticity of every gemstone and metal in our collections.'
    },
    {
      icon: Sparkles,
      title: 'Timeless Design', 
      description: 'Our designs blend traditional elegance with contemporary style, creating pieces that transcend trends and time.'
    }
  ];

  const milestones = [
    { year: '1985', achievement: 'Founded Elegance Jewelry with a vision of accessible luxury' },
    { year: '1995', achievement: 'Expanded to 5 cities with our signature collections' },
    { year: '2005', achievement: 'Launched custom design services and bridal consultations' },
    { year: '2015', achievement: 'Introduced sustainable sourcing and ethical practices' },
    { year: '2020', achievement: 'Digital transformation with online consultations' },
    { year: '2024', achievement: 'Serving 50,000+ satisfied customers across India' }
  ];

  const team = [
    {
      name: 'Rajesh Gupta',
      role: 'Founder & Master Craftsman',
      experience: '40+ Years',
      specialty: 'Traditional Indian Jewelry'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Design',
      experience: '15+ Years',
      specialty: 'Contemporary & Bridal'
    },
    {
      name: 'Amit Kumar',
      role: 'Gemstone Expert',
      experience: '20+ Years',
      specialty: 'Precious Stones & Certification'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Crown className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl md:text-6xl font-serif font-bold">
              About <span className="gradient-gold bg-clip-text text-transparent">Elegance</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            For nearly four decades, Elegance has been synonymous with exceptional jewelry craftsmanship, 
            creating timeless pieces that celebrate life's most precious moments.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p>
              Founded in 1985 by master craftsman Rajesh Gupta, Elegance began as a small workshop 
              in Mumbai with a simple vision: to make exquisite jewelry accessible to everyone who 
              appreciates beauty and craftsmanship.
            </p>
            <p>
              What started as a passion project has grown into one of India's most trusted jewelry 
              brands, serving customers across multiple cities with a perfect blend of traditional 
              techniques and contemporary designs.
            </p>
            <p>
              Today, we're proud to have created thousands of cherished pieces that mark life's 
              most important celebrations - from engagements and weddings to anniversaries and 
              milestone achievements.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 hover:shadow-elegant transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <Badge variant="secondary" className="text-primary font-bold px-3 py-1">
                    {milestone.year}
                  </Badge>
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground">{milestone.achievement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-16" />

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Meet Our Experts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{member.experience}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.specialty}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-accent/30 rounded-lg p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">40+</div>
              <div className="text-sm text-muted-foreground">Years of Excellence</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50k+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-sm text-muted-foreground">Store Locations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Unique Designs</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Experience Elegance</h2>
          <p className="text-muted-foreground mb-8">
            Visit our stores to see our craftsmanship firsthand, or explore our collections online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/stores">
              <Button className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Find a Store
              </Button>
            </Link>
            <Link to="/collections">
              <Button variant="outline" className="flex items-center">
                <Star className="mr-2 h-4 w-4" />
                Browse Collections
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;