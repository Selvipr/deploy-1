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

        // Call the RPC function we defined in SQL
        const { data, error } = await supabase.rpc('release_escrow_orders')

        if (error) {
            console.error('Error releasing escrow:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: 'Escrow release process completed',
            released_orders: data
        })
    } catch (e: any) {
        console.error('Cron job failed:', e)
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
