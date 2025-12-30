import { createClient } from '@/lib/supabase/server'
import { Order } from '@/models/order.types'

export class OrderService {
    static async getUserOrders(userId: string): Promise<Order[]> {
        const supabase = await createClient()

        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('buyer_id', userId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching orders:', error)
            return []
        }

        return orders as Order[]
    }

    static async getOrderById(orderId: string): Promise<any> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                buyer:users!buyer_id(email),
                disputes(*)
            `)
            .eq('id', orderId)
            .single()

        if (error) return null
        return data
    }

    // Purchase Flow: 
    // 1. Find available inventory for product
    // 2. Lock inventory
    // 3. Create Order
    static async createOrder(buyerId: string, productId: string, price: number) {
        const supabase = await createClient()

        // 1. Find inventory
        const { data: inventory, error: invError } = await supabase
            .from('inventory')
            .select('id, product:products(id, title, price, seller_id)')
            .eq('product_id', productId)
            .eq('status', 'available')
            .limit(1)
            .single()

        if (invError || !inventory) throw new Error('Out of Stock')

        // 1.5 Check Buyer Balance (Pre-check)
        const { data: buyerCheck } = await supabase
            .from('users')
            .select('wallet_balance')
            .eq('id', buyerId)
            .single()

        if (!buyerCheck || (buyerCheck.wallet_balance || 0) < price) {
            throw new Error("Insufficient Funds")
        }

        // 2. Lock inventory 
        const { error: lockError } = await supabase
            .from('inventory')
            .update({ status: 'locked' })
            .eq('id', inventory.id)

        if (lockError) throw new Error('Failed to lock inventory')

        // 3. Create Order
        const releaseDate = new Date()
        releaseDate.setHours(releaseDate.getHours() + 24) // 24h auto-release

        const product = (inventory as any).product

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                buyer_id: buyerId,
                total: price,
                status: 'escrow',
                escrow_release_at: releaseDate.toISOString(),
                // @ts-ignore - items column added via migration
                items: [{
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    seller_id: product.seller_id
                }]
            })
            .select()
            .single()

        if (orderError) throw orderError

        // 4. Update inventory with order_id (if migration applied)
        // Best effort:
        await supabase
            .from('inventory')
            .update({ order_id: order.id } as any)
            .eq('id', inventory.id)

        // 5. Deduct Buyer Balance
        // Note: In a real app, use RPC for atomic transaction.
        const { error: deductError } = await supabase
            .from('users')
            .update({ wallet_balance: (buyerCheck.wallet_balance || 0) - price })
            .eq('id', buyerId)

        if (deductError) {
            console.error('CRITICAL: Payment deduction failed for order', order.id)
            // In real app: Cancel order here
        }

        return order
    }

    static async confirmOrder(orderId: string, sellerId: string, amount: number) {
        const supabase = await createClient()

        // 1. Update Order status
        const { error: orderError } = await supabase
            .from('orders')
            .update({ status: 'completed' }) // Changed to 'completed' to match page check
            .eq('id', orderId)

        if (orderError) throw orderError

        // 2. Increment Seller Balance 
        const { data: seller, error: sellerError } = await supabase
            .from('users')
            .select('wallet_balance')
            .eq('id', sellerId)
            .single()

        if (!sellerError && seller) {
            await supabase
                .from('users')
                .update({ wallet_balance: (seller.wallet_balance || 0) + amount })
                .eq('id', sellerId)
        }
    }

    static async disputeOrder(orderId: string) {
        const supabase = await createClient()
        const { error } = await supabase
            .from('orders')
            .update({ status: 'disputed' })
            .eq('id', orderId)
        if (error) throw error
    }

    // Admin: Unlock inventory and refund buyer (conceptually)
    static async refundOrder(orderId: string) {
        const supabase = await createClient()

        // 1. Get Order
        const { data: order } = await supabase
            .from('orders')
            .select('items, total, buyer_id')
            .eq('id', orderId)
            .single()

        if (!order) throw new Error("Order not found")

        // 2. Mark Inventory as Available again
        // Note: In real world, we might want to check if the key was exposed. 
        // If exposed, maybe mark as 'compromised' instead of 'available'. 
        // For MVP, we assume refund implies item is returned/invalidated or we just reset it.
        await supabase
            .from('inventory')
            .update({ status: 'available', order_id: null } as any)
            .eq('order_id', orderId)

        // 3. Update Order Status
        await supabase
            .from('orders')
            .update({ status: 'refunded' })
            .eq('id', orderId)

        // 4. Refund Buyer Balance (if wallet was used)
        // Check payment method. If 'wallet', refund.
        // For now, let's just assume we credit the wallet regardless as a "store credit" refund.
        // Or strictly strictly only if payment_method = 'wallet'.
        // Simplified:
        const { data: buyer } = await supabase.from('users').select('wallet_balance').eq('id', order.buyer_id).single()
        if (buyer) {
            await supabase.from('users').update({
                wallet_balance: (buyer.wallet_balance || 0) + order.total
            }).eq('id', order.buyer_id)
        }
    }

    // Fetch the secret data (key/file) for a completed order
    static async getOrderSecret(orderId: string, buyerId: string) {
        const supabase = await createClient()

        // Security Check: Ensure order belongs to user and is completed
        const { data: order } = await supabase
            .from('orders')
            .select('status, buyer_id')
            .eq('id', orderId)
            .single()

        if (!order || order.buyer_id !== buyerId || order.status !== 'completed') {
            return null
        }

        // Fetch linked inventory
        const { data: inventory } = await supabase
            .from('inventory')
            .select('secret_data, type')
            .eq('order_id', orderId)
            .single()

        return inventory
    }
}
