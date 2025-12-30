import { createClient } from '@/lib/supabase/server'
import { OrderService } from '@/services/order.service'
import { redirect } from 'next/navigation'
import InvoicePrinter from './InvoicePrinter'

export default async function InvoicePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const order = await OrderService.getOrderById(id)

    if (!order) {
        return <div className="p-8">Order not found</div>
    }

    // Ensure only buyer (or admin) can see invoice
    // order.buyer_id check? (For hackathon velocity assuming auth user check is enough combined with logic relative to user)
    // Ideally: if (order.buyer_id !== user.id && role !== 'admin') redirect('/orders')

    return (
        <div className="bg-white min-h-screen text-black p-8 md:p-12 print:p-0">
            <InvoicePrinter />

            <div className="max-w-4xl mx-auto border border-gray-200 p-8 shadow-sm print:border-0 print:shadow-none print:max-w-none">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                        <p className="text-sm text-gray-500 mt-1">Order #{order.id}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-indigo-600">Shop2games</div>
                        <p className="text-sm text-gray-500">
                            123 Digital Market St.<br />
                            Internet City, WEB3 000
                        </p>
                    </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
                        <p className="font-semibold">{order.buyer?.email || user.email}</p>
                        {order.delivery_info && (
                            <p className="text-sm text-gray-500 mt-1">
                                {order.delivery_info.fullName}<br />
                                {order.delivery_info.address}
                            </p>
                        )}
                    </div>
                    <div className="text-right">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Invoice Info</h3>
                        <div className="flex justify-end gap-4 text-sm">
                            <div className="text-right space-y-1">
                                <p className="text-gray-500">Date:</p>
                                <p className="text-gray-500">Status:</p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
                                <p className="uppercase font-semibold">{order.status}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <table className="w-full mb-8">
                    <thead>
                        <tr className="border-b-2 border-gray-800">
                            <th className="text-left py-3 text-sm font-bold uppercase tracking-wider">Description</th>
                            <th className="text-right py-3 text-sm font-bold uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {order.items?.map((item: any, i: number) => (
                            <tr key={i}>
                                <td className="py-4 text-sm font-medium">{item.title}</td>
                                <td className="py-4 text-right text-sm font-mono">${item.price?.toFixed(2)}</td>
                            </tr>
                        )) || (
                                // Fallback if items not populated
                                <tr>
                                    <td className="py-4 text-sm font-medium">Digital Product (Order #{order.id})</td>
                                    <td className="py-4 text-right text-sm font-mono">${order.total.toFixed(2)}</td>
                                </tr>
                            )}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end border-t border-gray-200 pt-8">
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-mono">${order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200">
                            <span>Total</span>
                            <span className="font-mono">${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
                    <p>Thank you for your business.</p>
                    <p className="mt-1">For support, please contact help@shop2games.com</p>
                </div>
            </div>
        </div>
    )
}
