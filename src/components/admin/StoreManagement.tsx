import React, { useState } from 'react';
import { useStores } from '@/hooks/useStores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StoreForm } from './StoreForm';
import { Plus, Search, Edit, Trash2, Store, MapPin, Phone } from 'lucide-react';

export const StoreManagement: React.FC = () => {
  const { stores, loading, createStore, updateStore, deleteStore } = useStores();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStore, setEditingStore] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredStores = stores.filter(store => 
    store.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (store: any) => {
    setEditingStore(store);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (storeId: string) => {
    if (window.confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      await deleteStore(storeId);
    }
  };

  const handleCreateStore = async (storeData: any) => {
    await createStore(storeData);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateStore = async (storeData: any) => {
    if (editingStore) {
      await updateStore(editingStore.id, storeData);
      setIsEditDialogOpen(false);
      setEditingStore(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Management
              </CardTitle>
              <p className="text-muted-foreground">
                Manage your store locations and contact information
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Store
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Store</DialogTitle>
                </DialogHeader>
                <StoreForm
                  onSubmit={handleCreateStore}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stores by name, city, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell>
                      <div className="font-medium">{store.store_name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <div className="text-sm">
                          <div>{store.address || 'No address'}</div>
                          {store.city && <div className="text-muted-foreground">{store.city}</div>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {store.phone ? (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{store.phone}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No phone</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm max-w-xs truncate">
                        {store.hours || 'Not specified'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {store.map_link && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(store.map_link, '_blank')}
                          >
                            <MapPin className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(store)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(store.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStores.length === 0 && (
            <div className="text-center py-12">
              <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No stores found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first store location.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
          </DialogHeader>
          {editingStore && (
            <StoreForm
              initialData={editingStore}
              onSubmit={handleUpdateStore}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingStore(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};