"use client";

import { useState } from "react";
import { Search, ShoppingCart, Menu, Heart, User, LogOut, Package, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CartDrawer } from "./cart-drawer";
import { FavoritesDrawer } from "./favorites-drawer";
import { useFavorites } from "@/hooks/use-favorites";
import { useCart } from "@/hooks/use-cart";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  "Peces",
  "Perros",
  "Gatos",
  "Hamsters",
  "Aves",
];

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { favorites } = useFavorites();
  const { cartCount } = useCart();
  const { data: session, status } = useSession();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-14 sm:h-20 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/images/logo-pez.png"
              alt="Tikal Shop Logo"
              width={96}
              height={96}
              className="h-12 w-12 sm:h-16 sm:w-16 object-contain mix-blend-multiply"
            />
            <div className="flex flex-col leading-none">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Tikal Shop</span>
              <span className="text-[10px] sm:text-xs font-medium tracking-widest uppercase text-muted-foreground">Tu tienda de mascotas</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-4 lg:gap-6 lg:flex">
            {categories.map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap"
              >
                {category}
              </a>
            ))}
          </nav>

          {/* Search & Cart */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="relative hidden w-48 lg:w-64 md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                className="pl-9 bg-secondary border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                suppressHydrationWarning
              />
            </form>

            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Favorites */}
            <FavoritesDrawer>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-destructive text-[10px] sm:text-xs font-medium text-white">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </FavoritesDrawer>

            {/* Cart */}
            <CartDrawer>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-primary text-[10px] sm:text-xs font-medium text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </Button>
            </CartDrawer>

            {/* User Account */}
            {status === "loading" ? (
              <div className="h-9 w-9 rounded-full bg-secondary animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium truncate">{session.user.name}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/cuenta/pedidos" className="flex items-center gap-2 cursor-pointer">
                      <Package className="h-4 w-4" />Mis pedidos
                    </Link>
                  </DropdownMenuItem>
                  {session.user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="h-4 w-4" />Panel admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4" />Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link href="/login"><User className="h-5 w-5" /></Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                <SheetDescription className="sr-only">Navega por las categorías de productos</SheetDescription>
                <div className="flex flex-col gap-6 pt-8">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/logo-pez.png"
                      alt="Tikal Shop Logo"
                      width={72}
                      height={72}
                      className="h-16 w-16 object-contain mix-blend-multiply"
                    />
                    <div className="flex flex-col leading-none">
                      <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Tikal Shop</span>
                      <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">Tu tienda de mascotas</span>
                    </div>
                  </div>
                  <nav className="flex flex-col gap-4">
                    {categories.map((category) => (
                      <a
                        key={category}
                        href={`#${category.toLowerCase()}`}
                        className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                      >
                        {category}
                      </a>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-border py-3 md:hidden">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos..."
                  className="pl-9 bg-secondary border-0"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  suppressHydrationWarning
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
