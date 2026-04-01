import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminProductsClient } from "./admin-products-client"
import Link from "next/link"
import { Package } from "lucide-react"

export default async function AdminPage() {
  const session = await auth()
  if (!session || session.user.role !== "admin") redirect("/")

  const [products, categories, orderCount] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.order.count(),
  ])

  return (
    <div>
      {/* Nav tabs */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex gap-1 pt-4">
            <span className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary">Productos</span>
            <Link href="/admin/pedidos" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Package className="h-4 w-4" />Pedidos
              {orderCount > 0 && (
                <span className="ml-1 rounded-full bg-primary/15 text-primary text-xs px-1.5 py-0.5">{orderCount}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
      <AdminProductsClient initialProducts={products} categories={categories} />
    </div>
  )
}
