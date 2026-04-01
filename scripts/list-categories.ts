import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import path from "path"

const adapter = new PrismaBetterSqlite3({ url: `file:${path.resolve("prisma/dev.db")}` })
const prisma = new PrismaClient({ adapter })

async function main() {
  const cats = await prisma.category.findMany({
    include: { _count: { select: { products: true } } }
  })
  console.log(JSON.stringify(cats, null, 2))
}

main().finally(() => prisma.$disconnect())
