import { useState, useRef, useEffect } from 'react';
import { Menu, X, Search, MapPin, X as XIcon, User, LogOut, Settings, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useJewelry } from '@/contexts/JewelryContext';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { useWishlist } from '@/hooks/useWishlist';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authDialogTab, setAuthDialogTab] = useState<'login' | 'signup'>('login');
  const searchRef = useRef<HTMLDivElement>(null);
  const { filters, updateFilter, resetFilters, items } = useJewelry();
  const { user, isAdmin, logout, loading } = useAuth();
  const { wishlistCount } = useWishlist();

  const menuCategories = {
    'By Type': ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles'],
    'By Material': ['Gold', 'Diamond', 'Platinum', 'Rose Gold', 'White Gold', 'Gemstone'],
    'By Occasion': ['Bridal', 'Festive', 'Daily Wear', 'Office', 'Gift Ideas'],
    'Collections': ['Rivaah', 'GlamDays', 'Modern Minimal', 'Signature Series']
  };

  // Generate search suggestions based on current input
  useEffect(() => {
    if (filters.search.trim()) {
      const suggestions = [];
      const searchLower = filters.search.toLowerCase().trim();
      
      // Add material suggestions
      const materials = [...new Set(items.map(item => item.material))];
      suggestions.push(...materials.filter(material => 
        material.toLowerCase().includes(searchLower)
      ));
      
      // Add type suggestions
      const types = [...new Set(items.map(item => item.type))];
      suggestions.push(...types.filter(type => 
        type.toLowerCase().includes(searchLower)
      ));
      
      // Add occasion suggestions
      const occasions = [...new Set(items.map(item => item.occasion))];
      suggestions.push(...occasions.filter(occasion => 
        occasion.toLowerCase().includes(searchLower)
      ));
      
      // Add collection suggestions
      const collections = [...new Set(items.map(item => item.collection))];
      suggestions.push(...collections.filter(collection => 
        collection.toLowerCase().includes(searchLower)
      ));
      
      // Remove duplicates and limit to 5 suggestions
      const uniqueSuggestions = [...new Set(suggestions)].slice(0, 5);
      setSearchSuggestions(uniqueSuggestions);
      setShowSearchSuggestions(true);
    } else {
      setShowSearchSuggestions(false);
      setSearchSuggestions([]);
    }
  }, [filters.search, items]);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleSuggestionClick = (suggestion: string) => {
    updateFilter('search', suggestion);
    setShowSearchSuggestions(false);
  };

  const clearFilter = (key: keyof typeof filters, value: string) => {
    const currentValues = filters[key] as string[];
    updateFilter(key, currentValues.filter(item => item !== value));
  };

  const clearSearch = () => {
    updateFilter('search', '');
    setShowSearchSuggestions(false);
  };

  const hasActiveFilters = () => {
    return filters.search || 
           filters.materials.length > 0 || 
           filters.types.length > 0 || 
           filters.occasions.length > 0 || 
           filters.collections.length > 0;
  };

  const scrollToStoreLocator = () => {
    const element = document.getElementById('store-locator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = () => {
    setAuthDialogTab('login');
    setShowAuthDialog(true);
  };

  const handleSignup = () => {
    setAuthDialogTab('signup');
    setShowAuthDialog(true);
  };

  const handleLogout = async () => {
    await logout();
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
              <Link to="/collections" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-smooth">
                Collections
              </Link>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" ref={searchRef}>
              <Input
                type="search"
                placeholder="Search jewelry..."
                value={filters.search}
                onChange={handleSearchChange}
                onFocus={() => filters.search.trim() && setShowSearchSuggestions(true)}
                className="pl-10 pr-4 py-2 w-64 border-border focus:ring-2 focus:ring-primary/20"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {filters.search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
              
              {/* Search Suggestions */}
              {showSearchSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-elegant z-50">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-smooth first:rounded-t-lg last:rounded-b-lg"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
              <Link to="/wishlist">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground relative"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                  {wishlistCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                      {wishlistCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={scrollToStoreLocator}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Store Locator
              </Button>

            {/* Authentication Section */}
            {loading ? (
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-primary/20">
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {isAdmin ? 'Administrator' : 'Customer'}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Link to="/login">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-primary/20 hover:bg-primary/10"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    size="sm"
                    className="gradient-gold text-primary-foreground hover:opacity-90"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Search and Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="relative" ref={searchRef}>
              <Input
                type="search"
                placeholder="Search..."
                value={filters.search}
                onChange={handleSearchChange}
                onFocus={() => filters.search.trim() && setShowSearchSuggestions(true)}
                className="pl-8 pr-4 py-2 w-32 border-border focus:ring-2 focus:ring-primary/20"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {filters.search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              )}
              
              {/* Mobile Search Suggestions */}
              {showSearchSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-elegant z-50">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-smooth first:rounded-t-lg last:rounded-b-lg"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters() && (
          <div className="border-t border-border py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {filters.search && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{filters.search}"
                    <button onClick={clearSearch} className="ml-1 hover:text-destructive">
                      <XIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.materials.map(material => (
                  <Badge key={`material-${material}`} variant="secondary" className="gap-1">
                    {material}
                    <button onClick={() => clearFilter('materials', material)} className="ml-1 hover:text-destructive">
                      <XIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {filters.types.map(type => (
                  <Badge key={`type-${type}`} variant="secondary" className="gap-1">
                    {type}
                    <button onClick={() => clearFilter('types', type)} className="ml-1 hover:text-destructive">
                      <XIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {filters.occasions.map(occasion => (
                  <Badge key={`occasion-${occasion}`} variant="secondary" className="gap-1">
                    {occasion}
                    <button onClick={() => clearFilter('occasions', occasion)} className="ml-1 hover:text-destructive">
                      <XIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {filters.collections.map(collection => (
                  <Badge key={`collection-${collection}`} variant="secondary" className="gap-1">
                    {collection}
                    <button onClick={() => clearFilter('collections', collection)} className="ml-1 hover:text-destructive">
                      <XIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Quick Links */}
              <div className="space-y-1 mb-4">
                <Link to="/collections" className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary">
                  Collections
                </Link>
                <Link to="/stores" className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary">
                  Stores
                </Link>
                <Link to="/about" className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary">
                  About
                </Link>
                <Link to="/contact" className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary">
                  Contact
                </Link>
                <Link to="/wishlist" className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary">
                  <Heart className="inline h-4 w-4 mr-2" />
                  Wishlist ({wishlistCount})
                </Link>
                <button 
                  onClick={scrollToStoreLocator}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover:text-primary"
                >
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Store Locator
                </button>
              </div>
              
              {/* Category Filters */}
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
      
      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        defaultTab={authDialogTab}
      />
    </nav>
  );
};

export default Navigation;