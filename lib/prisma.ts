import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"

// Necesario en entornos Node.js (no Edge)
if (typeof WebSocket === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  neonConfig.webSocketConstructor = require("ws")
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrisma() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter, log: ["error"] })
}

export const prisma = globalForPrisma.prisma ?? createPrisma()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
