// Edita este ficheiro para adicionar, remover ou modificar produtos

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

// PRODUTOS DA LOJA
// Edita aqui para alterar preços, descontos, disponibilidade, etc.
export const PRODUCTS: Product[] = [
  // ROUPAS

  // SAPATOS

  // AIRPODS
  {
    id: "PROD-AIRPODS-MAX-001",
    name: "AirPods Pro 3",
    brand: "Apple",
    description: "Auscultadores premium com cancelamento de ruído ativo",
    price: 60.0,
    originalPrice: 109.99,
    discount: 45,
    image: "/apple-airpods-max-silver-headphones.jpg",
    category: "Airpods",
    inStock: true,
  },
  {
    id: "PROD-AIRPODS-PRO-001",
    name: "AirPods",
    brand: "Apple",
    description: "AirPods Normais",
    price: 50.0,
    originalPrice: 80.0,
    discount: 37,
    image: "/apple-airpods-pro-white.jpg",
    category: "Airpods",
    inStock: true,
  },

  // VAPES
  {
    id: "PROD-VAPE-PREMIUM-001",
    name: "Vape 6 Sabores",
    brand: "Waspe",
    description: "Dispositivo vape moderno e premium com 6 sabores",
    price: 20.0,
    originalPrice: 30.0,
    discount: 33,
    image: "/modern-premium-vape-device.jpg",
    category: "Vapes",
    flavors: 6,
    inStock: true,
  },

  // ACESSÓRIOS

]

// Função helper para obter produtos por categoria
export function getProductsByCategory(category: string): Product[] {
  if (category === "Todos") return PRODUCTS.filter((p) => p.inStock)
  return PRODUCTS.filter((p) => p.category === category && p.inStock)
}

// Função helper para obter produto por ID
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

// Função helper para pesquisar produtos
export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return PRODUCTS.filter(
    (p) =>
      p.inStock &&
      (p.name.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery)),
  )
}
