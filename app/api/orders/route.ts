import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { sendOrderConfirmation } from "@/lib/email"

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

  // Verificar stock disponible
  for (const item of cartItems) {
    if (item.product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Stock insuficiente para "${item.product.name}". Disponible: ${item.product.stock}` },
        { status: 400 }
      )
    }
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

  // Decrementar stock de cada producto
  await Promise.all(
    cartItems.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    )
  )

  // Vaciar el carrito
  await prisma.cartItem.deleteMany({ where: { sessionId } })

  // Enviar correo de confirmación (sin bloquear la respuesta)
  sendOrderConfirmation({
    to: email,
    fullName,
    orderId: order.id,
    items: order.items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
    subtotal,
    shipping,
    total,
    address,
    city,
  }).catch((err) => console.error("Error enviando correo:", err))

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
