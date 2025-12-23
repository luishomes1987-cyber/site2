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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Plus,
  Pencil,
  Trash2,
  Store,
  ShoppingBag,
  Eye,
  TrendingUp,
  ShoppingCart,
} from "lucide-react"
import type { Order } from "@/lib/storage"

interface Product {
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

const CATEGORIES = ["Roupas", "Sapatos", "Airpods", "Vapes", "Acessórios"]

const STAFF_PASSWORD = "cloudz2024"

export default function StaffDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null) // Renamed from expandedOrder
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false) // New state for order dialog
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("orders")
  const [products, setProducts] = useState<Product[]>([])
  const { toast } = useToast()

  const [productForm, setProductForm] = useState({
    name: "",
    brand: "",
    description: "",
    price: 0,
    originalPrice: 0,
    discount: 0,
    image: "",
    category: "Roupas",
    sizes: "",
    flavors: 0,
    inStock: true,
  })

  useEffect(() => {
    const auth = sessionStorage.getItem("staff_authenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
      // setIsLoading(true) // Moved this to loadData calls
      // loadData() // Changed to fetchOrders and fetchProducts
    } else {
      setIsLoading(false)
    }
  }, [])

  // Fetch orders and products when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
      fetchProducts()
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchOrders()
  }, [statusFilter, searchQuery, activeTab])

  useEffect(() => {
    filterOrders()
  }, [orders, statusFilter, searchQuery])

  useEffect(() => {
    fetchProducts()
  }, [activeTab])

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

  // Fetch orders from API
  const fetchOrders = async () => {
    setIsLoading(true) // Start loading when fetching
    try {
      const response = await fetch("/api/orders", { cache: "no-store" })
      if (!response.ok) throw new Error("Failed to fetch orders")
      const data = await response.json()
      setOrders(data)
      filterOrders() // Ensure filtered orders are updated immediately
    } catch (error) {
      console.error("[v0] Error fetching orders:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar encomendas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false) // Stop loading after fetching or error
    }
  }

  const fetchProducts = async () => {
    try {
      console.log("[v0] Fetching products...")
      const response = await fetch("/api/products", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      const data = await response.json()
      console.log("[v0] Products fetched:", data.length, "products")
      setProducts(data) // Use setProducts function from state management
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === STAFF_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("staff_authenticated", "true")
      setIsLoading(true) // Set loading true before fetching data
      fetchOrders() // Fetch data after login
      fetchProducts() // Fetch data after login
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
      // Update filtered orders as well
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

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const productData: Partial<Product> = {
        name: productForm.name,
        brand: productForm.brand,
        description: productForm.description || undefined,
        price: productForm.price,
        originalPrice: productForm.originalPrice > 0 ? productForm.originalPrice : undefined,
        discount: productForm.discount > 0 ? productForm.discount : undefined,
        image: productForm.image,
        category: productForm.category,
        inStock: productForm.inStock,
      }

      // Add sizes for Roupas and Sapatos
      if (productForm.category === "Roupas" || productForm.category === "Sapatos") {
        productData.sizes = productForm.sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      }

      // Add flavors for Vapes
      if (productForm.category === "Vapes") {
        productData.flavors = productForm.flavors
      }

      if (editingProduct) {
        console.log("[v0] Updating product:", editingProduct.id, productData)
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
          cache: "no-store",
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("[v0] Update failed:", errorData)
          throw new Error("Failed to update product")
        }

        const updatedProduct = await response.json()
        console.log("[v0] Product updated successfully from API:", updatedProduct)

        setProducts((prev) => {
          const newProducts = prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
          console.log("[v0] Products state updated locally")
          return newProducts
        })

        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso",
        })
      } else {
        console.log("[v0] Creating product:", productData)
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
          cache: "no-store",
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("[v0] Create failed:", errorData)
          throw new Error("Failed to create product")
        }

        const newProduct = await response.json()
        console.log("[v0] Product created successfully:", newProduct)

        setProducts((prev) => {
          const newProducts = [...prev, newProduct]
          console.log("[v0] Products state updated with new product")
          return newProducts
        })

        toast({
          title: "Sucesso",
          description: "Produto adicionado com sucesso",
        })
      }

      setTimeout(async () => {
        console.log("[v0] Force re-fetching products from server...")
        await fetchProducts()
      }, 200)

      setIsProductDialogOpen(false)
      resetProductForm()
    } catch (error) {
      console.error("[v0] Error saving product:", error)
      toast({
        title: "Erro",
        description: "Falha ao guardar produto",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      brand: product.brand,
      description: product.description || "",
      price: product.price,
      originalPrice: product.originalPrice || 0,
      discount: product.discount || 0,
      image: product.image,
      category: product.category,
      sizes: product.sizes?.join(", ") || "",
      flavors: product.flavors || 0,
      inStock: product.inStock,
    })
    setIsProductDialogOpen(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Tens a certeza que queres eliminar este produto?")) {
      setIsLoading(true)
      try {
        console.log("[v0] Deleting product:", productId)
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        })

        if (!response.ok) throw new Error("Failed to delete product")

        console.log("[v0] Product deleted successfully")
        window.dispatchEvent(new Event("productsUpdated"))
        await fetchProducts()
        console.log("[v0] Products reloaded after delete")

        toast({
          title: "Sucesso",
          description: "Produto eliminado com sucesso",
        })
      } catch (error) {
        console.error("[v0] Error deleting product:", error)
        toast({
          title: "Erro",
          description: "Falha ao eliminar produto",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const resetProductForm = () => {
    setEditingProduct(null)
    setProductForm({
      name: "",
      brand: "",
      description: "",
      price: 0,
      originalPrice: 0,
      discount: 0,
      image: "",
      category: "Roupas",
      sizes: "",
      flavors: 0,
      inStock: true,
    })
  }

  const calculateDiscount = () => {
    if (productForm.originalPrice > 0 && productForm.price > 0 && productForm.originalPrice > productForm.price) {
      const discount = Math.round(((productForm.originalPrice - productForm.price) / productForm.originalPrice) * 100)
      setProductForm({ ...productForm, discount })
    } else {
      setProductForm({ ...productForm, discount: 0 })
    }
  }

  // Function to handle order selection and open dialog
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
          <h1 className="text-4xl font-black tracking-tight mb-2">Painel de Gestão</h1>
          <p className="text-muted-foreground text-lg">Gere encomendas e produtos da loja</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Encomendas
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              Produtos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
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
                  <ShoppingCart className="w-8 h-8 text-blue-600" />
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

            <Card className="p-4">
              <div className="flex flex-col md:flex-row row-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por ID, nome, email ou Instagram..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filtrar por estado" />
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
            </Card>

            {isLoading ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">A carregar encomendas...</p>
              </Card>
            ) : filteredOrders.length === 0 ? (
              <Card className="p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma encomenda encontrada</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg">{order.id}</h3>
                            <Badge className={getStatusColor(order.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(order.status)}
                                {order.status}
                              </span>
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span className="font-medium">{order.customer?.name || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Instagram className="w-4 h-4" />
                              <span>{order.customer?.instagram || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">€{order.total.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("pt-PT")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
                        >
                          <SelectTrigger className="w-[180px]">
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOrderSelect(order)} // Use handleOrderSelect
                          className="ml-auto"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Gestão de Produtos</h2>
                <p className="text-muted-foreground">Total de produtos: {products.length}</p>
              </div>
              <Dialog
                open={isProductDialogOpen}
                onOpenChange={(open) => {
                  setIsProductDialogOpen(open)
                  if (!open) resetProductForm()
                }}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Adicionar Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome do Produto *</Label>
                        <Input
                          id="name"
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          placeholder="Ex: Nike Air Max"
                        />
                      </div>
                      <div>
                        <Label htmlFor="brand">Marca *</Label>
                        <Input
                          id="brand"
                          required
                          value={productForm.brand}
                          onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                          placeholder="Ex: Nike"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição (Opcional)</Label>
                      <Input
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Breve descrição do produto"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Preço (€) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          required
                          value={productForm.price || ""}
                          onChange={(e) =>
                            setProductForm({ ...productForm, price: Number.parseFloat(e.target.value) || 0 })
                          }
                          onBlur={calculateDiscount}
                        />
                      </div>
                      <div>
                        <Label htmlFor="originalPrice">Preço Original (€)</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          step="0.01"
                          value={productForm.originalPrice || ""}
                          onChange={(e) =>
                            setProductForm({ ...productForm, originalPrice: Number.parseFloat(e.target.value) || 0 })
                          }
                          onBlur={calculateDiscount}
                          placeholder="Opcional"
                        />
                      </div>
                      <div>
                        <Label htmlFor="discount">Desconto (%) - Auto</Label>
                        <Input
                          id="discount"
                          type="number"
                          value={productForm.discount || ""}
                          placeholder="Auto"
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="image">URL da Imagem *</Label>
                      <Input
                        id="image"
                        required
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        placeholder="/example-product.jpg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Categoria *</Label>
                      <Select
                        value={productForm.category}
                        onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {(productForm.category === "Roupas" || productForm.category === "Sapatos") && (
                      <div>
                        <Label htmlFor="sizes">Tamanhos (separados por vírgula) *</Label>
                        <Input
                          id="sizes"
                          required
                          value={productForm.sizes}
                          onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                          placeholder={productForm.category === "Sapatos" ? "38, 39, 40, 41, 42, 43" : "S, M, L, XL"}
                        />
                      </div>
                    )}

                    {productForm.category === "Vapes" && (
                      <div>
                        <Label htmlFor="flavors">Número de Sabores *</Label>
                        <Select
                          value={productForm.flavors.toString()}
                          onValueChange={(value) => setProductForm({ ...productForm, flavors: Number.parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleciona o número de sabores" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Sabor</SelectItem>
                            <SelectItem value="3">3 Sabores</SelectItem>
                            <SelectItem value="6">6 Sabores</SelectItem>
                            <SelectItem value="9">9 Sabores</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {(productForm.category === "Airpods" || productForm.category === "Acessórios") && (
                      <p className="text-sm text-muted-foreground italic">
                        Esta categoria não requer tamanhos ou variantes
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="inStock"
                        checked={productForm.inStock}
                        onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="inStock">Produto em stock</Label>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1">
                        {editingProduct ? "Atualizar Produto" : "Adicionar Produto"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsProductDialogOpen(false)
                          resetProductForm()
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                    {product.discount && product.discount > 0 && (
                      <Badge className="absolute top-2 right-2 bg-red-500">-{product.discount}%</Badge>
                    )}
                    {!product.inStock && (
                      <Badge className="absolute top-2 left-2" variant="secondary">
                        Esgotado
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase">{product.brand}</p>
                      <h3 className="font-bold text-sm leading-t-t">{product.name}</h3>
                      {product.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold">€{product.price.toFixed(2)}</p>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <p className="text-xs text-muted-foreground line-through">
                            €{product.originalPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {product.category === "Vapes" && product.flavors ? (
                        <span>{product.flavors} Sabores</span>
                      ) : product.sizes && product.sizes.length > 0 ? (
                        <span>Tamanhos: {product.sizes.join(", ")}</span>
                      ) : (
                        <span>Tamanho único</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Pencil className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Order Details Dialog */}
      <Dialog
        open={isOrderDialogOpen}
        onOpenChange={(open) => {
          setIsOrderDialogOpen(open)
          if (!open) setSelectedOrder(null)
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Encomenda #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informação do Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-xs">Email</p>
                        <a href={`mailto:${selectedOrder.customer?.email || ""}`} className="hover:underline">
                          {selectedOrder.customer?.email || "N/A"}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-xs">Telefone</p>
                        <a href={`tel:${selectedOrder.customer?.phone || ""}`} className="hover:underline">
                          {selectedOrder.customer?.phone || "N/A"}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-xs">Instagram</p>
                        <a
                          href={`https://instagram.com/${selectedOrder.customer?.instagram?.replace("@", "") || ""}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {selectedOrder.customer?.instagram || "N/A"}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground text-xs">Morada</p>
                        <p>
                          {selectedOrder.customer?.address || "N/A"}, {selectedOrder.customer?.postalCode || ""}{" "}
                          {selectedOrder.customer?.city || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  {selectedOrder.customer?.notes && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Notas da Encomenda</p>
                      <p className="text-sm">{selectedOrder.customer.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Produtos da Encomenda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-muted rounded-rounded">
                        <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.brand} • Tamanho: {item.size} • Qtd: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo da Encomenda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Subtotal</p>
                      <p>€{(selectedOrder.total - (selectedOrder.shippingCost || 0)).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Envio</p>
                      <p>€{selectedOrder.shippingCost?.toFixed(2) || "0.00"}</p>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <p>Total</p>
                      <p>€{selectedOrder.total.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          ) : (
            <p>A carregar detalhes da encomenda...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
