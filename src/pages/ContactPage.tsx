import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  HeadphonesIcon
} from 'lucide-react';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak directly with our jewelry experts',
      value: '+91 98765 43210',
      action: 'tel:+919876543210'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Quick responses via WhatsApp',
      value: '+91 98765 43210',
      action: 'https://api.whatsapp.com/send?phone=918369543332&text=Hello! I have a question about your jewelry collections.'
    },
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us a detailed message',
      value: 'care@elegance.com',
      action: 'mailto:care@elegance.com'
    }
  ];

  const officeInfo = [
    {
      icon: MapPin,
      title: 'Head Office',
      details: ['123, Linking Road, Bandra West', 'Mumbai, Maharashtra 400050']
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Saturday: 10 AM - 9 PM', 'Sunday: 11 AM - 8 PM']
    },
    {
      icon: HeadphonesIcon,
      title: 'Customer Support',
      details: ['24/7 WhatsApp Support', 'Email response within 4 hours']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <MessageCircle className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl md:text-6xl font-serif font-bold">
              Contact <span className="gradient-gold bg-clip-text text-transparent">Us</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about our jewelry? Need assistance with a purchase? 
            Our team is here to help you find the perfect piece.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Send us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder="Tell us about your inquiry, preferred jewelry types, budget, or any specific requirements..."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Quick Contact Methods */}
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold">Get in Touch</h2>
              <p className="text-muted-foreground">
                Choose the most convenient way to reach us:
              </p>
              
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="hover:shadow-elegant transition-shadow duration-300">
                    <CardContent className="p-4">
                      <a 
                        href={method.action}
                        target={method.action.startsWith('http') ? '_blank' : '_self'}
                        rel={method.action.startsWith('http') ? 'noopener noreferrer' : ''}
                        className="flex items-center space-x-4 hover:text-primary transition-colors"
                      >
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <method.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{method.title}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                          <p className="font-medium">{method.value}</p>
                        </div>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Office Information */}
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold">Office Information</h2>
              
              <div className="space-y-4">
                {officeInfo.map((info, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <info.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{info.title}</h3>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-muted-foreground text-sm">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* FAQ Quick Links */}
            <Card className="bg-accent/30">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Common Questions</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    • <span className="font-medium">Jewelry Care:</span> Cleaning and maintenance tips
                  </p>
                  <p className="text-muted-foreground">
                    • <span className="font-medium">Custom Orders:</span> Design process and timelines
                  </p>
                  <p className="text-muted-foreground">
                    • <span className="font-medium">Sizing:</span> Ring and bracelet sizing guide
                  </p>
                  <p className="text-muted-foreground">
                    • <span className="font-medium">Certificates:</span> Authenticity and appraisals
                  </p>
                </div>
                <div className="mt-4">
                  <a 
                    href="https://api.whatsapp.com/send?phone=918369543332&text=Hi! I have some questions about your jewelry services. Could you help me?"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Ask on WhatsApp
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;