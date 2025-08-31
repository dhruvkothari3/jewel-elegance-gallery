import { useState } from 'react';
import { Menu, X, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useJewelry } from '@/contexts/JewelryContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { filters, updateFilter } = useJewelry();

  const menuCategories = {
    'By Type': ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles'],
    'By Material': ['Gold', 'Diamond', 'Platinum', 'Rose Gold', 'White Gold', 'Gemstone'],
    'By Occasion': ['Bridal', 'Festive', 'Daily Wear', 'Office', 'Gift Ideas'],
    'Collections': ['Rivaah', 'GlamDays', 'Modern Minimal', 'Signature Series']
  };

  const handleCategoryClick = (category: string, item: string) => {
    if (category === 'By Type') {
      updateFilter('types', [item]);
    } else if (category === 'By Material') {
      updateFilter('materials', [item]);
    } else if (category === 'By Occasion') {
      updateFilter('occasions', [item]);
    } else if (category === 'Collections') {
      updateFilter('collections', [item]);
    }
    setActiveDropdown(null);
    setIsMenuOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter('search', e.target.value);
  };

  return (
    <nav className="bg-background shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-serif font-bold gradient-gold bg-clip-text text-transparent">
              Elegance
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {Object.entries(menuCategories).map(([category, items]) => (
                <div
                  key={category}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(category)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-smooth">
                    {category}
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className={`absolute left-0 mt-2 w-48 bg-card shadow-elegant rounded-lg py-2 transition-elegant ${
                    activeDropdown === category ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}>
                    {items.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleCategoryClick(category, item)}
                        className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-smooth"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <a href="#collections" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-smooth">
                Collections
              </a>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search jewelry..."
                value={filters.search}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-64 border-border focus:ring-2 focus:ring-primary/20"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              Store Locator
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {Object.entries(menuCategories).map(([category, items]) => (
                <div key={category} className="space-y-1">
                  <button className="block text-left w-full px-3 py-2 text-base font-medium text-foreground border-b border-muted">
                    {category}
                  </button>
                  {items.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleCategoryClick(category, item)}
                      className="block w-full text-left px-6 py-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;