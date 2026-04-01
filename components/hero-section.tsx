"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=600&h=600&fit=crop",
    alt: "Acuario con peces tropicales",
  },
  {
    src: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop",
    alt: "Perro feliz",
  },
  {
    src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop",
    alt: "Gato curioso",
  },
  {
    src: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&h=600&fit=crop",
    alt: "Hamster adorable",
  },
  {
    src: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?w=600&h=600&fit=crop",
    alt: "Ave colorida",
  },
];

export function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3500, stopOnInteraction: false }),
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-secondary">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="flex flex-col gap-4 sm:gap-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 self-center rounded-full bg-primary/10 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary lg:self-start">
              <Leaf className="h-4 w-4" />
              <span>Bienvenidos a Tikal Shop</span>
            </div>

            <h1 className="text-balance text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Todo lo que tus Mascotas{" "}
              <span className="text-primary">Necesitan y Aman</span>
            </h1>

            <p className="text-pretty text-base sm:text-lg text-muted-foreground md:text-xl">
              Descubre acuarios premium, productos para mascotas y accesorios para
              todos tus queridos compañeros. Desde peces exóticos hasta amigos peludos,
              tenemos todo.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button size="lg" className="gap-2 text-sm sm:text-base">
                Comprar Ahora
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-sm sm:text-base">
                Ver Categorías
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 lg:justify-start">
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-foreground">2,500+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Productos</p>
              </div>
              <div className="h-8 sm:h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-foreground">15k+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Clientes Felices</p>
              </div>
              <div className="h-8 sm:h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-foreground">4.9</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Calificación</p>
              </div>
            </div>
          </div>

          {/* Hero Carousel */}
          <div className="relative">
            <div className="relative mx-auto aspect-square max-w-md lg:max-w-lg rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 p-3 sm:p-4 shadow-2xl overflow-hidden">
              <div ref={emblaRef} className="h-full w-full overflow-hidden rounded-2xl">
                <div className="flex h-full">
                  {slides.map((slide) => (
                    <div key={slide.src} className="flex-[0_0_100%] h-full">
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Prev / Next */}
              <button
                onClick={scrollPrev}
                className="absolute left-5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm shadow hover:bg-card transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm shadow hover:bg-card transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Floating cards */}
            <div className="absolute -left-2 sm:-left-4 bottom-6 sm:bottom-8 rounded-xl sm:rounded-2xl bg-card p-3 sm:p-4 shadow-lg md:-left-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-primary/10">
                  <span className="text-xl sm:text-2xl">🚚</span>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium">Envío Gratis</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Pedidos +$100.000</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-2 sm:-right-4 top-6 sm:top-8 rounded-xl sm:rounded-2xl bg-card p-3 sm:p-4 shadow-lg md:-right-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-accent/20">
                  <span className="text-xl sm:text-2xl">⭐</span>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium">500+ Marcas</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Alta calidad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
