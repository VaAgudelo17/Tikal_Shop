"use client"

import { useState, useEffect, useCallback, type ReactNode } from "react"
import { CartContext, type CartItem } from "@/hooks/use-cart"

function getSessionId(): string {
  let id = localStorage.getItem("tikal_session_id")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("tikal_session_id", id)
  }
  return id
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)

  // Inicializar sesión y cargar carrito desde la BD
  useEffect(() => {
    const id = getSessionId()
    setSessionId(id)
    fetch(`/api/cart?session=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setCartItems(
          data.map((item: { product: { name: string; price: number; image: string }; quantity: number }) => ({
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            quantity: item.quantity,
          }))
        )
      })
      .catch(() => {})
  }, [])

  const addToCart = useCallback(async (product: Omit<CartItem, "quantity">) => {
    if (!sessionId) return

    // Buscar el id del producto en BD
    const res = await fetch(`/api/products?search=${encodeURIComponent(product.name)}`)
    const products = await res.json()
    const found = products[0]
    if (!found) return

    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, productId: found.id, quantity: 1 }),
    })

    setCartItems((prev) => {
      const existing = prev.find((i) => i.name === product.name)
      if (existing) return prev.map((i) => i.name === product.name ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...product, quantity: 1 }]
    })
  }, [sessionId])

  const updateQuantity = useCallback(async (name: string, delta: number) => {
    if (!sessionId) return

    const item = cartItems.find((i) => i.name === name)
    if (!item) return
    const newQty = item.quantity + delta

    const res = await fetch(`/api/products?search=${encodeURIComponent(name)}`)
    const products = await res.json()
    const found = products[0]
    if (!found) return

    await fetch(`/api/cart/${found.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, quantity: newQty }),
    })

    setCartItems((prev) =>
      prev
        .map((i) => i.name === name ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
        .filter((i) => i.quantity > 0)
    )
  }, [sessionId, cartItems])

  const removeItem = useCallback(async (name: string) => {
    if (!sessionId) return

    const res = await fetch(`/api/products?search=${encodeURIComponent(name)}`)
    const products = await res.json()
    const found = products[0]
    if (found) {
      await fetch(`/api/cart/${found.id}?session=${sessionId}`, { method: "DELETE" })
    }

    setCartItems((prev) => prev.filter((i) => i.name !== name))
  }, [sessionId])

  const clearCart = useCallback(async () => {
    if (!sessionId) return
    await fetch(`/api/cart?session=${sessionId}`, { method: "DELETE" })
    setCartItems([])
  }, [sessionId])

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, clearCart, cartCount, subtotal, sessionId }}>
      {children}
    </CartContext.Provider>
  )
}
