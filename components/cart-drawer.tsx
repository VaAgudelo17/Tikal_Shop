"use client";

import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { CheckoutDrawer } from "@/components/checkout-drawer";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { cartItems, updateQuantity, removeItem, subtotal } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const shipping = subtotal > 100000 ? 0 : 15000;
  const total = subtotal + shipping;

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-lg sm:text-xl font-bold">Carrito de Compras</SheetTitle>
          <SheetDescription className="sr-only">Revisa y gestiona los productos en tu carrito</SheetDescription>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-secondary p-6">
              <svg className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium">Tu carrito está vacío</p>
              <p className="text-sm text-muted-foreground">Agrega artículos para comenzar</p>
            </div>
            <SheetClose asChild>
              <Button className="mt-4">Seguir Comprando</Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="flex flex-col gap-4">
                {cartItems.map((item) => (
                  <div key={item.name} className="flex gap-3 sm:gap-4 rounded-xl bg-secondary/50 p-2.5 sm:p-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <h4 className="font-medium leading-tight text-sm sm:text-base line-clamp-2">{item.name}</h4>
                        <p className="text-xs sm:text-sm text-primary font-semibold">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Button variant="outline" size="icon" className="h-6 w-6 sm:h-7 sm:w-7" onClick={() => updateQuantity(item.name, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-5 sm:w-6 text-center text-xs sm:text-sm font-medium">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-6 w-6 sm:h-7 sm:w-7" onClick={() => updateQuantity(item.name, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.name)}>
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-primary font-medium">Gratis</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">Envío gratis en pedidos mayores a $100.000</p>
                )}
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Button className="mt-4 w-full" size="lg" onClick={() => setCheckoutOpen(true)}>Finalizar Compra</Button>
            </div>
          </>
        )}
      </SheetContent>
      <CheckoutDrawer open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </Sheet>
  );
}
