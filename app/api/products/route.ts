import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  const products = await prisma.product.findMany({
    where: {
      ...(category && category !== "Todos" ? { category: { name: category } } : {}),
      ...(search ? { name: { contains: search } } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, description, price, originalPrice, image, stock, badge, rating, reviews, categoryId } = body

  if (!name || !price || !image || !categoryId) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: { name, description, price, originalPrice, image, stock: stock ?? 100, badge, rating: rating ?? 0, reviews: reviews ?? 0, categoryId },
    include: { category: true },
  })

  return NextResponse.json(product, { status: 201 })
}
