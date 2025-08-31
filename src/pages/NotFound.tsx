import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-elegant">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-8xl font-serif font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            The jewelry piece you're looking for seems to have been moved to our vault. 
            Let's help you find something even more beautiful.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild
            variant="elegant"
            size="lg"
            className="shadow-gold hover:shadow-elegant"
          >
            <a href="/">
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Search className="h-4 w-4 mr-2" />
            Browse Collections
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <p>Looking for something specific? Visit our store or call us at:</p>
          <p className="font-semibold text-primary mt-1">+91 98765 43210</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
