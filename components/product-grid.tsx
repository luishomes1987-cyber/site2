"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useCart } from "@/hooks/use-cart"
import { ShoppingCart, Sparkles, Search } from "lucide-react"
import { useEffect, useState } from "react"

export interface Product {
  id: string
  name: string
  brand: string
  description?: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  category: string
  sizes?: string[]
  flavors?: number
  inStock: boolean
}

interface ProductGridProps {
  selectedCategory?: string
  searchQuery?: string
}

export function ProductGrid({ selectedCategory, searchQuery }: ProductGridProps) {
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products", { cache: "no-store" })
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()

    const handleProductUpdate = () => {
      fetchProducts()
    }

    window.addEventListener("productsUpdated", handleProductUpdate)
    return () => window.removeEventListener("productsUpdated", handleProductUpdate)
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || selectedCategory === "Todos" || product.category === selectedCategory
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch && product.inStock
  })

  const getProductVariants = (product: Product) => {
    if (product.category === "Vapes" && product.flavors) {
      return [`${product.flavors} Sabores`]
    }
    return product.sizes || ["Único"]
  }

  const handleAddToCart = (product: Product, variant: string) => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      size: variant,
      quantity: 1,
    })
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center gap-3 text-muted-foreground animate-pulse">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
        </div>
        <p className="text-muted-foreground text-lg mt-4">A carregar produtos...</p>
      </div>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Search className="w-10 h-10 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-xl font-semibold">Nenhum produto encontrado</p>
        {selectedCategory !== "Todos" && (
          <p className="text-sm text-muted-foreground">Produtos disponíveis em breve nesta categoria</p>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {filteredProducts.map((product, index) => {
        const variants = getProductVariants(product)

        return (
          <Card
            key={product.id}
            className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-border/50 hover:border-primary/30 bg-card animate-fade-in-up hover:-translate-y-2"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-all duration-700"
              />
              {product.discount && product.discount > 0 && (
                <Badge className="absolute top-4 right-4 shadow-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 px-3 py-1 text-sm font-bold">
                  -{product.discount}%
                </Badge>
              )}
              {!product.inStock && (
                <Badge className="absolute top-4 right-4 shadow-xl bg-muted/90 backdrop-blur-sm" variant="secondary">
                  Esgotado
                </Badge>
              )}
              {product.inStock && (
                <div className="absolute top-4 left-4 bg-primary/95 backdrop-blur-sm text-primary-foreground p-2 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-xs text-primary font-bold uppercase tracking-wider">{product.brand}</p>
                <h3 className="font-bold text-lg leading-tight text-balance group-hover:text-primary transition-colors duration-300">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 text-pretty leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    €{product.price.toFixed(2)}
                  </p>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <p className="text-sm text-muted-foreground line-through">€{product.originalPrice.toFixed(2)}</p>
                  )}
                </div>
                <Badge variant="outline" className="text-xs font-semibold border-primary/30 text-primary">
                  {product.category}
                </Badge>
              </div>

              <div className="pt-2 space-y-3">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                  {product.category === "Vapes" ? "Sabores:" : "Disponível:"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <Button
                      key={variant}
                      variant="outline"
                      size="sm"
                      disabled={!product.inStock}
                      onClick={() => handleAddToCart(product, variant)}
                      className="min-w-[60px] hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                      {variant}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
