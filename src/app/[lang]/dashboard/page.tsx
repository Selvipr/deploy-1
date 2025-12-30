import { createClient } from '@/lib/supabase/server'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { OrderService } from '@/services/order.service'

export default async function DashboardPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    /* 
   * Fetch user profile from public table to verify the trigger worked 
   * and to get role/balance information.
   */
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    const orders = await OrderService.getUserOrders(user.id)
    const recentOrders = orders.slice(0, 5)

    // Calculate stats
    const totalSpent = orders.reduce((sum, order) => sum + (order.status === 'completed' ? order.total : 0), 0)
    const activeOrders = orders.filter(o => o.status === 'escrow' || o.status === 'pending').length

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <header className="bg-white shadow dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <form action="/auth/signout" method="post">
                        <button className="text-sm font-medium text-red-600 hover:text-red-500">
                            Sign out
                        </button>
                    </form>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Welcome, {profile?.email || user.email}
                            </h2>
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="rounded-md bg-indigo-50 p-4 dark:bg-indigo-900/20">
                                    <div className="text-sm font-medium text-indigo-500 dark:text-indigo-400">Role</div>
                                    <div className="mt-1 text-2xl font-semibold text-indigo-700 dark:text-indigo-300 capitalize">
                                        {profile?.role || 'Guest'}
                                    </div>
                                </div>
                                <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                                    <div className="text-sm font-medium text-green-500 dark:text-green-400">Wallet</div>
                                    <div className="mt-1 text-2xl font-semibold text-green-700 dark:text-green-300">
                                        ${profile?.wallet_balance || '0.00'}
                                    </div>
                                </div>
                                <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                                    <div className="text-sm font-medium text-blue-500 dark:text-blue-400">UID</div>
                                    <div className="mt-1 text-xs font-mono text-blue-700 dark:text-blue-300 truncate">
                                        {user.id}
                                    </div>
                                </div>
                                <div className="rounded-md bg-purple-50 p-4 dark:bg-purple-900/20">
                                    <div className="text-sm font-medium text-purple-500 dark:text-purple-400">Total Spent</div>
                                    <div className="mt-1 text-2xl font-semibold text-purple-700 dark:text-purple-300">
                                        ${totalSpent.toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-4">
                                <Link
                                    href="/shop"
                                    className="flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                >
                                    Browse Shop
                                </Link>
                                <Link
                                    href="/profile"
                                    className="flex items-center justify-center rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                                >
                                    Edit Profile
                                </Link>
                                {profile?.role === 'seller' && (
                                    <Link
                                        href="/dashboard/seller"
                                        className="flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                                    >
                                        Seller Hub
                                    </Link>
                                )}
                                {profile?.role === 'admin' && (
                                    <Link
                                        href={`/${lang}/admin`}
                                        className="flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                            </div>

                            <div className="mt-10">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                                    Recent Orders
                                </h3>
                                {recentOrders.length > 0 ? (
                                    <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                                        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {recentOrders.map((order) => (
                                                <li key={order.id} className="px-6 py-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-sm text-indigo-600 dark:text-indigo-400 truncate">
                                                                Order #{order.id.slice(0, 8)}
                                                            </p>
                                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                                {new Date(order.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                                order.status === 'escrow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                                ${order.total}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="bg-gray-50 px-6 py-3 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                                            <Link href="/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                                View all orders &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No orders yet.</p>
                                )}
                            </div>

                            {!profile && (
                                <div className="mt-6 rounded-md bg-yellow-50 p-4 text-sm text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                    Note: Your public profile was not found. This might be due to a database trigger delay or error.
                                </div>
                            )}

                            <p className="mt-6 text-gray-600 dark:text-gray-400">
                                Start by browsing products or managing your inventory.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
