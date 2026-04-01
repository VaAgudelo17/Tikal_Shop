"use client"

import { useState, useEffect, type ReactNode } from "react"
import { FavoritesContext, type FavoriteProduct } from "@/hooks/use-favorites"

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("tikal-favorites")
    if (stored) setFavorites(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem("tikal-favorites", JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (product: FavoriteProduct) => {
    setFavorites((prev) =>
      prev.some((p) => p.name === product.name)
        ? prev.filter((p) => p.name !== product.name)
        : [...prev, product]
    )
  }

  const isFavorite = (name: string) => favorites.some((p) => p.name === name)

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}
