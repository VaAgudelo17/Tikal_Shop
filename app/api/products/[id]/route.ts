import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  })

  if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: body,
    include: { category: true },
  })

  return NextResponse.json(product)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.product.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}
