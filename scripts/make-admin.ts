import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import * as path from "path"

const adapter = new PrismaBetterSqlite3({ url: `file:${path.resolve("prisma/dev.db")}` })
const prisma = new PrismaClient({ adapter })

const email = process.argv[2]

if (!email) {
  console.error("Uso: npx tsx scripts/make-admin.ts tu@correo.com")
  process.exit(1)
}

async function main() {
  const user = await prisma.user.update({
    where: { email },
    data: { role: "admin" },
  })
  console.log(`✅ ${user.name} (${user.email}) ahora es admin`)
}

main()
  .catch((e) => { console.error("❌ Error:", e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
