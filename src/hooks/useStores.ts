import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Store {
  id: string;
  store_name: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  hours: string | null;
  map_link: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStores(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching stores",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const createStore = async (storeData: Omit<Store, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .insert([storeData])
        .select()
        .single();

      if (error) throw error;
      
      setStores(prev => [data, ...prev]);
      toast({
        title: "Store created successfully",
        description: `${data.store_name} has been added.`
      });
      
      return data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating store",
        description: error.message
      });
      throw error;
    }
  };

  const updateStore = async (id: string, updates: Partial<Store>) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setStores(prev => prev.map(s => s.id === id ? data : s));
      toast({
        title: "Store updated successfully",
        description: `${data.store_name} has been updated.`
      });
      
      return data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating store",
        description: error.message
      });
      throw error;
    }
  };

  const deleteStore = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setStores(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Store deleted successfully",
        description: "Store has been permanently deleted."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting store",
        description: error.message
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return {
    stores,
    loading,
    fetchStores,
    createStore,
    updateStore,
    deleteStore
  };
};