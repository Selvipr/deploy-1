import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const supabase = await createClient()

        // 1. Create Sample Products
        const products = [
            {
                title: 'Spotify Premium',
                description: '1 Month Subscription Key',
                price: 10.00,
                type: 'serial_key',
                seller_id: (await supabase.auth.getUser()).data.user?.id // Set current user as seller for testing
            },
            {
                title: 'Elden Ring',
                description: 'Steam Key (Global)',
                price: 59.99,
                type: 'serial_key',
                seller_id: (await supabase.auth.getUser()).data.user?.id
            }
        ]

        const createdProducts = []

        for (const p of products) {
            // Check if exists
            const { data: existing } = await supabase.from('products').select('id').eq('title', p.title).single()

            let productId = existing?.id

            if (!existing) {
                // Insert Product
                const { data: newProd, error } = await supabase.from('products').insert(p).select().single()
                if (error) {
                    // Try to fetch again if race condition, or just log
                    console.error('Error creating product', p.title, error)
                    continue
                }
                productId = newProd.id
            }
            createdProducts.push({ ...p, id: productId })

            // 2. Create Inventory for this product (50 keys)
            const keys = Array.from({ length: 50 }).map((_, i) => ({
                product_id: productId,
                secret_data: `${p.title.toUpperCase().substring(0, 3)}-${Math.random().toString(36).substring(7).toUpperCase()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
                status: 'available',
                type: 'serial_key'
            }))

            await supabase.from('inventory').insert(keys)
        }

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully',
            products: createdProducts
        })

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
