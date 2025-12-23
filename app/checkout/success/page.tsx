import { Suspense } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { SuccessContent } from "./success-content"
import { Cloud, Zap } from "lucide-react"

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string }
}) {
  const orderId = searchParams.orderId

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

      <main className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center">
        <Suspense
          fallback={
            <Card className="max-w-2xl w-full p-8 text-center">
              <p className="text-muted-foreground">A carregar...</p>
            </Card>
          }
        >
          <SuccessContent orderId={orderId} />
        </Suspense>
      </main>
    </div>
  )
}
