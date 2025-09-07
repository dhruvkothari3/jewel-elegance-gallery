import { useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import CollectionShowcase from '@/components/CollectionShowcase';
import StoreLocator from '@/components/StoreLocator';
import { useJewelry } from '@/contexts/JewelryContext';
import { Link } from 'react-router-dom';

const Index = () => {
  const { filters } = useJewelry();
  const productsSectionRef = useRef<HTMLElement>(null);
  
  // Check if any filters are active
  const hasActiveFilters = () => {
    return filters.search || 
           filters.materials.length > 0 || 
           filters.types.length > 0 || 
           filters.occasions.length > 0 || 
           filters.collections.length > 0;
  };

  const showFilters = hasActiveFilters();

  // Scroll to products section when filters become active
  useEffect(() => {
    if (showFilters && productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [showFilters]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Show hero section only when no filters are active */}
        {!showFilters && <HeroSection />}
        
        {/* Always show featured products (which will show filtered results when filters are active) */}
        <section ref={productsSectionRef}>
          <FeaturedProducts />
        </section>
        
        {/* Show collections and store locator only when no filters are active */}
        {!showFilters && (
          <>
            <div id="collections">
              <CollectionShowcase />
            </div>
            <StoreLocator />
          </>
        )}
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
                <li><Link to="/collections" className="hover:text-primary transition-smooth">Collections</Link></li>
                <li><Link to="/stores" className="hover:text-primary transition-smooth">Store Locator</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-smooth">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-smooth">Contact</Link></li>
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
