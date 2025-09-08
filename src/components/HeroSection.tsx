import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-jewelry.jpg';
import bridalCollection from '@/assets/collection-bridal.jpg';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: heroImage,
      title: "Discover Timeless Elegance",
      subtitle: "Exquisite jewelry crafted with passion and precision",
      cta: "Explore Collections",
      overlay: "gradient-elegant"
    },
    {
      id: 2,
      image: bridalCollection,
      title: "Bridal Collection 2024",
      subtitle: "Make your special day unforgettable with our exclusive designs",
      cta: "View Bridal",
      overlay: "gradient-rose"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r from-background/60 to-transparent`} />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 animate-fade-in">
          {slides[currentSlide].title}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
          {slides[currentSlide].subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Button 
            size="lg" 
            className="gradient-gold text-primary-foreground border-0 shadow-gold hover:shadow-elegant transition-elegant px-8 py-3 text-lg"
            onClick={() => window.location.href = '/collections'}
          >
            {slides[currentSlide].cta}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-elegant px-8 py-3 text-lg"
            onClick={() => window.location.href = '/stores'}
          >
            Visit Our Store
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 transition-elegant"
      >
        <ChevronLeft className="h-6 w-6 text-foreground" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 transition-elegant"
      >
        <ChevronRight className="h-6 w-6 text-foreground" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-elegant ${
              index === currentSlide
                ? 'bg-primary shadow-gold'
                : 'bg-background/50 hover:bg-primary/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;