"use client"

import { Heart, ShoppingCart, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet"
import { useFavorites } from "@/hooks/use-favorites"
import { useCart } from "@/hooks/use-cart"

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function FavoritesDrawer({ children }: { children: React.ReactNode }) {
  const { favorites, toggleFavorite } = useFavorites()
  const { addToCart } = useCart()

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Heart className="h-5 w-5 fill-destructive text-destructive" />
            Mis Favoritos
            {favorites.length > 0 && (
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {favorites.length} {favorites.length === 1 ? "producto" : "productos"}
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">Productos guardados en favoritos</SheetDescription>
        </SheetHeader>

        {favorites.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-secondary p-6">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium">Aún no tenés favoritos</p>
              <p className="text-sm text-muted-foreground">
                Tocá el corazón en cualquier producto para guardarlo acá
              </p>
            </div>
            <SheetClose asChild>
              <Button className="mt-4">Explorar Productos</Button>
            </SheetClose>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4">
            <div className="flex flex-col gap-4">
              {favorites.map((product) => {
                const discount = product.originalPrice
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0

                return (
                  <div key={product.name} className="flex gap-3 rounded-xl bg-secondary/50 p-2.5 sm:p-3">
                    <div className="relative shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      {discount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-medium text-white">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        {product.badge && (
                          <span className="inline-block text-[10px] font-semibold bg-highlight text-foreground px-2 py-0.5 rounded-full mb-1">
                            {product.badge}
                          </span>
                        )}
                        <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-highlight text-highlight" />
                          <span className="text-xs font-medium">{product.rating}</span>
                          <span className="text-xs text-muted-foreground">({product.reviews})</span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-sm font-bold text-primary">{formatPrice(product.price)}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          className="h-8 gap-1.5 text-xs flex-1"
                          onClick={() => addToCart({ name: product.name, price: product.price, image: product.image })}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          Agregar al carrito
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => toggleFavorite(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
