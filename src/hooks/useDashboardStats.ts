import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalProducts: number;
  totalCollections: number;
  totalStores: number;
  lowStockItems: number;
  outOfStockItems: number;
  featuredProducts: number;
  newArrivals: number;
  loading: boolean;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCollections: 0,
    totalStores: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    featuredProducts: 0,
    newArrivals: 0,
    loading: true
  });

  const fetchStats = async () => {
    try {
      // Fetch products stats
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('stock, featured, new_arrival, is_deleted')
        .eq('is_deleted', false);

      if (productsError) throw productsError;

      // Fetch collections count
      const { count: collectionsCount, error: collectionsError } = await supabase
        .from('collections')
        .select('*', { count: 'exact', head: true });

      if (collectionsError) throw collectionsError;

      // Fetch stores count
      const { count: storesCount, error: storesError } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true });

      if (storesError) throw storesError;

      // Calculate product stats
      const totalProducts = products?.length || 0;
      const lowStockItems = products?.filter(p => p.stock > 0 && p.stock < 10).length || 0;
      const outOfStockItems = products?.filter(p => p.stock === 0).length || 0;
      const featuredProducts = products?.filter(p => p.featured).length || 0;
      const newArrivals = products?.filter(p => p.new_arrival).length || 0;

      setStats({
        totalProducts,
        totalCollections: collectionsCount || 0,
        totalStores: storesCount || 0,
        lowStockItems,
        outOfStockItems,
        featuredProducts,
        newArrivals,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, refetchStats: fetchStats };
};