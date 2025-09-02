import React, { useState } from 'react';
import { useCollections } from '@/hooks/useCollections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CollectionForm } from './CollectionForm';
import { Plus, Search, Edit, Trash2, Gem } from 'lucide-react';

export const CollectionManagement: React.FC = () => {
  const { collections, loading, createCollection, updateCollection, deleteCollection } = useCollections();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCollection, setEditingCollection] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredCollections = collections.filter(collection => 
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (collection: any) => {
    setEditingCollection(collection);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (collectionId: string) => {
    if (window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      await deleteCollection(collectionId);
    }
  };

  const handleCreateCollection = async (collectionData: any) => {
    await createCollection(collectionData);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateCollection = async (collectionData: any) => {
    if (editingCollection) {
      await updateCollection(editingCollection.id, collectionData);
      setIsEditDialogOpen(false);
      setEditingCollection(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading collections...</p>
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
                <Gem className="h-5 w-5" />
                Collection Management
              </CardTitle>
              <p className="text-muted-foreground">
                Organize your jewelry into beautiful collections
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Collection
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Collection</DialogTitle>
                </DialogHeader>
                <CollectionForm
                  onSubmit={handleCreateCollection}
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
                placeholder="Search collections by name or handle..."
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
                  <TableHead>Collection</TableHead>
                  <TableHead>Handle</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCollections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {collection.banner_image && (
                          <img 
                            src={collection.banner_image} 
                            alt={collection.name}
                            className="h-10 w-16 rounded-md object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{collection.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {collection.handle}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-muted-foreground">
                        {collection.description || 'No description'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(collection.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(collection)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(collection.id)}
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

          {filteredCollections.length === 0 && (
            <div className="text-center py-12">
              <Gem className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No collections found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first collection.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          {editingCollection && (
            <CollectionForm
              initialData={editingCollection}
              onSubmit={handleUpdateCollection}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingCollection(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};