import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import path from "path"

const adapter = new PrismaBetterSqlite3({ url: `file:${path.resolve("prisma/dev.db")}` })
const prisma = new PrismaClient({ adapter })

async function main() {
  const updated = await prisma.category.update({
    where: { name: "Acuarios" },
    data: { name: "Peces" },
  })
  console.log(`✅ Categoría renombrada: ${updated.name}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
