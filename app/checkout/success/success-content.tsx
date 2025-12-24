"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Instagram, Package, Sparkles } from "lucide-react"

interface SuccessContentProps {
  orderId?: string
}

export function SuccessContent({ orderId }: SuccessContentProps) {
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => setOrder(data))
        .catch((err) => console.error("[v0] Failed to fetch order:", err))
    }
  }, [orderId])

  return (
    <Card className="max-w-2xl w-full p-8 text-center shadow-2xl border-border/50">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center animate-pulse">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
      </div>

      <h1 className="text-4xl font-black tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        Encomenda Realizada!
      </h1>
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        Obrigado pela tua encomenda. Recebemos o teu pedido e entraremos em contacto em breve via Instagram para
        confirmar os detalhes e organizar o pagamento.
      </p>

      {order && (
        <div className="bg-gradient-to-br from-muted to-muted/50 rounded-lg p-6 mb-8 text-left border border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Detalhes da Encomenda</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID da Encomenda:</span>
              <span className="font-medium">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-bold text-lg">€{order.total?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <span className="font-medium capitalize">{order.status}</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Instagram className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Próximos Passos</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Enviaremos uma mensagem direta no Instagram dentro de 24 horas para confirmar a tua encomenda, discutir os
          custos de envio e organizar o pagamento seguro.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="hover:scale-105 transition-all duration-300 shadow-lg">
          <Link href="/">
            <Sparkles className="w-4 h-4 mr-2" />
            Continuar a Comprar
          </Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          asChild
          className="hover:scale-105 transition-all duration-300 bg-transparent"
        >
          <a href="https://instagram.com/cloudzstore.pt" target="_blank" rel="noopener noreferrer">
            <Instagram className="w-4 h-4 mr-2" />
            Abrir Instagram
          </a>
        </Button>
      </div>
    </Card>
  )
}
