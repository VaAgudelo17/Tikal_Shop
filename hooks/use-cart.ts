"use client"

import { createContext, useContext } from "react"

export interface CartItem {
  name: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Omit<CartItem, "quantity">) => void
  updateQuantity: (name: string, delta: number) => void
  removeItem: (name: string) => void
  clearCart: () => void
  cartCount: number
  subtotal: number
  sessionId: string | null
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
  cartCount: 0,
  subtotal: 0,
  sessionId: null,
})

export function useCart() {
  return useContext(CartContext)
}
