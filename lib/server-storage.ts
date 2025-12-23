// Server-side storage para manter dados em memória compartilhados entre rotas

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

export interface Order {
  id: string
  customer: {
    name: string
    email: string
    phone: string
    instagram: string
    address: string
    city: string
    postalCode: string
    notes?: string
  }
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
  shippingCost?: number
}

const defaultProducts: Product[] = [
  {
    id: "5",
    name: "AirPods Pro",
    brand: "Apple",
    description: "Cancelamento ativo de ruído, modo de transparência e áudio espacial",
    price: 249.99,
    image: "/apple-airpods-pro-white.jpg",
    category: "Airpods",
    inStock: true,
  },
  {
    id: "6",
    name: "Vape Descartável Triple Flavor",
    brand: "Premium",
    description: "3 sabores distintos num único dispositivo premium",
    price: 12.99,
    image: "/colorful-disposable-vape-pen.jpg",
    category: "Vapes",
    flavors: 3,
    inStock: true,
  },
  {
    id: "7",
    name: "AirPods Max",
    brand: "Apple",
    description: "Auscultadores premium com cancelamento de ruído e áudio de alta fidelidade",
    price: 549.99,
    image: "/apple-airpods-max-silver-headphones.jpg",
    category: "Airpods",
    inStock: true,
  },
  {
    id: "8",
    name: "Vape Premium Six Flavor",
    brand: "Premium",
    description: "Dispositivo premium com 6 sabores diferentes para máxima variedade",
    price: 34.99,
    image: "/modern-premium-vape-device.jpg",
    category: "Vapes",
    flavors: 6,
    inStock: true,
  },
]

const serverStorage = {
  products: [...defaultProducts],
  orders: [] as Order[],
}

// Product operations
export const getAllProducts = () => serverStorage.products

export const getProductById = (id: string) => serverStorage.products.find((p) => p.id === id)

export const createProduct = (product: Omit<Product, "id">) => {
  const newProduct: Product = {
    ...product,
    id: `PROD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
  }
  serverStorage.products.push(newProduct)
  return newProduct
}

export const updateProduct = (id: string, updates: Partial<Product>) => {
  const index = serverStorage.products.findIndex((p) => p.id === id)
  if (index === -1) return null

  serverStorage.products[index] = { ...serverStorage.products[index], ...updates }
  return serverStorage.products[index]
}

export const deleteProduct = (id: string) => {
  const index = serverStorage.products.findIndex((p) => p.id === id)
  if (index === -1) return false

  serverStorage.products.splice(index, 1)
  return true
}

// Order operations
export const getAllOrders = () => serverStorage.orders

export const getOrderById = (id: string) => serverStorage.orders.find((o) => o.id === id)

export const createOrder = (order: Omit<Order, "id" | "createdAt" | "status">) => {
  const newOrder: Order = {
    ...order,
    id: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  }
  serverStorage.orders.push(newOrder)
  return newOrder
}

export const updateOrder = (id: string, updates: Partial<Order>) => {
  const index = serverStorage.orders.findIndex((o) => o.id === id)
  if (index === -1) return null

  serverStorage.orders[index] = { ...serverStorage.orders[index], ...updates }
  return serverStorage.orders[index]
}
