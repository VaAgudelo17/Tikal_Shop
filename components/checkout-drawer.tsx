"use client"

import { useState } from "react"
import { CheckCircle, Loader2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { useCart } from "@/hooks/use-cart"

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price)
}

interface CheckoutDrawerProps {
  open: boolean
  onClose: () => void
}

export function CheckoutDrawer({ open, onClose }: CheckoutDrawerProps) {
  const { cartItems, subtotal, clearCart, sessionId } = useCart()
  const shipping = subtotal > 100000 ? 0 : 15000
  const total = subtotal + shipping

  const [form, setForm] = useState({ fullName: "", email: "", phone: "", address: "", city: "", notes: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionId) return
    setLoading(true)
    setError("")

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sessionId }),
    })

    if (res.ok) {
      clearCart()
      setSuccess(true)
    } else {
      const data = await res.json()
      setError(data.error ?? "Ocurrió un error al procesar el pedido")
    }
    setLoading(false)
  }

  const handleClose = () => {
    setSuccess(false)
    setForm({ fullName: "", email: "", phone: "", address: "", city: "", notes: "" })
    setError("")
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg overflow-y-auto">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Finalizar Compra
          </SheetTitle>
          <SheetDescription className="sr-only">Completa tus datos para realizar el pedido</SheetDescription>
        </SheetHeader>

        {success ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center py-12">
            <div className="rounded-full bg-primary/10 p-6">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold">¡Pedido realizado!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Te contactaremos a <span className="font-medium text-foreground">{form.email}</span> con los detalles.
              </p>
            </div>
            <Button className="mt-4 w-full" onClick={handleClose}>Seguir Comprando</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6 py-4">
            {/* Resumen */}
            <div className="rounded-xl bg-secondary/50 p-4">
              <p className="text-sm font-semibold mb-3">Resumen del pedido</p>
              <div className="flex flex-col gap-2">
                {cartItems.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
                      {item.name} <span className="text-foreground">×{item.quantity}</span>
                    </span>
                    <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border flex flex-col gap-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Envío</span>
                  <span className={shipping === 0 ? "text-primary font-medium" : ""}>
                    {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Datos de contacto */}
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold">Datos de contacto</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 flex flex-col gap-1.5">
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Valentina Agudelo" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="310 000 0000" required />
                </div>
              </div>

              <p className="text-sm font-semibold">Dirección de entrega</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 flex flex-col gap-1.5">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" name="address" value={form.address} onChange={handleChange} placeholder="Calle 33a #16-51" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" name="city" value={form.city} onChange={handleChange} placeholder="Cali" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="notes">Notas (opcional)</Label>
                  <Input id="notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Apto 201, timbre..." />
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" size="lg" className="w-full mt-auto" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Procesando...</> : `Confirmar pedido — ${formatPrice(total)}`}
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
