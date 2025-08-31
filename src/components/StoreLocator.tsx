import { MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StoreMap from './StoreMap';

const StoreLocator = () => {
  const stores = [
    {
      id: 1,
      name: "Elegance Flagship Store",
      address: "123 Gold Street, Jewelry District, Mumbai 400001",
      phone: "+91 98765 43210",
      hours: "Mon-Sat: 10:00 AM - 9:00 PM, Sun: 11:00 AM - 8:00 PM",
      type: "Flagship Store",
      featured: true
    },
    {
      id: 2,
      name: "Elegance Delhi Showroom",
      address: "456 Diamond Plaza, Connaught Place, New Delhi 110001",
      phone: "+91 98765 43211",
      hours: "Mon-Sat: 10:30 AM - 9:30 PM, Sun: 11:00 AM - 8:00 PM",
      type: "Premium Showroom",
      featured: false
    },
    {
      id: 3,
      name: "Elegance Bangalore Store",
      address: "789 Brigade Road, MG Road Area, Bangalore 560001",
      phone: "+91 98765 43212",
      hours: "Mon-Sun: 10:00 AM - 9:00 PM",
      type: "City Store",
      featured: false
    },
    {
      id: 4,
      name: "Elegance Chennai Boutique",
      address: "321 Express Avenue, Royapettah, Chennai 600014",
      phone: "+91 98765 43213",
      hours: "Mon-Sat: 10:00 AM - 9:00 PM, Sun: 12:00 PM - 8:00 PM",
      type: "Boutique Store",
      featured: false
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Visit Our Stores
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience our exquisite jewelry collections in person at our premium locations across India
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <StoreMap />
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-elegant"
            >
              <Phone className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stores.map((store) => (
            <Card 
              key={store.id} 
              className={`shadow-soft hover:shadow-elegant transition-elegant ${
                store.featured ? 'ring-2 ring-primary ring-opacity-50' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-serif text-foreground line-clamp-1">
                      {store.name}
                    </CardTitle>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                      store.featured 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {store.type}
                    </span>
                  </div>
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground leading-relaxed">
                      {store.address}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-muted-foreground">
                      {store.phone}
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {store.hours}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
                  >
                    Visit Store
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="flex-1"
                  >
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Need help finding the perfect piece? Our jewelry consultants are here to assist you.
          </p>
          <p className="text-sm text-muted-foreground">
            All stores follow strict safety protocols. Appointments recommended for personalized consultations.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StoreLocator;