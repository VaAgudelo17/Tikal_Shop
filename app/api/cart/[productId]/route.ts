import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params
  const { sessionId, quantity } = await req.json()

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({
      where: { sessionId, productId: Number(productId) },
    })
    return NextResponse.json({ deleted: true })
  }

  const item = await prisma.cartItem.update({
    where: { sessionId_productId: { sessionId, productId: Number(productId) } },
    data: { quantity },
    include: { product: true },
  })

  return NextResponse.json(item)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params
  const sessionId = req.nextUrl.searchParams.get("session")
  if (!sessionId) return NextResponse.json({ error: "Sin sesión" }, { status: 400 })

  await prisma.cartItem.delete({
    where: { sessionId_productId: { sessionId, productId: Number(productId) } },
  })

  return NextResponse.json({ success: true })
}
