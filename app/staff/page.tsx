"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Lock,
  Cloud,
  Zap,
  TrendingUp,
  ShoppingBag,
} from "lucide-react"
import type { Order } from "@/lib/server-storage"

const STAFF_PASSWORD = "cloudz2024"

export default function StaffDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const auth = sessionStorage.getItem("staff_authenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
    } else {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchOrders()
  }, [statusFilter, searchQuery])

  useEffect(() => {
    filterOrders()
  }, [orders, statusFilter, searchQuery])

  useEffect(() => {
    const handleNewOrder = () => {
      console.log("[v0] New order event detected, refreshing orders...")
      fetchOrders()
    }

    window.addEventListener("orderCreated", handleNewOrder)

    return () => {
      window.removeEventListener("orderCreated", handleNewOrder)
    }
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/orders", { cache: "no-store" })
      if (!response.ok) throw new Error("Failed to fetch orders")
      const data = await response.json()
      setOrders(data)
      filterOrders()
    } catch (error) {
      console.error("[v0] Error fetching orders:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar encomendas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === STAFF_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("staff_authenticated", "true")
      setIsLoading(true)
      fetchOrders()
      toast({
        title: "Autenticado",
        description: "Acesso concedido ao painel de staff",
      })
    } else {
      toast({
        title: "Erro",
        description: "Palavra-passe incorreta",
        variant: "destructive",
      })
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.email.toLowerCase().includes(query) ||
          order.customer.instagram.toLowerCase().includes(query),
      )
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update order")

      const updatedOrder = await response.json()
      setOrders((prev) => prev.map((order) => (order.id === orderId ? updatedOrder : order)))
      setFilteredOrders((prev) => prev.map((order) => (order.id === orderId ? updatedOrder : order)))

      toast({
        title: "Sucesso",
        description: `Estado da encomenda atualizado para ${newStatus}`,
      })
    } catch (error) {
      console.error("[v0] Error updating order:", error)
      toast({
        title: "Erro",
        description: "Falha ao atualizar estado da encomenda",
        variant: "destructive",
      })
    }
  }

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order)
    setIsOrderDialogOpen(true)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/20 to-background">
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl">
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
          </div>
        </header>

        <main className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md p-8 shadow-2xl border-border/50">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Painel de Staff</h1>
              <p className="text-sm text-muted-foreground text-center">Introduz a palavra-passe para aceder</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Palavra-passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1"
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Entrar
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Voltar à loja
              </Link>
            </div>
          </Card>
        </main>
      </div>
    )
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "confirmed":
        return <Package className="w-4 h-4" />
      case "shipped":
        return <Package className="w-4 h-4" />
      case "delivered":
        return <CheckCircle2 className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "confirmed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "shipped":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20"
      case "delivered":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <Cloud className="w-8 h-8 text-primary" />
              <Zap className="w-4 h-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              CLOUDZSTORE
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1 font-semibold">
              Painel de Staff
            </Badge>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Voltar à Loja</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight mb-2">Gestão de Entregas</h1>
          <p className="text-muted-foreground text-lg">Gere as encomendas e estados de entrega</p>
          <p className="text-sm text-muted-foreground mt-2">
            💡 Para gerir produtos (preços, descontos, stock), edita o ficheiro{" "}
            <code className="bg-muted px-2 py-1 rounded">lib/products-data.ts</code>
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Encomendas</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-muted-foreground" />
              </div>
            </Card>
            <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Pendentes</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </Card>
            <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Confirmadas</p>
                  <p className="text-2xl font-bold">{stats.confirmed}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
            <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Enviadas</p>
                  <p className="text-2xl font-bold">{stats.shipped}</p>
                </div>
                <Package className="w-8 h-8 text-purple-600" />
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader className="border-b border-border/40">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Encomendas
                </CardTitle>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar por ID, nome, email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Estados</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="confirmed">Confirmada</SelectItem>
                      <SelectItem value="shipped">Enviada</SelectItem>
                      <SelectItem value="delivered">Entregue</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center gap-3 text-muted-foreground animate-pulse">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                  <p className="text-muted-foreground text-lg mt-4">A carregar encomendas...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold">Nenhuma encomenda encontrada</p>
                  <p className="text-sm mt-2">
                    {searchQuery || statusFilter !== "all"
                      ? "Tenta ajustar os filtros de pesquisa"
                      : "As encomendas aparecerão aqui quando os clientes fizerem pedidos"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-6 hover:bg-muted/30 transition-colors duration-200 cursor-pointer"
                      onClick={() => handleOrderSelect(order)}
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <p className="font-mono text-sm font-bold text-primary">{order.id}</p>
                            <Badge
                              className={`${getStatusColor(order.status)} flex items-center gap-1.5 font-semibold`}
                            >
                              {getStatusIcon(order.status)}
                              {order.status === "pending" && "Pendente"}
                              {order.status === "confirmed" && "Confirmada"}
                              {order.status === "shipped" && "Enviada"}
                              {order.status === "delivered" && "Entregue"}
                              {order.status === "cancelled" && "Cancelada"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleString("pt-PT")}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span className="font-medium">{order.customer.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Instagram className="w-4 h-4" />
                              <span>@{order.customer.instagram}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="w-4 h-4" />
                              <span>{order.customer.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {order.customer.city}, {order.customer.postalCode}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-muted-foreground">
                              {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                            </span>
                            <span className="text-xl font-bold text-primary">€{order.total.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full md:w-auto">
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
                          >
                            <SelectTrigger className="w-full md:w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="confirmed">Confirmada</SelectItem>
                              <SelectItem value="shipped">Enviada</SelectItem>
                              <SelectItem value="delivered">Entregue</SelectItem>
                              <SelectItem value="cancelled">Cancelada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Package className="w-6 h-6 text-primary" />
                Detalhes da Encomenda
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">ID da Encomenda</p>
                    <p className="font-mono font-bold text-primary">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Estado</p>
                    <Badge className={`${getStatusColor(selectedOrder.status)} flex items-center gap-1.5 w-fit`}>
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status === "pending" && "Pendente"}
                      {selectedOrder.status === "confirmed" && "Confirmada"}
                      {selectedOrder.status === "shipped" && "Enviada"}
                      {selectedOrder.status === "delivered" && "Entregue"}
                      {selectedOrder.status === "cancelled" && "Cancelada"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Data</p>
                    <p>{new Date(selectedOrder.createdAt).toLocaleString("pt-PT")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Total</p>
                    <p className="text-2xl font-bold text-primary">€{selectedOrder.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Informações do Cliente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground font-medium mb-1">Nome</p>
                      <p className="font-semibold">{selectedOrder.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium mb-1">Email</p>
                      <p>{selectedOrder.customer.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium mb-1">Telefone</p>
                      <p>{selectedOrder.customer.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium mb-1">Instagram</p>
                      <p>@{selectedOrder.customer.instagram}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-muted-foreground font-medium mb-1">Morada</p>
                      <p>{selectedOrder.customer.address}</p>
                      <p>
                        {selectedOrder.customer.postalCode} {selectedOrder.customer.city}
                      </p>
                    </div>
                    {selectedOrder.customer.notes && (
                      <div className="md:col-span-2">
                        <p className="text-muted-foreground font-medium mb-1">Notas</p>
                        <p className="text-sm bg-muted p-3 rounded">{selectedOrder.customer.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Produtos
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={`${item.id}-${item.size}`}
                        className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                      >
                        <div className="relative w-16 h-16 rounded bg-background overflow-hidden flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.brand}</p>
                          <p className="text-xs text-muted-foreground">Tamanho: {item.size}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                          <p className="font-bold">€{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedOrder.shippingCost && selectedOrder.shippingCost > 0 && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Custo de Envio</span>
                        <span className="font-bold">€{selectedOrder.shippingCost.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-black text-primary">€{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <Label htmlFor="order-status" className="text-base font-bold mb-3 block">
                    Atualizar Estado da Encomenda
                  </Label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => {
                      updateOrderStatus(selectedOrder.id, value as Order["status"])
                      setIsOrderDialogOpen(false)
                    }}
                  >
                    <SelectTrigger id="order-status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="confirmed">Confirmada</SelectItem>
                      <SelectItem value="shipped">Enviada</SelectItem>
                      <SelectItem value="delivered">Entregue</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
