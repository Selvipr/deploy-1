import { createClient } from '@/lib/supabase/server'
import { SellerService } from '@/services/seller.service'

export default async function SellerDashboard({
    params,
}: {
    params: Promise<{ lang: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch stats (simplified for now)
    const products = await SellerService.getMyProducts(user!.id)
    const { count: totalOrders } = await supabase
        .from('order_items')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', user!.id)

    const revenue = 1250.00 // Placeholder - would need real aggregation

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#151518] p-6 rounded-xl border border-white/5">
                    <h3 className="text-gray-400 text-sm font-medium">Total Revenue</h3>
                    <p className="text-2xl font-bold text-white mt-2">${revenue.toFixed(2)}</p>
                </div>
                <div className="bg-[#151518] p-6 rounded-xl border border-white/5">
                    <h3 className="text-gray-400 text-sm font-medium">Total Sales</h3>
                    <p className="text-2xl font-bold text-white mt-2">{totalOrders || 0}</p>
                </div>
                <div className="bg-[#151518] p-6 rounded-xl border border-white/5">
                    <h3 className="text-gray-400 text-sm font-medium">Active Products</h3>
                    <p className="text-2xl font-bold text-white mt-2">{products.length}</p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-white mb-4">Recent Sales</h2>
                <div className="bg-[#151518] rounded-xl border border-white/5 p-8 text-center text-gray-500">
                    No recent sales to display.
                </div>
            </div>
        </div>
    )
}
