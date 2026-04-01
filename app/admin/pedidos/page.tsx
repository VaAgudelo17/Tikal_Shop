import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminOrdersClient } from "./admin-orders-client"

export default async function AdminOrdersPage() {
  const session = await auth()
  if (!session || session.user.role !== "admin") redirect("/")

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  })

  return <AdminOrdersClient initialOrders={orders} />
}
