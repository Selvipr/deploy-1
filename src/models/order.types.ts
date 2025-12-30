import { Product } from './types'

export interface Order {
    id: string
    buyer_id: string
    total: number
    status: 'pending' | 'escrow' | 'completed' | 'disputed'
    created_at: string
    // In a real app, you'd join this. For now, we'll fetch products separately or use a view.
    // Simplifying for this phase to use a JSON/Relation approach if possible, or just mock for UI first.
    items?: OrderItem[]
}

export interface OrderItem {
    id: string
    order_id: string
    product_id: string
    product?: Product
    price_at_purchase: number
}
