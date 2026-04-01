"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Loader2, X, Package, ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface Category { id: number; name: string }
interface Product {
  id: number
  name: string
  description: string | null
  price: number
  originalPrice: number | null
  image: string
  stock: number
  badge: string | null
  rating: number
  reviews: number
  categoryId: number
  category: Category
}

const EMPTY_FORM = {
  name: "", description: "", price: "", originalPrice: "", image: "",
  stock: "100", badge: "", rating: "0", reviews: "0", categoryId: "",
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price)
}

export function AdminProductsClient({ initialProducts, categories }: { initialProducts: Product[]; categories: Category[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState("")
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setError("")
    setShowForm(true)
  }

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : "",
      image: p.image,
      stock: String(p.stock),
      badge: p.badge ?? "",
      rating: String(p.rating),
      reviews: String(p.reviews),
      categoryId: String(p.categoryId),
    })
    setEditingId(p.id)
    setError("")
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const body = {
      name: form.name,
      description: form.description || null,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      image: form.image,
      stock: Number(form.stock),
      badge: form.badge || null,
      rating: Number(form.rating),
      reviews: Number(form.reviews),
      categoryId: Number(form.categoryId),
    }

    const url = editingId ? `/api/products/${editingId}` : "/api/products"
    const method = editingId ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Error al guardar")
      setLoading(false)
      return
    }

    const saved: Product = await res.json()
    if (editingId) {
      setProducts((prev) => prev.map((p) => p.id === editingId ? saved : p))
    } else {
      setProducts((prev) => [saved, ...prev])
    }

    setShowForm(false)
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este producto?")) return
    await fetch(`/api/products/${id}`, { method: "DELETE" })
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Panel de Administración
            </h1>
            <p className="text-sm text-muted-foreground">{products.length} productos en total</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />Nuevo producto
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar producto..."
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-xl overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="font-bold text-lg">{editingId ? "Editar producto" : "Nuevo producto"}</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <Label>Nombre *</Label>
                    <Input name="name" value={form.name} onChange={handleChange} required placeholder="Alimento premium para peces" />
                  </div>
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <Label>Descripción</Label>
                    <Input name="description" value={form.description} onChange={handleChange} placeholder="Descripción breve..." />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Precio (COP) *</Label>
                    <Input name="price" type="number" value={form.price} onChange={handleChange} required placeholder="45000" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Precio original (tachado)</Label>
                    <Input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} placeholder="60000" />
                  </div>
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <Label>URL de imagen *</Label>
                    <Input name="image" value={form.image} onChange={handleChange} required placeholder="https://..." />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Stock</Label>
                    <Input name="stock" type="number" value={form.stock} onChange={handleChange} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Badge (ej: Nuevo)</Label>
                    <Input name="badge" value={form.badge} onChange={handleChange} placeholder="Nuevo, Oferta..." />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Rating (0-5)</Label>
                    <Input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Reseñas</Label>
                    <Input name="reviews" type="number" value={form.reviews} onChange={handleChange} />
                  </div>
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <Label>Categoría *</Label>
                    <select
                      name="categoryId"
                      value={form.categoryId}
                      onChange={handleChange}
                      required
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Guardando...</> : (editingId ? "Guardar cambios" : "Crear producto")}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <Package className="h-10 w-10 text-muted-foreground" />
              <p className="font-medium">No hay productos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Producto</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Categoría</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Precio</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground hidden sm:table-cell">Stock</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium line-clamp-1">{p.name}</p>
                            {p.badge && (
                              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{p.badge}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{p.category.name}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatPrice(p.price)}</td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span className={p.stock === 0 ? "text-destructive font-medium" : "text-muted-foreground"}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
