import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  if (pathname.startsWith("/cuenta") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login?callbackUrl=/cuenta/pedidos", req.url))
  }

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/admin", req.url))
    }
    if (req.auth?.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/cuenta/:path*", "/admin/:path*"],
}
