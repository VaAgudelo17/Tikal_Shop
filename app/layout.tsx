import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { FavoritesProvider } from '@/components/favorites-provider'
import { CartProvider } from '@/components/cart-provider'
import { SessionProvider } from '@/components/session-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Tikal Shop - Tienda de Mascotas y Acuarios',
  description: 'Tu destino confiable para productos premium de mascotas y equipos de acuarios. Perros, gatos, aves, hamsters y más.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SessionProvider>
          <CartProvider>
            <FavoritesProvider>
              {children}
            </FavoritesProvider>
          </CartProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
