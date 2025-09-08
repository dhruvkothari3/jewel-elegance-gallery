import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, MapPin, Eye, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Navigation from '@/components/Navigation';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/use-toast';
import ScheduleViewingDialog from '@/components/ScheduleViewingDialog';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Tables<'products'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        if (error || !data) {
          if (!cancelled) setNotFound(true);
          return;
        }
        if (!cancelled) {
          setProduct(data);
          setSelectedImage(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">Loading product...</div>
      </div>
    );
  }

  if (notFound || !product) {
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

  const images: string[] = Array.isArray(product.images) ? product.images : [];
  const primaryImage = images[selectedImage] || images[0] || '';

  const whatsappUrl = useMemo(() => {
    return getWhatsAppUrl({
      id: id || '',
      name: product.name,
      description: product.description || '',
      priceRange: '',
      images: images.length > 0 ? images : [''],
    });
  }, [id, product.name, product.description, images]);

  const handleWishlistToggle = async () => {
    const productId = id || '0';
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.description,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied!",
          description: "Product link has been copied to your clipboard.",
        });
      } catch (err) {
        console.log('Error copying to clipboard:', err);
      }
    }
  };

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
                src={primaryImage}
                alt={product.name}
                className="w-full h-full object-cover jewelry-hover"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {images.map((image, index) => (
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
                  {product.new_arrival && (
                    <Badge className="bg-primary text-primary-foreground mb-2">
                      New Arrival
                    </Badge>
                  )}
                  <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                    {product.name}
                  </h1>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleWishlistToggle}
                    className={isInWishlist(id || '0') ? 'bg-red-50 text-red-500 border-red-200' : ''}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(id || '0') ? 'fill-current' : ''}`} />
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
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-2xl font-bold text-primary mb-4">Price on request</p>
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
                  <p className="font-medium">{String(product.material)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium">{String(product.type)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Occasion:</span>
                  <p className="font-medium">{product.occasion ? String(product.occasion) : '-'}</p>
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
              <p className="text-sm text-muted-foreground">Crafted with premium materials and attention to detail.</p>
            </div>

            <Separator />

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-serif font-semibold mb-4">Specifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Stock:</span>
                  <span className="font-medium text-right">{product.stock}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button 
                    size="lg" 
                    variant="elegant"
                    className="w-full shadow-gold hover:shadow-elegant"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Enquire at Store
                  </Button>
                </a>
                <ScheduleViewingDialog
                  productId={id}
                  productName={product.name}
                  trigger={
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Schedule Viewing
                    </Button>
                  }
                />
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <p>Prices may vary based on current gold rates and customization</p>
                <a 
                  href="tel:+919876543210"
                  className="font-medium text-primary hover:underline"
                >
                  Call +91 98765 43210 for exact pricing
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;