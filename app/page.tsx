"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Instagram, Search, Sparkles, Cloud, Zap, ChevronDown } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

const categories = ["Todos", "Roupas", "Sapatos", "Airpods", "Vapes", "Acessórios"]

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const { getItemCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/60"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Cloud className="w-9 h-9 text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-6" />
              <Zap className="w-4 h-4 text-primary/90 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 group-hover:scale-125" />
            </div>
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
              CLOUDZSTORE
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-semibold hover:text-primary transition-all duration-300 hidden sm:block relative group"
            >
              Loja
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <a
              href="https://instagram.com/cloudzstore.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
            >
              <Instagram className="w-5 h-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105"
              >
                <ShoppingBag className="w-5 h-5" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                    {getItemCount()}
                  </span>
                )}
                <span className="sr-only">Carrinho de compras</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative container mx-auto px-4 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="absolute top-20 right-10 opacity-10 animate-pulse">
          <Cloud className="w-40 h-40 text-primary" />
        </div>
        <div className="absolute bottom-20 left-10 opacity-10 animate-pulse" style={{ animationDelay: "1s" }}>
          <Sparkles className="w-32 h-32 text-primary" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8 animate-fade-in-up">
          <Badge className="mb-4 px-5 py-2 text-sm font-semibold shadow-lg">
            <Sparkles className="w-4 h-4 mr-2" />
            Novidades Exclusivas
          </Badge>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-balance leading-[0.9]">
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
             Loja Online
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              24/7
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 text-pretty leading-relaxed max-w-2xl mx-auto">
            Descobre drops exclusivos e edições limitadas com entrega em todo Portugal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="group hover:scale-105 transition-all duration-300 shadow-xl text-base px-8 py-6"
              asChild
            >
              <a href="#products" className="flex items-center gap-2">
                Explorar Produtos
                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group hover:scale-105 transition-all duration-300 text-base px-8 py-6 bg-transparent"
              asChild
            >
              <a
                href="https://instagram.com/cloudzstore.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Instagram className="w-5 h-5" />
                Seguir no Instagram
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex flex-col md:flex-row gap-4 items-center max-w-5xl mx-auto">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors" />
            <Input
              placeholder="Pesquisar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 border-border/50 focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md text-base"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((category, index) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap transition-all duration-300 hover:scale-105 shadow-sm font-semibold"
                size="lg"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="container mx-auto px-4 py-16 flex-1">
        <div className="mb-12 text-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-5xl font-black tracking-tight mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Produtos em Destaque
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">Seleção curada dos últimos lançamentos</p>
        </div>
        <ProductGrid selectedCategory={selectedCategory} searchQuery={searchQuery} />
      </section>

      <footer className="border-t border-border/40 bg-gradient-to-b from-muted/30 to-muted/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="relative">
                  <Cloud className="w-7 h-7 text-primary" />
                  <Zap className="w-3.5 h-3.5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h3 className="font-black text-xl tracking-tight">CLOUDZSTORE</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A tua loja premium de streetwear, tecnologia e lifestyle com as últimas tendências.
              </p>
              <a
                href="https://instagram.com/cloudzstore.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold hover:text-primary inline-flex items-center gap-2 transition-all duration-300 group"
              >
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                @cloudzstore
              </a>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg mb-4">Como Comprar</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Adiciona produtos ao carrinho, finaliza o pedido e entraremos em contacto via Instagram para completar a
                tua encomenda de forma rápida e segura.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg mb-4">Informações</h3>
              <ul className="text-sm text-muted-foreground space-y-3">
                <li className="flex items-center gap-3 group">
                  <span className="w-2 h-2 bg-primary rounded-full group-hover:scale-125 transition-transform" />
                  Envios para toda Portugal
                </li>
                <li className="flex items-center gap-3 group">
                  <span className="w-2 h-2 bg-primary rounded-full group-hover:scale-125 transition-transform" />
                  Pagamentos seguros
                </li>
                <li className="flex items-center gap-3 group">
                  <span className="w-2 h-2 bg-primary rounded-full group-hover:scale-125 transition-transform" />
                  Produtos 100% autênticos
                </li>
                <li className="flex items-center gap-3 group">
                  <span className="w-2 h-2 bg-primary rounded-full group-hover:scale-125 transition-transform" />
                  Suporte via Instagram
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} CLOUDZSTORE. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
