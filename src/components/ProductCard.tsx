import { Heart, Eye, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  id: number;
  name: string;
  collection: string;
  image: string;
  material: string;
  occasion: string;
  priceRange: string;
  isNew?: boolean;
  isFavorite?: boolean;
}

const ProductCard = ({
  name,
  collection,
  image,
  material,
  occasion,
  priceRange,
  isNew,
  isFavorite
}: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden shadow-soft hover:shadow-elegant transition-elegant jewelry-hover bg-card border-border">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-elegant group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-elegant flex items-center justify-center">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full shadow-elegant"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full shadow-elegant"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          {isNew && (
            <span className="bg-primary text-primary-foreground px-2 py-1 text-xs font-medium rounded-full shadow-soft">
              New
            </span>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-serif font-semibold text-lg text-foreground line-clamp-1">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground">{collection}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{material}</span>
            <span className="text-muted-foreground">{occasion}</span>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-semibold text-primary">{priceRange}</span>
            <Button 
              size="sm" 
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
            >
              <MapPin className="h-3 w-3 mr-1" />
              Enquire
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;