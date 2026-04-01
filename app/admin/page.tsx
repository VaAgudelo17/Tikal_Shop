import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminProductsClient } from "./admin-products-client"

export default async function AdminPage() {
  const session = await auth()
  if (!session || session.user.role !== "admin") redirect("/")

  const [products, categories] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ])

  return <AdminProductsClient initialProducts={products} categories={categories} />
}
