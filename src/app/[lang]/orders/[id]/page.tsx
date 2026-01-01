import { createClient } from '@/lib/supabase/server'
import { OrderService } from '@/services/order.service'
import { redirect } from 'next/navigation'

import { getDictionary } from '@/lib/dictionary'
import OrderTracker from '@/components/OrderTracker'
import EscrowActions from '@/components/EscrowActions'
import OrderRealtimeListener from '@/components/OrderRealtimeListener'


export default async function OrderDetailsPage({
    params,
}: {
    params: Promise<{ id: string, lang: 'en' | 'ru' }>
}) {
    const { id, lang } = await params
    const dict = await getDictionary(lang)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect(`/${lang}/login`)

    const order = await OrderService.getOrderById(id)

    const secret = await OrderService.getOrderSecret(id, user.id)

    if (!order) {
        return <div className="text-white p-8">Order not found</div>
    }

    // Server Actions for Escrow
    async function confirmReceived() {
        'use server'
        await OrderService.confirmOrder(id, order.items?.[0]?.seller_id, order.total)
        redirect(`/${lang}/orders/${id}`)
    }

    async function raiseDispute() {
        'use server'
        await OrderService.disputeOrder(id)
        redirect(`/${lang}/orders/${id}`)
    }

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white">
            <OrderRealtimeListener orderId={id} />


            <div className="mx-auto max-w-3xl px-4 py-8 sm:py-16">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-4">{dict.orders.detailsTitle}</h1>
                    <OrderTracker status={order.status} lang={lang} />
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8 mt-8">
                    <div className="flex justify-between mb-4">
                        <span className="text-gray-400">Order ID</span>
                        <span className="font-mono">{order.id}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                        <span className="text-gray-400">{dict.orders.totalAmount}</span>
                        <span className="text-xl font-bold text-green-400">${order.total}</span>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-gray-700">
                        <a
                            href={`/${lang}/orders/${order.id}/invoice`}
                            target="_blank"
                            className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            {dict.orders.downloadInvoice}
                        </a>
                    </div>
                </div>
                {order.payment_method && (
                    <div className="flex justify-between mb-4">
                        <span className="text-gray-400">{dict.orders.payment}</span>
                        <span className="uppercase">{order.payment_method.replace('_', ' ')}</span>
                    </div>
                )}
                {order.contact_email && (
                    <div className="flex justify-between mb-4">
                        <span className="text-gray-400">{dict.orders.email}</span>
                        <span>{order.contact_email}</span>
                    </div>
                )}
                {order.delivery_info?.notes && (
                    <div className="flex flex-col mb-4 pt-4 border-t border-gray-700">
                        <span className="text-gray-400 text-sm mb-1">{dict.orders.deliveryNotes}</span>
                        <span className="text-gray-300 italic">"{order.delivery_info.notes}"</span>
                    </div>
                )}

                {/* Items List */}
                <div className="border-t border-gray-700 pt-4 mt-4">
                    <h3 className="text-lg font-semibold mb-2">{dict.orders.items}</h3>
                    {order.items?.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between py-2">
                            <span>{item.title}</span>
                            <span>${item.price}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Secret Data Section (Only if Complete) */}
            {order.status === 'completed' && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-8 max-w-3xl mx-auto px-4">
                    <h3 className="text-lg font-bold text-green-400 mb-4">{dict.orders.yourDigitalGoods}</h3>

                    <div className="font-mono bg-black/50 p-4 rounded text-lg tracking-widest text-center select-all break-all">
                        {secret?.secret_data || 'ABC1-DEF2-GHI3-JKL4 (Mock Key)'}
                    </div>
                    {secret?.type === 'file' && <p className="text-xs text-center mt-2 text-indigo-400">This is a file download link.</p>}
                    <p className="text-xs text-center mt-2 text-gray-400">{dict.orders.redeemImmediately}</p>
                </div>
            )}

            {/* Escrow Actions */}
            {order.status === 'escrow' && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 max-w-3xl mx-auto px-4">
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">{dict.orders.safeDealEscrow}</h3>
                    <p className="text-sm text-gray-300 mb-6">
                        {dict.orders.escrowDesc}
                    </p>

                    <EscrowActions
                        onConfirm={confirmReceived}
                        onDispute={raiseDispute}
                        dict={{
                            confirmReceived: dict.orders.confirmReceived,
                            disputeTransaction: dict.orders.disputeTransaction,
                            confirming: 'Confirming...', // Hardcoded fallbacks if dict missing
                            processing: 'Processing...'
                        }}
                    />
                </div>
            )}
        </div>
    )
}
