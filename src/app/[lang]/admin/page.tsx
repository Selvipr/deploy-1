import { createClient } from '@/lib/supabase/server'
import { AdminService } from '@/services/admin.service'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const supabase = await createClient()

    // Fetch Analytics Data
    const usersCount = await AdminService.getRecentRegisteredUsers()
    const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true })
    const { count: disputesCount } = await supabase.from('disputes').select('*', { count: 'exact', head: true })

    const styles = {
        card: "bg-gray-900 border border-white/10 rounded-xl p-6 h-full flex flex-col justify-between",
        cardTitle: "text-gray-400 text-sm font-medium mb-4",
    }

    // Parallel fetching for performance
    const [revenueStats, statusDistribution, topProducts, recentOrders] = await Promise.all([
        AdminService.getRevenueStats(),
        AdminService.getOrderStatusDistribution(),
        AdminService.getTopProducts(),
        supabase.from('orders').select('id, total, status, created_at, users(email)').order('created_at', { ascending: false }).limit(5).then(res => res.data)
    ])

    const totalRevenue = revenueStats.reduce((sum, day) => sum + day.revenue, 0)

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-400">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a href={`/${lang}/admin/settings`} className="flex items-center gap-4 bg-gray-900 border border-white/10 p-4 rounded-xl hover:bg-white/5 transition-colors group">
                        <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 text-purple-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">System Settings</h3>
                            <p className="text-xs text-gray-500">Currency & Global Configs</p>
                        </div>
                    </a>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={styles.card}>
                    <div>
                        <h3 className={styles.cardTitle}>Total Users</h3>
                        <p className="text-3xl font-bold text-white mt-2">{usersCount || 0}</p>
                    </div>
                </div>
                <div className={styles.card}>
                    <div>
                        <h3 className={styles.cardTitle}>Total Orders</h3>
                        <p className="text-3xl font-bold text-indigo-400 mt-2">{ordersCount || 0}</p>
                    </div>
                </div>
                <div className={styles.card}>
                    <div>
                        <h3 className={styles.cardTitle}>Total Revenue (30d)</h3>
                        <p className="text-3xl font-bold text-green-400 mt-2">${totalRevenue.toFixed(2)}</p>
                    </div>
                </div>
                <div className={styles.card}>
                    <div>
                        <h3 className={styles.cardTitle}>Active Disputes</h3>
                        <p className="text-3xl font-bold text-red-400 mt-2">{disputesCount || 0}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart (Simple Bar Visualization) */}
                <div className="bg-gray-900 border border-white/10 rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-6">Revenue - Last 30 Days</h3>
                    <div className="flex items-end space-x-2 h-64 mt-4 overflow-x-auto pb-2">
                        {revenueStats.length > 0 ? revenueStats.map((stat, i) => {
                            const maxRevenue = Math.max(...revenueStats.map(s => s.revenue), 1)
                            const heightPercent = (stat.revenue / maxRevenue) * 100
                            return (
                                <div key={i} className="flex flex-col items-center flex-1 min-w-[20px] group relative">
                                    <div
                                        className="w-full bg-indigo-500/80 hover:bg-indigo-400 rounded-t-sm transition-all"
                                        style={{ height: `${heightPercent}%` }}
                                    />
                                    <span className="text-[10px] text-gray-500 mt-2 rotate-[-45deg] origin-top-left translate-y-2 whitespace-nowrap">
                                        {stat.date.split('/')[0]}/{stat.date.split('/')[1]}
                                    </span>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-xs p-2 rounded shadow border border-gray-700 z-10 whitespace-nowrap">
                                        {stat.date}: ${stat.revenue}
                                    </div>
                                </div>
                            )
                        }) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">No revenue data</div>
                        )}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-gray-900 border border-white/10 rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-6">Top Selling Products</h3>
                    <div className="space-y-4">
                        {topProducts.map((p, i) => (
                            <div key={p.productId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 font-bold text-sm">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <p className="font-medium text-white">{p.title}</p>
                                        <p className="text-xs text-gray-400">{p.soldCount} sold</p>
                                    </div>
                                </div>
                                <p className="font-bold text-green-400">${p.revenue}</p>
                            </div>
                        ))}
                        {topProducts.length === 0 && (
                            <p className="text-gray-500 text-center py-8">No sales yet.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Status Distribution */}
                <div className="bg-gray-900 border border-white/10 rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-4">Order Status</h3>
                    <div className="space-y-4 mt-6">
                        {statusDistribution.map(stat => (
                            <div key={stat.status} className="">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="capitalize text-gray-300">{stat.status}</span>
                                    <span className="font-mono text-gray-400">{stat.count}</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${stat.status === 'completed' ? 'bg-green-500' :
                                            stat.status === 'pending' || stat.status === 'escrow' ? 'bg-yellow-500' :
                                                'bg-red-500'
                                            }`}
                                        style={{ width: `${(stat.count / (ordersCount || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        {statusDistribution.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No order data.</p>
                        )}
                    </div>
                </div>

                {/* Recent Activity (Existing) */}
                <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden col-span-2">
                    <div className="px-6 py-4 border-b border-white/10">
                        <h3 className="font-semibold">Recent Global Activity</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        {recentOrders?.map((order: any) => (
                            <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div>
                                    <p className="text-sm text-white font-medium">
                                        New Order from <span className="text-indigo-400">{order.users?.email}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(order.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono text-green-400 font-bold">${order.total}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                        order.status === 'disputed' ? 'bg-red-500/10 text-red-500' :
                                            'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {(!recentOrders || recentOrders.length === 0) && (
                            <div className="px-6 py-8 text-center text-gray-500">No activity yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
