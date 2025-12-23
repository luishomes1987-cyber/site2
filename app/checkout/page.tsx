"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Instagram, Cloud, Zap } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCart()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    instagram: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  })

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <Cloud className="w-8 h-8 text-primary" />
                <Zap className="w-4 h-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                CLOUDZSTORE
              </span>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-16 flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Nenhum produto no carrinho</h1>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Loja
            </Link>
          </Button>
        </main>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderData = {
        customer: formData,
        items: items,
        total: getTotal(),
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) throw new Error("Failed to create order")

      const order = await response.json()

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("orderCreated", { detail: order }))
      }

      clearCart()
      router.push(`/checkout/success?orderId=${order.id}`)
    } catch (error) {
      console.error("[v0] Order submission error:", error)
      toast({
        title: "Erro",
        description: "Falha ao submeter encomenda. Por favor tenta novamente.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <Cloud className="w-8 h-8 text-primary" />
              <Zap className="w-4 h-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              CLOUDZSTORE
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/cart">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Carrinho
              </Link>
            </Button>
            <h1 className="text-4xl font-black tracking-tight">Checkout</h1>
            <p className="text-muted-foreground mt-1 text-lg">Completa as informações da tua encomenda</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="p-6 shadow-lg border-border/50">
                  <h2 className="text-xl font-bold mb-4">Informação de Contacto</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">
                        Nome Completo <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="João Silva"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="joao@example.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">
                          Telefone <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+351 912 345 678"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="instagram">
                        Instagram <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Instagram className="w-4 h-4 text-muted-foreground" />
                        <Input
                          id="instagram"
                          required
                          value={formData.instagram}
                          onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                          placeholder="@otetag"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Entraremos em contacto aqui para completar a tua encomenda
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-lg border-border/50">
                  <h2 className="text-xl font-bold mb-4">Morada de Envio</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">
                        Morada <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Rua Example, 123"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">
                          Cidade <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="city"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Lisboa"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">
                          Código Postal <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="postalCode"
                          required
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          placeholder="1000-001"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notas da Encomenda (Opcional)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Instruções especiais ou pedidos..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </Card>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto hover:scale-105 transition-all duration-300 shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "A processar..." : "Finalizar Encomenda"}
                </Button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8 shadow-lg border-border/50">
                <h2 className="text-xl font-bold mb-4">Resumo da Encomenda</h2>
                <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-muted">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Tamanho: {item.size} × {item.quantity}
                        </p>
                        <p className="text-sm font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">€{getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envio</span>
                    <span className="font-medium">A calcular</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      €{getTotal().toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground pt-2">
                    O custo de envio será calculado e confirmado via Instagram DM
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
