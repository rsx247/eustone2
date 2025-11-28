"use client";

import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface SlideData {
  url: string;
  title: string;
  subtitle?: string;
  link: string;
  ctaText: string;
}

const SLIDES: SlideData[] = [
  {
    url: "https://www.eustone.nl/storage/app/public/banner/2025-09-24-68d443c154267.webp",
    title: "Marble Sinks",
    subtitle: "Premium Quality",
    link: "/products?category=sinks",
    ctaText: "Shop Sinks"
  },
  {
    url: "https://www.eustone.nl/storage/app/public/banner/2025-09-24-68d4206652fa5.webp",
    title: "Professional Tools",
    subtitle: "For Every Project",
    link: "/products?category=tools",
    ctaText: "View Tools"
  },
  {
    url: "https://www.eustone.nl/storage/app/public/banner/2025-05-12-682260a9368e9.webp",
    title: "Premium Tiles",
    subtitle: "Transform Your Space",
    link: "/products?category=tiles",
    ctaText: "Explore Tiles"
  },
  {
    url: "https://www.eustone.nl/storage/app/public/banner/2025-09-24-68d44092927ac.webp",
    title: "Natural Stone Slabs",
    subtitle: "Luxury & Elegance",
    link: "/products?category=slabs",
    ctaText: "Browse Slabs"
  }
];

export function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const autoplayPlugin = useRef(
    Autoplay({ 
      delay: 4000, 
      stopOnInteraction: false,
      stopOnMouseEnter: true, // Pause on hover
      stopOnFocusIn: false
    })
  );

  // Track current slide index
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
      setProgress(0); // Reset progress on slide change
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Track progress timer
  useEffect(() => {
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    if (isPaused) {
      return;
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        // Update every 50ms for 4000ms total = 80 steps
        return prev + (100 / 80);
      });
    }, 50);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPaused, currentIndex]);

  // Reset progress when slide changes
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  const goToSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <>
    <section 
      className="w-full relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Carousel
        setApi={setApi}
        plugins={[autoplayPlugin.current]}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
          duration: 35,
        }}
      >
        <CarouselContent>
          {SLIDES.map((slide, index) => (
            <CarouselItem key={index} className="relative h-[250px] md:h-[300px] lg:h-[350px] w-full">
              <div className="block w-full h-full relative group/slide">
                {/* Image */}
                <Image
                  src={slide.url}
                  alt={slide.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/slide:scale-105"
                  priority={index === 0}
                />
                
                {/* Overlay gradient - only on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20 z-10 opacity-0 group-hover/slide:opacity-100 transition-opacity duration-500" />
                
                {/* Content - only on hover */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-6 md:p-8 opacity-0 group-hover/slide:opacity-100 transition-all duration-500 transform translate-y-4 group-hover/slide:translate-y-0">
                  <div className="text-center space-y-3 md:space-y-4 max-w-2xl">
                    {slide.subtitle && (
                      <p className="text-sm md:text-base font-medium text-white/90 uppercase tracking-wider transform translate-y-2 opacity-0 group-hover/slide:translate-y-0 group-hover/slide:opacity-100 transition-all duration-500 delay-100">
                        {slide.subtitle}
                      </p>
                    )}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg transform translate-y-2 opacity-0 group-hover/slide:translate-y-0 group-hover/slide:opacity-100 transition-all duration-500 delay-150">
                      {slide.title}
                    </h2>
                    
                    {/* CTA Button */}
                    <div className="pt-2 md:pt-4 transform translate-y-2 opacity-0 group-hover/slide:translate-y-0 group-hover/slide:opacity-100 transition-all duration-500 delay-200">
                      <Link href={slide.link}>
                        <Button
                          size="lg"
                          className="bg-white text-stone-900 hover:bg-stone-100 shadow-lg hover:shadow-xl transition-all group/button"
                        >
                          {slide.ctaText}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity z-30" />
        <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity z-30" />
      </Carousel>

      {/* Navigation Dots - visible on hover */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75 w-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>

    {/* Progress Timer - outside carousel, below image */}
    <div className="w-full h-1 bg-stone-200 mt-0">
      <div 
        className="h-full bg-stone-400 transition-all duration-50 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
    </>
  );
}



