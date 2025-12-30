import { createClient } from '@/lib/supabase/server'
import { OrderService } from '@/services/order.service'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import { getDictionary } from '@/lib/dictionary'

export default async function OrdersPage({
    params,
}: {
    params: Promise<{ lang: 'en' | 'ru' }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/${lang}/login`)
    }

    const orders = await OrderService.getUserOrders(user.id)

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-8">{dict.orders.title}</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-24 rounded-2xl bg-white/5 border border-white/10">
                        <h2 className="text-xl font-semibold text-white">{dict.orders.noOrders}</h2>
                        <p className="mt-2 text-gray-400">{dict.orders.noOrdersDesc}</p>
                        <div className="mt-6">
                            <a href={`/${lang}/shop`} className="text-indigo-400 hover:text-indigo-300 font-medium">{dict.orders.browseShop} &rarr;</a>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="rounded-xl bg-white/5 border border-white/10 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div>
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-lg font-bold text-white">{dict.orders.orderNumber}{order.id.substring(0, 8)}</h3>
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${order.status === 'completed' ? 'bg-green-400/10 text-green-400 ring-green-400/20' :
                                            order.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400 ring-yellow-400/20' :
                                                'bg-red-400/10 text-red-400 ring-red-400/20'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-400">
                                        {dict.orders.date}: {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="mt-4 sm:mt-0 text-right">
                                    <p className="text-2xl font-bold text-white">${order.total}</p>
                                    <Link href={`/${lang}/orders/${order.id}`} className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 inline-block">
                                        {dict.orders.viewDetails}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
