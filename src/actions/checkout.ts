'use server'

import { createClient } from '@/lib/supabase/server'
import { Product } from '@/models/types'

export async function createBatchOrder(data: {
    items: Product[],
    paymentMethod: string,
    contactEmail: string,
    deliveryNotes: string
}) {
    const { items, paymentMethod, contactEmail, deliveryNotes } = data

    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error("Unauthorized")

        if (!items || items.length === 0) throw new Error("Empty cart")

        // 1. Calculate Total
        const total = items.reduce((sum, item) => sum + item.price, 0)

        // 2. Create Order
        const releaseDate = new Date()
        releaseDate.setHours(releaseDate.getHours() + 24)

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                buyer_id: user.id,
                total: total,
                status: 'escrow',
                escrow_release_at: releaseDate.toISOString(),
                items: items,
                payment_method: paymentMethod,
                contact_email: contactEmail,
                delivery_info: { notes: deliveryNotes }
            })
            .select()
            .single()

        if (orderError) throw orderError

        // 3. Lock Inventory
        for (const item of items) {
            const { data: inv, error: invErr } = await supabase
                .from('inventory')
                .select('id')
                .eq('product_id', item.id)
                .eq('status', 'available')
                .limit(1)
                .single()

            if (invErr || !inv) {
                // Rollback strategy: delete order if stock failed?
                // For MVP: we just error out. 
                // Ideally we should check stock BEFORE creating order. 
                await supabase.from('orders').delete().eq('id', order.id)
                return { error: `Out of stock for item: ${item.title}` }
            }

            await supabase
                .from('inventory')
                .update({
                    status: 'locked',
                    order_id: order.id
                } as any)
                .eq('id', inv.id)
        }

        return { orderId: order.id }

    } catch (e) {
        console.error('Checkout error:', e)
        return { error: (e as Error).message }
    }
}
