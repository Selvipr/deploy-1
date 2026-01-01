import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Ensure this runs dynamically

export async function GET(request: Request) {
    try {
        // secure this endpoint with a secret if needed (e.g., check Authorization header)
        // const authHeader = request.headers.get('authorization')
        // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        //     return new Response('Unauthorized', { status: 401 })
        // }

        const supabase = await createClient()

        // Fetch orders ready for release
        const { data: orders, error: fetchError } = await supabase
            .from('orders')
            .select('id, total, items')
            .eq('status', 'escrow')
            .lt('escrow_release_at', new Date().toISOString())

        if (fetchError) {
            console.error('Error fetching escrow orders:', fetchError)
            return NextResponse.json({ error: fetchError.message }, { status: 500 })
        }

        const releasedOrders = []
        if (orders && orders.length > 0) {
            const { OrderService } = await import('@/services/order.service')

            for (const order of orders) {
                try {
                    // Assuming the first item's seller is the seller for the whole order (MVP)
                    // If multiple sellers per order were supported, we'd need to loop items.
                    // Based on checkout.ts, items likely share context or we treat order total roughly.
                    // Safest for now: use first item's seller_id.
                    const sellerId = order.items?.[0]?.seller_id

                    if (sellerId) {
                        await OrderService.confirmOrder(order.id, sellerId, order.total)
                        releasedOrders.push(order.id)
                    }
                } catch (err) {
                    console.error(`Failed to release order ${order.id}:`, err)
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Escrow release process completed',
            released_orders: releasedOrders
        })
    } catch (e: any) {
        console.error('Cron job failed:', e)
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
