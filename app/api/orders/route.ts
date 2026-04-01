import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  const { sessionId, fullName, email, phone, address, city, notes } = await req.json()

  if (!sessionId || !fullName || !email || !phone || !address || !city) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
  }

  // Obtener items del carrito
  const cartItems = await prisma.cartItem.findMany({
    where: { sessionId },
    include: { product: true },
  })

  if (cartItems.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 })
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 100000 ? 0 : 15000
  const total = subtotal + shipping

  // Crear la orden con sus items
  const order = await prisma.order.create({
    data: {
      sessionId,
      userId: session?.user?.id ?? null,
      fullName,
      email,
      phone,
      address,
      city,
      notes,
      total,
      shipping,
      status: "pending",
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
      },
    },
    include: { items: true },
  })

  // Vaciar el carrito
  await prisma.cartItem.deleteMany({ where: { sessionId } })

  return NextResponse.json(order, { status: 201 })
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session")
  if (!sessionId) return NextResponse.json([])

  const orders = await prisma.order.findMany({
    where: { sessionId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(orders)
}
