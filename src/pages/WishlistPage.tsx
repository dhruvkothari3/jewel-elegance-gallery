import { Link } from 'react-router-dom';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';
import { useJewelry } from '@/contexts/JewelryContext';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';

const WishlistPage = () => {
  const { wishlistItems, loading } = useWishlist();
  const { user } = useAuth();
  const { items } = useJewelry();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-serif font-bold mb-4">Login Required</h1>
          <p className="text-muted-foreground mb-8">
            Please login to view and manage your wishlist.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Wishlist</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-serif font-bold">My Wishlist</h1>
              <p className="text-muted-foreground">
                {(() => {
                  const staticWishlist = JSON.parse(localStorage.getItem('staticWishlist') || '[]');
                  const totalCount = wishlistItems.length + staticWishlist.length;
                  return `${totalCount} item${totalCount !== 1 ? 's' : ''} saved for later`;
                })()}
              </p>
            </div>
          </div>
          
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Wishlist Items */}
        {(() => {
          // Get static wishlist items
          const staticWishlist = JSON.parse(localStorage.getItem('staticWishlist') || '[]');
          const staticItems = items.filter(item => staticWishlist.includes(item.id.toString()));
          
          // Combine database and static items
          const allWishlistItems = [
            ...wishlistItems.map(item => ({
              id: item.products.id,
              name: item.products.name,
              collection: item.products.collection_id || 'Elegance',
              type: item.products.type,
              material: item.products.material,
              occasion: 'Special',
              image: item.products.images?.[0] || '/src/assets/product-ring.jpg',
              priceRange: '₹25,000 - ₹75,000',
              sku: '',
              description: '',
              isNew: false,
              isStatic: false
            })),
            ...staticItems.map(item => ({
              id: item.id,
              name: item.name,
              collection: item.collection,
              type: item.type,
              material: item.material,
              occasion: item.occasion,
              image: item.image,
              priceRange: item.priceRange,
              sku: item.sku,
              description: item.description,
              isNew: item.isNew,
              isStatic: true
            }))
          ];

          return allWishlistItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allWishlistItems.map((item) => (
                  <ProductCard
                    key={`${item.isStatic ? 'static' : 'db'}-${item.id}`}
                    id={item.id}
                    name={item.name}
                    collection={item.collection}
                    type={item.type}
                    material={item.material}
                    occasion={item.occasion}
                    image={item.image}
                    priceRange={item.priceRange}
                    sku={item.sku}
                    description={item.description}
                    isNew={item.isNew}
                    viewMode="grid"
                  />
                ))}
              </div>
            
            {/* Action Bar */}
            <div className="mt-12 p-6 bg-accent/50 rounded-lg">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold mb-1">Ready to make a purchase?</h3>
                  <p className="text-muted-foreground text-sm">
                    Visit our stores or contact us for personalized assistance.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link to="/stores">
                    <Button variant="outline">
                      Find Stores
                    </Button>
                  </Link>
                  <a 
                    href="https://api.whatsapp.com/send?phone=918369543332&text=Hi! I'm interested in some items from my wishlist. Could you help me with more information?"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Get Assistance
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </>
          ) : (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start adding items to your wishlist by clicking the heart icon on any product you love.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/">
                <Button>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Start Shopping
                </Button>
              </Link>
              <Link to="/collections">
                <Button variant="outline">
                  Browse Collections  
                </Button>
              </Link>
            </div>
          </div>
        );
        })()}
      </div>
    </div>
  );
};

export default WishlistPage;