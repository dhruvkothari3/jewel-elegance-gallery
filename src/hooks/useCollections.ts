import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  banner_image: string | null;
  handle: string;
  created_by: string | null;
  created_at: string;
}

export const useCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollections(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching collections",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async (collectionData: Omit<Collection, 'id' | 'created_at' | 'created_by'>) => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .insert([{
          ...collectionData,
          created_by: user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setCollections(prev => [data, ...prev]);
      toast({
        title: "Collection created successfully",
        description: `${data.name} collection has been created.`
      });
      
      return data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating collection",
        description: error.message
      });
      throw error;
    }
  };

  const updateCollection = async (id: string, updates: Partial<Collection>) => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCollections(prev => prev.map(c => c.id === id ? data : c));
      toast({
        title: "Collection updated successfully",
        description: `${data.name} has been updated.`
      });
      
      return data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating collection",
        description: error.message
      });
      throw error;
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCollections(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Collection deleted successfully",
        description: "Collection has been permanently deleted."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting collection",
        description: error.message
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return {
    collections,
    loading,
    fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection
  };
};