import fs from "fs"
import path from "path"
import type { Order } from "./server-storage"

const DATA_DIR = path.join(process.cwd(), "data")
const ORDERS_FILE = path.join(DATA_DIR, "orders.json")

// Ensure data directory exists
function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    console.log("[v0] Data directory created at:", DATA_DIR)
  }
}

// Load orders from file
export function loadOrders(): Order[] {
  ensureDataDirectory()
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, "utf-8")
      const orders = JSON.parse(data)
      console.log("[v0] Loaded", orders.length, "orders from file")
      return orders
    }
  } catch (error) {
    console.error("[v0] Error loading orders from file:", error)
  }

  // Return empty array if file doesn't exist
  return []
}

// Save orders to file
export function saveOrders(orders: Order[]): void {
  ensureDataDirectory()
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8")
    console.log("[v0] Saved", orders.length, "orders to file")
  } catch (error) {
    console.error("[v0] Error saving orders to file:", error)
  }
}
