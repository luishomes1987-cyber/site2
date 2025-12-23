import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  image: string
  category: string
  stock: number
  created_at?: string
  updated_at?: string
}

export type { Product }

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error fetching products:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    return NextResponse.json(products || [])
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const body = await request.json()

    const { data: newProduct, error } = await supabase.from("products").insert([body]).select().single()

    if (error) {
      console.error("[v0] Supabase error creating product:", error)
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
