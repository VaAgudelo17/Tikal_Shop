import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session")
  if (!sessionId) return NextResponse.json([])

  const items = await prisma.cartItem.findMany({
    where: { sessionId },
    include: { product: true },
    orderBy: { id: "asc" },
  })

  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const { sessionId, productId, quantity = 1 } = await req.json()
  if (!sessionId || !productId) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 })
  }

  const item = await prisma.cartItem.upsert({
    where: { sessionId_productId: { sessionId, productId } },
    update: { quantity: { increment: quantity } },
    create: { sessionId, productId, quantity },
    include: { product: true },
  })

  return NextResponse.json(item)
}

export async function DELETE(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session")
  if (!sessionId) return NextResponse.json({ error: "Sin sesión" }, { status: 400 })

  await prisma.cartItem.deleteMany({ where: { sessionId } })
  return NextResponse.json({ success: true })
}
