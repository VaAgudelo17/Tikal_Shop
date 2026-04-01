import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import Database from "better-sqlite3"



const adapter = new PrismaBetterSqlite3({ url: `file:${process.cwd()}/prisma/dev.db` })
const prisma = new PrismaClient({ adapter })

const categories = ["Acuarios", "Perros", "Gatos", "Hamsters", "Aves"]

const products = [
  {
    name: "Kit de Acuario Premium 50 Galones",
    price: 749999,
    originalPrice: 899999,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 124,
    category: "Acuarios",
    badge: "Más Vendido",
    stock: 15,
  },
  {
    name: "Luz LED para Acuario - Espectro Completo",
    price: 149999,
    image: "https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 89,
    category: "Acuarios",
    stock: 40,
  },
  {
    name: "Sistema de Filtro para Acuario",
    price: 119999,
    originalPrice: 149999,
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 201,
    category: "Acuarios",
    stock: 30,
  },
  {
    name: "Cama Premium para Perro - Espuma Ortopédica",
    price: 239999,
    originalPrice: 299999,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 256,
    category: "Perros",
    badge: "Nuevo",
    stock: 25,
  },
  {
    name: "Comida Orgánica para Perro - Sin Granos",
    price: 164999,
    image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 312,
    category: "Perros",
    stock: 60,
  },
  {
    name: "Correa Retráctil para Perro - Resistente",
    price: 89999,
    image: "https://images.unsplash.com/photo-1567612529009-afe25813a308?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 187,
    category: "Perros",
    stock: 50,
  },
  {
    name: "Torre Rascador para Gatos con Postes",
    price: 269999,
    originalPrice: 359999,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 178,
    category: "Gatos",
    badge: "Popular",
    stock: 20,
  },
  {
    name: "Comida Premium para Gato - Receta de Salmón",
    price: 98999,
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 445,
    category: "Gatos",
    stock: 80,
  },
  {
    name: "Jaula Deluxe para Hamster con Tubos",
    price: 179999,
    image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 67,
    category: "Hamsters",
    stock: 18,
  },
  {
    name: "Rueda Silenciosa para Mascotas Pequeñas",
    price: 74999,
    originalPrice: 104999,
    image: "https://images.unsplash.com/photo-1452721226468-f95fb66ebf83?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 93,
    category: "Hamsters",
    stock: 35,
  },
  {
    name: "Jaula Grande para Aves con Soporte",
    price: 389999,
    image: "https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 54,
    category: "Aves",
    badge: "Top Valorado",
    stock: 10,
  },
  {
    name: "Mezcla Premium de Semillas para Aves",
    price: 56999,
    image: "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 128,
    category: "Aves",
    stock: 70,
  },
]

async function main() {
  console.log("Seeding database...")

  // Crear categorías
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
  console.log(`✓ ${categories.length} categorías creadas`)

  // Crear productos
  for (const product of products) {
    const category = await prisma.category.findUnique({
      where: { name: product.category },
    })
    if (!category) continue

    await prisma.product.upsert({
      where: { id: products.indexOf(product) + 1 },
      update: {},
      create: {
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        image: product.image,
        rating: product.rating,
        reviews: product.reviews,
        badge: product.badge ?? null,
        stock: product.stock,
        categoryId: category.id,
      },
    })
  }
  console.log(`✓ ${products.length} productos creados`)
  console.log("Seed completado ✓")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
