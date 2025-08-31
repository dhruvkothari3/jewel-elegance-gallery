import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useJewelry } from '@/contexts/JewelryContext';
import { useState } from 'react';

const FilterSidebar = () => {
  const { filters, updateFilter, resetFilters } = useJewelry();
  const [isOpen, setIsOpen] = useState(false);

  const filterOptions = {
    materials: ['Gold', 'Diamond', 'Platinum', 'Rose Gold', 'White Gold', 'Gemstone'],
    types: ['Rings', 'Earrings', 'Necklaces', 'Bracelets', 'Bangles'],
    occasions: ['Bridal', 'Daily Wear', 'Festive', 'Office', 'Gift Ideas'],
    collections: ['Rivaah', 'GlamDays', 'Modern Minimal', 'Signature Series']
  };

  const handleCheckboxChange = (category: keyof typeof filterOptions, value: string, checked: boolean) => {
    const currentValues = filters[category] as string[];
    if (checked) {
      updateFilter(category, [...currentValues, value]);
    } else {
      updateFilter(category, currentValues.filter(item => item !== value));
    }
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 1000).toFixed(0)}k`;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Price Range</Label>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
            max={200000}
            min={10000}
            step={5000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Materials */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Material</Label>
        <div className="grid grid-cols-1 gap-2">
          {filterOptions.materials.map((material) => (
            <div key={material} className="flex items-center space-x-2">
              <Checkbox
                id={`material-${material}`}
                checked={filters.materials.includes(material)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('materials', material, checked as boolean)
                }
              />
              <Label 
                htmlFor={`material-${material}`} 
                className="text-sm cursor-pointer"
              >
                {material}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Types */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Type</Label>
        <div className="grid grid-cols-1 gap-2">
          {filterOptions.types.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={filters.types.includes(type)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('types', type, checked as boolean)
                }
              />
              <Label 
                htmlFor={`type-${type}`} 
                className="text-sm cursor-pointer"
              >
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Occasions */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Occasion</Label>
        <div className="grid grid-cols-1 gap-2">
          {filterOptions.occasions.map((occasion) => (
            <div key={occasion} className="flex items-center space-x-2">
              <Checkbox
                id={`occasion-${occasion}`}
                checked={filters.occasions.includes(occasion)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('occasions', occasion, checked as boolean)
                }
              />
              <Label 
                htmlFor={`occasion-${occasion}`} 
                className="text-sm cursor-pointer"
              >
                {occasion}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Collections */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Collection</Label>
        <div className="grid grid-cols-1 gap-2">
          {filterOptions.collections.map((collection) => (
            <div key={collection} className="flex items-center space-x-2">
              <Checkbox
                id={`collection-${collection}`}
                checked={filters.collections.includes(collection)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('collections', collection, checked as boolean)
                }
              />
              <Label 
                htmlFor={`collection-${collection}`} 
                className="text-sm cursor-pointer"
              >
                {collection}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Filters */}
      <Button 
        variant="outline" 
        onClick={resetFilters}
        className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
      >
        Reset All Filters
      </Button>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FilterContent />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSidebar;