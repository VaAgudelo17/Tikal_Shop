import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Package, ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price)
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" }).format(date)
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending:   { label: "Pendiente",   className: "bg-highlight/20 text-yellow-700" },
  confirmed: { label: "Confirmado",  className: "bg-info/20 text-blue-700" },
  shipped:   { label: "Enviado",     className: "bg-primary/20 text-primary" },
  delivered: { label: "Entregado",   className: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelado",   className: "bg-destructive/20 text-destructive" },
}

export default async function PedidosPage() {
  const session = await auth()
  if (!session) redirect("/login?callbackUrl=/cuenta/pedidos")

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-secondary/20">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Mis Pedidos
            </h1>
            <p className="text-sm text-muted-foreground">Hola, {session.user.name}</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="rounded-full bg-secondary p-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">Aún no tienes pedidos</p>
            <p className="text-sm text-muted-foreground">Cuando realices una compra aparecerá aquí</p>
            <Button asChild className="mt-2">
              <Link href="/">Ver productos</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const status = STATUS_LABELS[order.status] ?? { label: order.status, className: "bg-secondary text-foreground" }
              return (
                <div key={order.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="font-semibold text-sm">Pedido #{order.id}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 text-sm">
                        <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover shrink-0" />
                        <span className="flex-1 text-muted-foreground line-clamp-1">
                          {item.name} <span className="text-foreground">×{item.quantity}</span>
                        </span>
                        <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-3 flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">
                      Envío: <span className={order.shipping === 0 ? "text-primary font-medium" : ""}>
                        {order.shipping === 0 ? "Gratis" : formatPrice(order.shipping)}
                      </span>
                    </div>
                    <div className="font-bold text-base">Total: {formatPrice(order.total)}</div>
                  </div>

                  <div className="border-t border-border pt-3 mt-3 text-xs text-muted-foreground">
                    Envío a: {order.address}, {order.city}
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
