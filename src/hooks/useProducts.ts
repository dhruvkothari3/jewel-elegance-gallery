import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  stock: number;
  type: 'ring' | 'necklace' | 'earring' | 'bracelet' | 'bangle';
  material: 'gold' | 'diamond' | 'platinum' | 'rose-gold';
  occasion: 'bridal' | 'festive' | 'daily-wear' | 'gift' | null;
  collection_id: string | null;
  featured: boolean;
  most_loved: boolean;
  new_arrival: boolean;
  is_deleted: boolean;
  sku: string | null;
  sizes: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching products",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          created_by: user?.id,
          updated_by: user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setProducts(prev => [data, ...prev]);
      toast({
        title: "Product created successfully",
        description: `${data.name} has been added to your inventory.`
      });
      
      return data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating product",
        description: error.message
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_by: user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProducts(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Product updated successfully",
        description: `${data.name} has been updated.`
      });
      
      return data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating product",
        description: error.message
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_deleted: true, updated_by: user?.id })
        .eq('id', id);

      if (error) throw error;
      
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Product deleted successfully",
        description: "Product has been moved to trash."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting product",
        description: error.message
      });
      throw error;
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ 
          stock: newStock,
          updated_by: user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProducts(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Stock updated successfully",
        description: `Stock level set to ${newStock}.`
      });
      
      return data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating stock",
        description: error.message
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock
  };
};