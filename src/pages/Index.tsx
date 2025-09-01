import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import CollectionShowcase from '@/components/CollectionShowcase';
import StoreLocator from '@/components/StoreLocator';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <HeroSection />
        <FeaturedProducts />
        <div id="collections">
          <CollectionShowcase />
        </div>
        <StoreLocator />
      </main>
      
      {/* Footer */}
      <footer className="bg-accent text-accent-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-serif font-bold gradient-gold bg-clip-text text-transparent mb-4">
                Elegance
              </h3>
              <p className="text-accent-foreground/80 mb-4 max-w-md">
                Crafting timeless jewelry pieces that celebrate life's most precious moments. 
                Each design tells a story of elegance, tradition, and modern sophistication.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-accent-foreground/80">
                <li><a href="#collections" className="hover:text-primary transition-smooth">Collections</a></li>
                <li><a href="#stores" className="hover:text-primary transition-smooth">Store Locator</a></li>
                <li><a href="#about" className="hover:text-primary transition-smooth">About Us</a></li>
                <li><a href="#contact" className="hover:text-primary transition-smooth">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Customer Care</h4>
              <ul className="space-y-2 text-accent-foreground/80">
                <li>Call: +91 98765 43210</li>
                <li>Email: care@elegance.com</li>
                <li>Mon-Sat: 10 AM - 9 PM</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-accent-foreground/20 mt-8 pt-8 text-center text-accent-foreground/60">
            <p>&copy; 2024 Elegance Jewelry. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
