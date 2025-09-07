import { Grid3X3, LayoutGrid, List, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import { useJewelry } from '@/contexts/JewelryContext';

const FeaturedProducts = () => {
  const { filteredItems, filters, updateFilter, resetFilters, isLoading } = useJewelry();

  const handleSortChange = (value: string) => {
    updateFilter('sortBy', value);
  };

  const handleViewModeChange = (mode: 'grid' | 'large') => {
    updateFilter('viewMode', mode);
  };

  const hasActiveFilters = () => {
    return filters.search || 
           filters.materials.length > 0 || 
           filters.types.length > 0 || 
           filters.occasions.length > 0 || 
           filters.collections.length > 0;
  };

  const getGridClasses = () => {
    switch (filters.viewMode) {
      case 'large':
        return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
      case 'grid':
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div>
            {(() => {
              if (hasActiveFilters()) {
                return (
                  <>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                      Search Results
                    </h2>
                    <p className="text-xl text-muted-foreground">
                      {filteredItems.length} {filteredItems.length === 1 ? 'product' : 'products'} found
                    </p>
                  </>
                );
              } else {
                return (
                  <>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                      Featured Jewelry
                    </h2>
                    <p className="text-xl text-muted-foreground">
                      Handpicked pieces from our finest collections
                    </p>
                  </>
                );
              }
            })()}
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6 lg:mt-0">
            {/* Clear Filters Button - Show when filters are active */}
            {hasActiveFilters() && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            )}
            
            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            
            <FilterSidebar />
            
            <div className="flex border border-border rounded-lg">
              <Button
                variant={filters.viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('grid')}
                className="rounded-r-none"
                title="Compact Grid View"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={filters.viewMode === 'large' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('large')}
                className="rounded-l-none"
                title="Large Card View"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'product' : 'products'}
            {filters.search && ` for "${filters.search}"`}
            {(filters.materials.length > 0 || filters.types.length > 0 || filters.occasions.length > 0 || filters.collections.length > 0) && (
              <span className="ml-2">
                with {filters.materials.length + filters.types.length + filters.occasions.length + filters.collections.length} active filters
              </span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading products...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No products found matching your criteria</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline"
                onClick={() => updateFilter('search', '')}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Clear Search
              </Button>
              <Button 
                variant="outline"
                onClick={() => updateFilter('materials', [])}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className={`grid gap-6 ${getGridClasses()}`}>
            {filteredItems.map((product) => (
              <ProductCard 
                key={product.id} 
                {...product} 
                viewMode={filters.viewMode}
              />
            ))}
          </div>
        )}

        {/* Load More / Clear Filters */}
        <div className="text-center mt-12">
          {hasActiveFilters() ? (
            <Button 
              variant="outline" 
              size="lg"
              onClick={resetFilters}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-elegant px-12"
            >
              <X className="h-5 w-5 mr-2" />
              Clear All Filters
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-elegant px-12"
            >
              View All Products
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;