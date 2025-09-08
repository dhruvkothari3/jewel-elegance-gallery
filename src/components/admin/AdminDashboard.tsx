import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Gem, Store, BarChart3, AlertTriangle } from 'lucide-react';
import { ProductManagement } from './ProductManagement';
import { CollectionManagement } from './CollectionManagement';
import { StoreManagement } from './StoreManagement';
import { StockManagement } from './StockManagement';
import { BulkUpload } from './BulkUpload';
import { useDashboardStats } from '@/hooks/useDashboardStats';

export const AdminDashboard: React.FC = () => {
  const { stats } = useDashboardStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif gradient-gold bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your jewelry showcase platform
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.loading ? '...' : stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.featuredProducts} featured, {stats.newArrivals} new arrivals
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collections</CardTitle>
              <Gem className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.loading ? '...' : stats.totalCollections}</div>
              <p className="text-xs text-muted-foreground">Active collections</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Store Locations</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.loading ? '...' : stats.totalStores}</div>
              <p className="text-xs text-muted-foreground">Physical locations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.loading ? '...' : stats.lowStockItems + stats.outOfStockItems}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.outOfStockItems} out of stock, {stats.lowStockItems} low stock
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="stores">Stores</TabsTrigger>
            <TabsTrigger value="stock">Stock Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-6">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="bulk-upload" className="space-y-6">
            <BulkUpload />
          </TabsContent>
          
          <TabsContent value="collections" className="space-y-6">
            <CollectionManagement />
          </TabsContent>
          
          <TabsContent value="stores" className="space-y-6">
            <StoreManagement />
          </TabsContent>
          
          <TabsContent value="stock" className="space-y-6">
            <StockManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};