// Client-side storage utilities para persistir dados
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
  flavors?: number // For vapes: number of flavors (3, 6, etc)
  inStock: boolean
}

export interface Order {
  id: string
  customerName: string
  email: string
  phone: string
  instagram: string
  address: string
  city: string
  postalCode: string
  items: Array<{
    id: string
    name: string
    brand: string
    price: number
    image: string
    size: string
    quantity: number
  }>
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  createdAt: string
}

// Storage keys
const PRODUCTS_KEY = "cloudz-products"
const ORDERS_KEY = "cloudz-orders"

// Products functions
export const getProducts = (): Product[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(PRODUCTS_KEY)
  return stored ? JSON.parse(stored) : getDefaultProducts()
}

export const saveProducts = (products: Product[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export const addProduct = (product: Omit<Product, "id">): Product => {
  const products = getProducts()
  const newProduct = {
    ...product,
    id: `PROD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
  }
  products.push(newProduct)
  saveProducts(products)
  return newProduct
}

export const updateProduct = (id: string, updates: Partial<Product>): void => {
  const products = getProducts()
  const index = products.findIndex((p) => p.id === id)
  if (index !== -1) {
    products[index] = { ...products[index], ...updates }
    saveProducts(products)
  }
}

export const deleteProduct = (id: string): void => {
  const products = getProducts()
  const filtered = products.filter((p) => p.id !== id)
  saveProducts(filtered)
}

// Orders functions
export const getOrders = (): Order[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(ORDERS_KEY)
  return stored ? JSON.parse(stored) : []
}

export const saveOrder = (order: Omit<Order, "id" | "createdAt" | "status">): Order => {
  const orders = getOrders()
  const newOrder: Order = {
    ...order,
    id: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  }
  orders.push(newOrder)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  return newOrder
}

export const updateOrderStatus = (id: string, status: Order["status"]): void => {
  const orders = getOrders()
  const index = orders.findIndex((o) => o.id === id)
  if (index !== -1) {
    orders[index].status = status
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }
}

// Default products
function getDefaultProducts(): Product[] {
  const products = [
    {
      id: "1",
      name: "Hoodie Oversized Preto",
      brand: "Premium",
      price: 69.99,
      image: "/black-oversized-hoodie-streetwear.jpg",
      category: "Roupas",
      sizes: ["S", "M", "L", "XL"],
      inStock: true,
    },
    {
      id: "2",
      name: "Nike Air Force 1",
      brand: "Nike",
      price: 119.99,
      image: "/white-nike-sneakers.png",
      category: "Sapatos",
      sizes: ["38", "39", "40", "41", "42", "43"],
      inStock: true,
    },
    {
      id: "3",
      name: "Jordan Retro High",
      brand: "Jordan",
      price: 179.99,
      image: "/jordan-retro-high-sneakers.jpg",
      category: "Sapatos",
      sizes: ["38", "39", "40", "41", "42", "43"],
      inStock: true,
    },
    {
      id: "4",
      name: "Calças Cargo Bege",
      brand: "Streetwear",
      price: 59.99,
      image: "/beige-cargo-pants-streetwear.jpg",
      category: "Roupas",
      sizes: ["S", "M", "L", "XL"],
      inStock: true,
    },
    {
      id: "5",
      name: "AirPods Pro",
      brand: "Apple",
      price: 249.99,
      image: "/apple-airpods-pro-white.jpg",
      category: "Airpods",
      sizes: ["Único"],
      inStock: true,
    },
    {
      id: "6",
      name: "Vape Descartável",
      brand: "Premium",
      price: 12.99,
      image: "/colorful-disposable-vape-pen.jpg",
      category: "Vapes",
      sizes: ["Único"],
      flavors: 3,
      inStock: true,
    },
    {
      id: "7",
      name: "AirPods Max",
      brand: "Apple",
      price: 549.99,
      image: "/apple-airpods-max-silver-headphones.jpg",
      category: "Airpods",
      sizes: ["Único"],
      inStock: true,
    },
    {
      id: "8",
      name: "Vape Premium",
      brand: "Premium",
      price: 34.99,
      image: "/modern-premium-vape-device.jpg",
      category: "Vapes",
      sizes: ["Único"],
      flavors: 6,
      inStock: true,
    },
  ]
  saveProducts(products)
  return products
}

export const CATEGORIES = ["Roupas", "Sapatos", "Airpods", "Vapes", "Acessórios"]
