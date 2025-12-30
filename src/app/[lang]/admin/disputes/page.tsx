import { createClient } from '@/lib/supabase/server'
import { OrderService } from '@/services/order.service'
import { revalidatePath } from 'next/cache'

export default async function DisputesPage() {
    const supabase = await createClient()

    // Fetch disputed orders
    const { data: disputes } = await supabase
        .from('orders')
        .select(`
            *,
            buyer:users!buyer_id(email)
        `)
        .eq('status', 'disputed')
        .order('created_at', { ascending: false })

    async function resolveDispute(formData: FormData) {
        'use server'
        const orderId = formData.get('orderId') as string
        const action = formData.get('action') as string
        const amount = parseFloat(formData.get('amount') as string)
        const sellerId = formData.get('sellerId') as string

        try {
            if (action === 'release') {
                // Determine seller ID from order items if not passed, 
                // but simpler to pass data via hidden input if items is complex.
                // Assuming single item for MVP or first item's seller.
                // We need to fetch order again inside service or trust input.
                // Let's trust OrderService logic.
                await OrderService.confirmOrder(orderId, sellerId, amount)
            } else if (action === 'refund') {
                await OrderService.refundOrder(orderId)
            }
            revalidatePath('/admin/disputes')
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dispute Management</h1>

            <div className="grid gap-6">
                {disputes?.map((order: any) => (
                    <div key={order.id} className="bg-gray-900 border border-red-500/30 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-white">Order #{order.id.slice(0, 8)}</h3>
                                <p className="text-sm text-gray-400">Buyer: {order.buyer?.email}</p>
                                <p className="text-sm text-gray-400">Amount: <span className="text-green-400 font-mono">${order.total}</span></p>
                            </div>
                            <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                Disputed
                            </span>
                        </div>

                        <div className="bg-black/30 p-4 rounded-lg mb-4 text-sm text-gray-300 border border-white/5">
                            <p><strong>Reason:</strong> User reported an issue (Chat logs would appear here)</p>
                            <div className="mt-2 text-xs text-gray-500">
                                Items: {order.items?.map((i: any) => i.title).join(', ')}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <form action={resolveDispute} className="flex-1">
                                <input type="hidden" name="orderId" value={order.id} />
                                <input type="hidden" name="action" value="release" />
                                <input type="hidden" name="amount" value={order.total} />
                                <input type="hidden" name="sellerId" value={order.items?.[0]?.seller_id} />
                                <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg text-sm transition-colors">
                                    Force Release (Pay Seller)
                                </button>
                            </form>

                            <form action={resolveDispute} className="flex-1">
                                <input type="hidden" name="orderId" value={order.id} />
                                <input type="hidden" name="action" value="refund" />
                                <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg text-sm transition-colors">
                                    Force Refund (Return Funds)
                                </button>
                            </form>
                        </div>
                    </div>
                ))}

                {(!disputes || disputes.length === 0) && (
                    <div className="text-center py-12 text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                        No active disputes. Good job!
                    </div>
                )}
            </div>
        </div>
    )
}
