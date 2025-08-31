import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import bridalImage from '@/assets/collection-bridal.jpg';
import heroImage from '@/assets/hero-jewelry.jpg';

const CollectionShowcase = () => {
  const collections = [
    {
      id: 1,
      name: "Bridal Collection",
      description: "Exquisite designs for your most precious moments. Crafted with traditional artistry and modern elegance.",
      image: bridalImage,
      itemCount: "150+ pieces",
      featured: true
    },
    {
      id: 2,
      name: "Daily Elegance",
      description: "Sophisticated pieces that complement your everyday style with understated luxury.",
      image: heroImage,
      itemCount: "200+ pieces",
      featured: false
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-elegant">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Signature Collections
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collections, each telling a unique story of craftsmanship and beauty
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              className={`relative overflow-hidden rounded-2xl shadow-elegant group ${
                collection.featured ? 'lg:col-span-2' : ''
              }`}
            >
              <div className={`relative ${collection.featured ? 'aspect-[21/9]' : 'aspect-square'}`}>
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-elegant group-hover:scale-105"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className={`p-8 lg:p-12 text-background ${
                    collection.featured ? 'max-w-2xl' : 'max-w-lg'
                  }`}>
                    <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-4">
                      {collection.itemCount}
                    </span>
                    
                    <h3 className="text-3xl lg:text-4xl font-serif font-bold mb-4">
                      {collection.name}
                    </h3>
                    
                    <p className="text-lg mb-6 text-background/90 leading-relaxed">
                      {collection.description}
                    </p>
                    
                    <Button 
                      size="lg"
                      className="gradient-gold text-primary-foreground border-0 shadow-gold hover:shadow-elegant transition-elegant group"
                    >
                      Explore Collection
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? We create custom pieces tailored to your vision.
          </p>
          <Button 
            variant="outline"
            size="lg"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-elegant"
          >
            Custom Jewelry Consultation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CollectionShowcase;