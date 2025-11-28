"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const BANNERS = [
  "https://www.eustone.nl/storage/app/public/banner/2025-09-24-68d443c154267.webp", // Marble Sink
  "https://www.eustone.nl/storage/app/public/banner/2025-09-24-68d4206652fa5.webp", // Tools
  "https://www.eustone.nl/storage/app/public/banner/2025-05-12-682260a9368e9.webp", // Tiles
  "https://www.eustone.nl/storage/app/public/banner/2025-09-24-68d44092927ac.webp"  // Slabs
];

export function HeroCarousel() {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section className="w-full relative group">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {BANNERS.map((url, index) => (
            <CarouselItem key={index} className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full">
              <div className="absolute inset-0 w-full h-full bg-black/10 z-10" /> {/* Slight overlay */}
              <Image
                src={url}
                alt={`Hero Banner ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Carousel>
    </section>
  );
}



