"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const filters = ["Todos", "Acuarios", "Perros", "Gatos", "Hamsters", "Aves"];

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  rating: number;
  reviews: number;
  badge: string | null;
  stock: number;
  category: { name: string };
}

export function FeaturedProducts() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") ?? "";
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeFilter !== "Todos") params.set("category", activeFilter);
    if (searchQuery) params.set("search", searchQuery);
    const url = `/api/products?${params.toString()}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeFilter, searchQuery]);

  return (
    <section className="bg-secondary/30 py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-8 sm:mb-12 text-center">
          {searchQuery ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground md:text-4xl">
                Resultados para &ldquo;{searchQuery}&rdquo;
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
                {products.length} producto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground md:text-4xl">
                Productos Destacados
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
                Artículos seleccionados y amados por dueños de mascotas
              </p>
            </>
          )}
        </div>

        {/* Filter buttons */}
        <div className="mb-6 sm:mb-8 flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "rounded-full text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-9",
                activeFilter === filter && "shadow-md"
              )}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-card shadow-sm animate-pulse">
                <div className="aspect-square bg-secondary rounded-t-xl" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-3 bg-secondary rounded w-3/4" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice ?? undefined}
                image={product.image}
                rating={product.rating}
                reviews={product.reviews}
                badge={product.badge ?? undefined}
                stock={product.stock}
              />
            ))}
          </div>
        )}

        <div className="mt-8 sm:mt-12 text-center">
          <Button variant="outline" size="lg" className="text-sm sm:text-base">
            Ver Todos los Productos
          </Button>
        </div>
      </div>
    </section>
  );
}
