import { type NextRequest, NextResponse } from "next/server"
import { getAllOrders, createOrder } from "@/lib/server-storage"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const order = createOrder({
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        phone: body.customer.phone,
        instagram: body.customer.instagram,
        address: body.customer.address,
        city: body.customer.city,
        postalCode: body.customer.postalCode,
        notes: body.customer.notes,
      },
      items: body.items,
      total: body.total,
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const orders = getAllOrders()
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return NextResponse.json(sortedOrders)
  } catch (error) {
    console.error("[v0] Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
