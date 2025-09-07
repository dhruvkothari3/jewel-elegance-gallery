import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStores } from '@/hooks/useStores';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import ScheduleViewingDialog from '@/components/ScheduleViewingDialog';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation as NavigationIcon, 
  ArrowLeft,
  MessageCircle,
  Calendar,
  Star
} from 'lucide-react';

const StoreDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { stores, loading } = useStores();
  const { user } = useAuth();
  const { toast } = useToast();

  // Sample stores for demonstration
  const sampleStores = {
    'mumbai-main': {
      id: 'mumbai-main',
      store_name: 'Elegance Mumbai - Main Branch',
      address: '123, Linking Road, Bandra West',
      city: 'Mumbai',
      phone: '+91 98765 43210',
      hours: 'Mon-Sat: 10 AM - 9 PM, Sun: 11 AM - 8 PM',
      map_link: 'https://maps.google.com/?q=Bandra+West+Mumbai',
      lat: 19.0596,
      lng: 72.8295,
      description: 'Our flagship store in Mumbai offers the complete Elegance experience with our full collection, expert consultants, and luxurious ambiance.',
      features: ['Personal Shopping', 'Custom Design', 'Jewelry Repair', 'Appraisal Services'],
      manager: 'Priya Sharma',
      whatsapp: '+919876543210'
    },
    'delhi-cp': {
      id: 'delhi-cp',
      store_name: 'Elegance Delhi - Connaught Place',
      address: 'A-15, Connaught Place, Central Delhi',
      city: 'Delhi',
      phone: '+91 98765 43211',
      hours: 'Mon-Sat: 10 AM - 9 PM, Sun: 11 AM - 8 PM',
      map_link: 'https://maps.google.com/?q=Connaught+Place+Delhi',
      lat: 28.6315,
      lng: 77.2167,
      description: 'Located in the heart of Delhi, our Connaught Place store brings elegance to the capital with a premium collection and personalized service.',
      features: ['Bridal Consultation', 'VIP Lounge', 'Custom Design', 'Jewelry Insurance'],
      manager: 'Rajesh Kumar',
      whatsapp: '+919876543211'
    },
    'bangalore-mg': {
      id: 'bangalore-mg',
      store_name: 'Elegance Bangalore - MG Road',
      address: '456, MG Road, Near Brigade Road',
      city: 'Bangalore',
      phone: '+91 98765 43212',
      hours: 'Mon-Sat: 10 AM - 9 PM, Sun: 11 AM - 8 PM',
      map_link: 'https://maps.google.com/?q=MG+Road+Bangalore',
      lat: 12.9716,
      lng: 77.5946,
      description: 'Our Bangalore showroom combines traditional craftsmanship with modern design, perfect for the tech-savvy jewelry enthusiast.',
      features: ['Tech Consultation', 'Online Integration', 'Express Services', 'Digital Catalog'],
      manager: 'Anita Reddy',
      whatsapp: '+919876543212'
    }
  };

  const dbStore = stores.find(s => s.id === id);
  const sampleStore = id ? sampleStores[id as keyof typeof sampleStores] : null;
  const store = dbStore || sampleStore;


  const generateWhatsAppMessage = () => {
    if (!store) return '';
    
    const message = `Hi! I'm interested in visiting your ${store.store_name}. I'd like to know more about your jewelry collections and would like to schedule a visit.`;
    return `https://api.whatsapp.com/send?phone=918369543332&text=${encodeURIComponent(message)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-64 w-full rounded-lg mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Store Not Found</h1>
          <p className="text-muted-foreground mb-8">The store you're looking for doesn't exist.</p>
          <Link to="/stores">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Stores
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/stores" className="hover:text-primary transition-colors">Stores</Link>
          <span>/</span>
          <span className="text-foreground">{store.store_name}</span>
        </nav>
      </div>

      {/* Store Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/stores">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Stores
            </Button>
          </Link>
          <Badge variant="secondary">{store.city}</Badge>
        </div>

        {/* Store Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">{store.store_name}</CardTitle>
            {sampleStore?.description && (
              <p className="text-muted-foreground">{sampleStore.description}</p>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Contact Information</h3>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground text-sm">{store.address}</p>
                  </div>
                </div>
                
                {store.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a 
                        href={`tel:${store.phone}`}
                        className="text-muted-foreground text-sm hover:text-primary transition-colors"
                      >
                        {store.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {store.hours && (
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Hours</p>
                      <p className="text-muted-foreground text-sm">{store.hours}</p>
                    </div>
                  </div>
                )}

                {sampleStore?.manager && (
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium">Store Manager</p>
                      <p className="text-muted-foreground text-sm">{sampleStore.manager}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Services & Features */}
              {sampleStore?.features && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Services</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {sampleStore.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="justify-center py-2">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-6 border-t">
              {store.map_link && (
                <a 
                  key="directions"
                  href={store.map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="flex-1 sm:flex-none">
                    <NavigationIcon className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                </a>
              )}
              
              <a 
                href={generateWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="flex-1 sm:flex-none">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </a>

              <ScheduleViewingDialog
                storeId={store?.id}
                trigger={
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Visit
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Map placeholder */}
        {store.lat && store.lng && (
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground">Interactive map would be displayed here</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Coordinates: {store.lat}, {store.lng}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StoreDetailPage;