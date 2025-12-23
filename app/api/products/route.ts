import { NextResponse } from "next/server"
import { PRODUCTS } from "@/lib/products-data"
import type { Product } from "@/lib/products-data"

export type { Product }

export async function GET() {
  return NextResponse.json(PRODUCTS)
}
