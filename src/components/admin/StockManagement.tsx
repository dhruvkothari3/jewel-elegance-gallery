import React, { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCollections } from '@/hooks/useCollections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Package, Search, Edit2, Plus, Minus } from 'lucide-react';

export const StockManagement: React.FC = () => {
  const { products, loading, updateStock } = useProducts();
  const { collections } = useCollections();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [stockAdjustment, setStockAdjustment] = useState('');
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);

  const filteredProducts = products.filter(product => 
    !product.is_deleted &&
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const lowStockProducts = filteredProducts.filter(p => p.stock < 10);
  const outOfStockProducts = filteredProducts.filter(p => p.stock === 0);

  const getCollectionName = (collectionId: string | null) => {
    if (!collectionId) return 'No Collection';
    const collection = collections.find(c => c.id === collectionId);
    return collection?.name || 'Unknown Collection';
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (stock < 10) return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  const handleStockEdit = (product: any) => {
    setSelectedProduct(product);
    setStockAdjustment(product.stock.toString());
    setIsStockDialogOpen(true);
  };

  const handleStockUpdate = async () => {
    if (selectedProduct && stockAdjustment !== '') {
      const newStock = parseInt(stockAdjustment, 10);
      if (newStock >= 0) {
        await updateStock(selectedProduct.id, newStock);
        setIsStockDialogOpen(false);
        setSelectedProduct(null);
        setStockAdjustment('');
      }
    }
  };

  const handleQuickAdjustment = async (product: any, adjustment: number) => {
    const newStock = Math.max(0, product.stock + adjustment);
    await updateStock(product.id, newStock);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading stock data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stock Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">Items with stock below 10</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">Items requiring immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Stock Management
              </CardTitle>
              <p className="text-muted-foreground">
                Monitor and adjust inventory levels
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, SKU, or type..."
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
                  <TableHead>Product</TableHead>
                  <TableHead>Collection</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {product.images?.[0] && (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">{product.name}</div>
                            {product.sku && (
                              <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getCollectionName(product.collection_id)}</TableCell>
                      <TableCell>
                        <div className={`font-medium text-lg ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-orange-600' : ''}`}>
                          {product.stock}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuickAdjustment(product, -1)}
                            disabled={product.stock <= 0}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStockEdit(product)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuickAdjustment(product, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'No products available for stock management.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stock Adjustment Dialog */}
      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock Level</DialogTitle>
            <DialogDescription>
              Adjust the stock level for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Stock: {selectedProduct?.stock}</label>
            </div>
            <div>
              <label className="text-sm font-medium">New Stock Level</label>
              <Input
                type="number"
                min="0"
                value={stockAdjustment}
                onChange={(e) => setStockAdjustment(e.target.value)}
                placeholder="Enter new stock level"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsStockDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleStockUpdate}>
                Update Stock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};