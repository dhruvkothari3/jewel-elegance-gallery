import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, MapPin, Eye, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Navigation from '@/components/Navigation';
import { useJewelry } from '@/contexts/JewelryContext';
import { getWhatsAppUrl } from '@/lib/whatsapp';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items } = useJewelry();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const product = items.find(item => item.id === parseInt(id || '1'));

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }

  // Enhanced product data for display
  const enhancedProduct = {
    ...product,
    images: [product.image, product.image, product.image], // Using same image for demo
    features: [
      "Certified materials with excellent quality grade",
      "Premium setting with protective coating",
      "Available in multiple sizes",
      "Comes with lifetime warranty and certification",
      "Free maintenance for first year"
    ],
    specifications: {
      "Metal Type": product.material,
      "Item Code": product.sku,
      "Collection": product.collection,
      "Occasion": product.occasion,
      "Price Range": product.priceRange
    }
  };

  const whatsappUrl = getWhatsAppUrl({
    name: product.name,
    description: product.description,
    priceRange: product.priceRange,
    images: enhancedProduct.images
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-auto"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collections
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={enhancedProduct.images[selectedImage]}
                alt={enhancedProduct.name}
                className="w-full h-full object-cover jewelry-hover"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {enhancedProduct.images.map((image, index) => (
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
                    alt={`${enhancedProduct.name} view ${index + 1}`}
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
                  {enhancedProduct.isNew && (
                    <Badge className="bg-primary text-primary-foreground mb-2">
                      New Arrival
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground">{enhancedProduct.collection}</p>
                  <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                    {enhancedProduct.name}
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
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-9 px-3 rounded-md text-sm font-medium bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors"
                    title="WhatsApp Inquiry"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-2xl font-bold text-primary mb-4">{enhancedProduct.priceRange}</p>
              <p className="text-muted-foreground leading-relaxed">{enhancedProduct.description}</p>
            </div>

            <Separator />

            {/* Product Details */}
            <div>
              <h3 className="text-lg font-serif font-semibold mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">SKU:</span>
                  <p className="font-medium">{enhancedProduct.sku}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Material:</span>
                  <p className="font-medium">{enhancedProduct.material}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium">{enhancedProduct.type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Occasion:</span>
                  <p className="font-medium">{enhancedProduct.occasion}</p>
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
                {enhancedProduct.features.map((feature, index) => (
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
                {Object.entries(enhancedProduct.specifications).map(([key, value]) => (
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