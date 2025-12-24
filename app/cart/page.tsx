"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Instagram, Cloud, Zap } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <Cloud className="w-8 h-8 text-primary" />
                <Zap className="w-4 h-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                CLOUDZSTORE
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/" className="text-sm font-semibold hover:text-primary transition-colors duration-300">
                Loja
              </Link>
              <a
                href="https://instagram.com/cloudzstore.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16 flex-1 flex flex-col items-center justify-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">O teu carrinho está vazio</h1>
          <p className="text-muted-foreground mb-8">Adiciona alguns produtos para começar</p>
          <Button asChild className="hover:scale-105 transition-all duration-300">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuar a Comprar
            </Link>
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <Cloud className="w-8 h-8 text-primary" />
              <Zap className="w-4 h-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              CLOUDZSTORE
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm font-semibold hover:text-primary transition-colors duration-300">
              Loja
            </Link>
            <a
              href="https://instagram.com/cloudzstore.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
              <span className="sr-only">Instagram</span>
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Carrinho de Compras</h1>
            <p className="text-muted-foreground mt-1">
              {getItemCount()} {getItemCount() === 1 ? "produto" : "produtos"} no teu carrinho
            </p>
          </div>
          <Button variant="outline" asChild className="hover:scale-105 transition-all duration-300 bg-transparent">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuar a Comprar
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={`${item.id}-${item.size}`} className="p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-muted">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-medium uppercase">{item.brand}</p>
                        <h3 className="font-semibold truncate">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Tamanho: {item.size}</p>
                      </div>
                      <p className="font-bold whitespace-nowrap">€{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent hover:scale-105 transition-all"
                          onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent hover:scale-105 transition-all"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:scale-105 transition-all"
                        onClick={() => removeItem(item.id, item.size)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 shadow-lg border-border/50">
              <h2 className="text-xl font-bold mb-4">Resumo da Encomenda</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">€{getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envio</span>
                  <span className="font-medium">Calculado no checkout</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    €{getTotal().toFixed(2)}
                  </span>
                </div>
              </div>
              <Button className="w-full hover:scale-105 transition-all duration-300 shadow-md" size="lg" asChild>
                <Link href="/checkout">Finalizar Encomenda</Link>
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Entraremos em contacto via Instagram para completar a tua encomenda
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
