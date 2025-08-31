import { useState } from 'react';
import { MapPin, Phone, Clock, Navigation2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  type: string;
  featured: boolean;
  coordinates: { lat: number; lng: number };
  city: string;
}

const stores: Store[] = [
  {
    id: 1,
    name: "Elegance Flagship Store",
    address: "123 Gold Street, Jewelry District, Mumbai 400001",
    phone: "+91 98765 43210",
    hours: "Mon-Sat: 10:00 AM - 9:00 PM, Sun: 11:00 AM - 8:00 PM",
    type: "Flagship Store",
    featured: true,
    coordinates: { lat: 19.0760, lng: 72.8777 },
    city: "Mumbai"
  },
  {
    id: 2,
    name: "Elegance Delhi Showroom",
    address: "456 Diamond Plaza, Connaught Place, New Delhi 110001",
    phone: "+91 98765 43211",
    hours: "Mon-Sat: 10:30 AM - 9:30 PM, Sun: 11:00 AM - 8:00 PM",
    type: "Premium Showroom",
    featured: false,
    coordinates: { lat: 28.6139, lng: 77.2090 },
    city: "Delhi"
  },
  {
    id: 3,
    name: "Elegance Bangalore Store",
    address: "789 Brigade Road, MG Road Area, Bangalore 560001",
    phone: "+91 98765 43212",
    hours: "Mon-Sun: 10:00 AM - 9:00 PM",
    type: "City Store",
    featured: false,
    coordinates: { lat: 12.9716, lng: 77.5946 },
    city: "Bangalore"
  },
  {
    id: 4,
    name: "Elegance Chennai Boutique",
    address: "321 Express Avenue, Royapettah, Chennai 600014",
    phone: "+91 98765 43213",
    hours: "Mon-Sat: 10:00 AM - 9:00 PM, Sun: 12:00 PM - 8:00 PM",
    type: "Boutique Store",
    featured: false,
    coordinates: { lat: 13.0827, lng: 80.2707 },
    city: "Chennai"
  }
];

const StoreMap = () => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className="gradient-gold text-primary-foreground border-0 shadow-gold hover:shadow-elegant transition-elegant"
        >
          <Navigation2 className="h-4 w-4 mr-2" />
          Find Nearest Store
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Store Locations</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
          {/* Store List */}
          <div className="space-y-4 overflow-y-auto pr-2">
            {stores.map((store) => (
              <Card 
                key={store.id} 
                className={`cursor-pointer transition-all duration-200 ${
                  selectedStore?.id === store.id 
                    ? 'ring-2 ring-primary shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedStore(store)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-serif text-foreground">
                        {store.name}
                      </CardTitle>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
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
                
                <CardContent className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{store.address}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{store.phone}</p>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">{store.hours}</p>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Call Store
                    </Button>
                    <Button size="sm" variant="secondary" className="flex-1">
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Map Placeholder */}
          <div className="bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
            <div className="text-center p-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Interactive Map</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {selectedStore ? (
                  <>
                    <strong>{selectedStore.name}</strong><br />
                    {selectedStore.city} • {selectedStore.type}
                  </>
                ) : (
                  "Select a store to view on map"
                )}
              </p>
              <Button variant="outline" size="sm">
                <Navigation2 className="h-4 w-4 mr-2" />
                Open in Maps
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground mt-4">
          Interactive map integration available with location services
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreMap;