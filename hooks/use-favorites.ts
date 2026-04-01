"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface FavoriteProduct {
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  badge?: string
}

interface FavoritesContextType {
  favorites: FavoriteProduct[]
  toggleFavorite: (product: FavoriteProduct) => void
  isFavorite: (name: string) => boolean
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
})

export function useFavorites() {
  return useContext(FavoritesContext)
}
