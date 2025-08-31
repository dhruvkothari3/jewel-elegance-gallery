import { useState } from 'react';
import { ArrowLeft, Heart, Share2, MapPin, Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Navigation from '@/components/Navigation';
import productRing from '@/assets/product-ring.jpg';
import productEarrings from '@/assets/product-earrings.jpg';
import productNecklace from '@/assets/product-necklace.jpg';

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const product = {
    id: 1,
    name: "Eternal Promise Diamond Ring",
    collection: "Bridal Collection",
    sku: "EL-BR-001",
    material: "18K Rose Gold",
    occasion: "Bridal, Anniversary",
    priceRange: "₹85,000 - ₹1,20,000",
    description: "A breathtaking symbol of eternal love, this exquisite diamond ring features a stunning center stone surrounded by delicately placed diamonds. Crafted in lustrous 18K rose gold, every detail speaks of timeless elegance and unmatched craftsmanship.",
    features: [
      "Certified diamonds with excellent cut grade",
      "18K rose gold setting with rhodium plating",
      "Available in sizes 4-10 (US sizing)",
      "Comes with lifetime warranty and certification",
      "Free resizing within 30 days of purchase"
    ],
    specifications: {
      "Metal Type": "18K Rose Gold",
      "Diamond Quality": "VS-SI, F-G Color",
      "Total Weight": "3.2 grams",
      "Ring Size": "Adjustable 4-10",
      "Certification": "BIS Hallmark, Diamond Certificate"
    },
    images: [productRing, productEarrings, productNecklace],
    isNew: true
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Button variant="ghost" size="sm" className="p-0 h-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collections
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover jewelry-hover"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-elegant ${
                    selectedImage === index 
                      ? 'border-primary shadow-gold' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  {product.isNew && (
                    <Badge className="bg-primary text-primary-foreground mb-2">
                      New Arrival
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground">{product.collection}</p>
                  <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                    {product.name}
                  </h1>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={isFavorite ? 'bg-red-50 text-red-500 border-red-200' : ''}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-2xl font-bold text-primary mb-4">{product.priceRange}</p>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Product Details */}
            <div>
              <h3 className="text-lg font-serif font-semibold mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">SKU:</span>
                  <p className="font-medium">{product.sku}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Material:</span>
                  <p className="font-medium">{product.material}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Occasion:</span>
                  <p className="font-medium">{product.occasion}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div>
              <h3 className="text-lg font-serif font-semibold mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                Key Features
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-serif font-semibold mb-4">Specifications</h3>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  variant="elegant"
                  className="flex-1 shadow-gold hover:shadow-elegant"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Enquire at Store
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Schedule Viewing
                </Button>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <p>Prices may vary based on current gold rates and customization</p>
                <p className="font-medium text-primary">Call +91 98765 43210 for exact pricing</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;