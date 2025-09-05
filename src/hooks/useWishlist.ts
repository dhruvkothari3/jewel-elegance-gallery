import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  products: {
    id: string;
    name: string;
    images: string[];
    type: string;
    material: string;
    collection_id: string;
  };
}

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          user_id,
          product_id,
          created_at,
          products (
            id,
            name,
            images,
            type,
            material,
            collection_id
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to load wishlist items.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your wishlist.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('wishlists')
        .insert([{ user_id: user.id, product_id: productId }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already in Wishlist",
            description: "This item is already in your wishlist.",
            variant: "destructive"
          });
          return false;
        }
        throw error;
      }

      await fetchWishlist();
      toast({
        title: "Added to Wishlist",
        description: "Item has been added to your wishlist.",
      });
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist.",
        variant: "destructive"
      });
      return false;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      await fetchWishlist();
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist.",
        variant: "destructive"
      });
      return false;
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlist,
    wishlistCount: wishlistItems.length
  };
};