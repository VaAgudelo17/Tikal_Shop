"use client"

import { useState } from "react"
import { ArrowLeft, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface OrderItem { id: number; name: string; price: number; quantity: number; image: string }
interface Order {
  id: number
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  total: number
  shipping: number
  status: string
  createdAt: Date
  items: OrderItem[]
}

const STATUSES = [
  { value: "pending",   label: "Pendiente",  className: "bg-yellow-100 text-yellow-700" },
  { value: "confirmed", label: "Confirmado", className: "bg-blue-100 text-blue-700" },
  { value: "shipped",   label: "Enviado",    className: "bg-primary/15 text-primary" },
  { value: "delivered", label: "Entregado",  className: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "Cancelado",  className: "bg-red-100 text-destructive" },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price)
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(date))
}

export function AdminOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [updating, setUpdating] = useState<number | null>(null)

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id)
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o))
    }
    setUpdating(null)
  }

  const getStatus = (value: string) => STATUSES.find((s) => s.value === value) ?? STATUSES[0]

  return (
    <div className="min-h-screen bg-secondary/20">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Gestión de Pedidos
            </h1>
            <p className="text-sm text-muted-foreground">{orders.length} pedidos en total</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
            <Package className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">No hay pedidos aún</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const status = getStatus(order.status)
              return (
                <div key={order.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="font-semibold">Pedido #{order.id} — {order.fullName}</p>
                      <p className="text-sm text-muted-foreground">{order.email} · {order.phone}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(order.createdAt)}</p>
                      <p className="text-xs text-muted-foreground">{order.address}, {order.city}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
                        {status.label}
                      </span>
                      <p className="font-bold text-base">{formatPrice(order.total)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 rounded-lg bg-secondary/50 px-2.5 py-1.5 text-xs">
                        <img src={item.image} alt={item.name} className="h-6 w-6 rounded object-cover" />
                        <span className="text-muted-foreground">{item.name} ×{item.quantity}</span>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground mb-2">Cambiar estado:</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => updateStatus(order.id, s.value)}
                          disabled={order.status === s.value || updating === order.id}
                          className={`text-xs px-3 py-1 rounded-full border transition-all ${
                            order.status === s.value
                              ? `${s.className} border-transparent font-semibold`
                              : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
