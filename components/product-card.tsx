"use client";

import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductCard({
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  badge,
}: ProductCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const liked = isFavorite(name);
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-secondary/50">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badge */}
        {badge && (
          <span className="absolute left-2 sm:left-3 top-2 sm:top-3 rounded-full bg-highlight px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-foreground">
            {badge}
          </span>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute right-2 sm:right-3 top-2 sm:top-3 rounded-full bg-destructive px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-white">
            -{discount}%
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={() => toggleFavorite({ name, price, originalPrice, image, rating, reviews, badge })}
          className="absolute right-2 sm:right-3 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-card/80 opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-card group-hover:opacity-100"
          style={{ top: discount > 0 ? "40px" : "8px" }}
        >
          <Heart
            className={cn(
              "h-4 w-4 sm:h-5 sm:w-5 transition-colors",
              liked ? "fill-destructive text-destructive" : "text-foreground"
            )}
          />
        </button>

        {/* Quick add button */}
        <div className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button className="w-full gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9" size="sm">
            <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Agregar</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-4">
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-highlight text-highlight" />
          <span className="text-xs sm:text-sm font-medium">{rating}</span>
          <span className="text-[10px] sm:text-sm text-muted-foreground">({reviews})</span>
        </div>

        <h3 className="mt-1.5 sm:mt-2 line-clamp-2 text-xs sm:text-sm md:text-base font-medium leading-tight text-foreground">
          {name}
        </h3>

        <div className="mt-2 sm:mt-3 flex flex-wrap items-baseline gap-1 sm:gap-2">
          <span className="text-sm sm:text-base md:text-lg font-bold text-primary">
            {formatPrice(price)}
          </span>
          {originalPrice && (
            <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
