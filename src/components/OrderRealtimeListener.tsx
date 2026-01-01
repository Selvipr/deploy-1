'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function OrderRealtimeListener({ orderId }: { orderId: string }) {
    const router = useRouter()

    useEffect(() => {
        const supabase = createClient()

        const channel = supabase
            .channel(`order-${orderId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${orderId}`
                },
                (payload) => {
                    console.log('Order update received:', payload)
                    router.refresh()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [orderId, router])

    return null
}
