import { createClient } from '@/lib/supabase/server'

export type RevenueStat = {
    date: string
    revenue: number
}

export type OrderStatusDistribution = {
    status: string
    count: number
}

export type TopProduct = {
    productId: string
    title: string
    soldCount: number
    revenue: number
}

export class AdminService {

    // Get Revenue Stats (grouped by day for the last 30 days)
    static async getRevenueStats(): Promise<RevenueStat[]> {
        const supabase = await createClient()

        // Fetch completed orders from last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { data: orders, error } = await supabase
            .from('orders')
            .select('total, created_at')
            .eq('status', 'completed') // Only count completed sales
            .gte('created_at', thirtyDaysAgo.toISOString())
            .order('created_at', { ascending: true })

        if (error) throw error

        // Aggregate by date
        const revenueMap: { [key: string]: number } = {}

        orders.forEach((order: any) => {
            const date = new Date(order.created_at).toLocaleDateString()
            revenueMap[date] = (revenueMap[date] || 0) + order.total
        })

        return Object.keys(revenueMap).map(date => ({
            date,
            revenue: revenueMap[date]
        }))
    }

    // Get Order Status Distribution
    static async getOrderStatusDistribution(): Promise<OrderStatusDistribution[]> {
        const supabase = await createClient()
        // Use select with count, but since we need grouping, we might just fetch all for now (assuming low scale)
        // Or use .rpc if we had one. Raw SQL via RPC is best but we stick to JS aggregation for MVP.

        const { data: orders, error } = await supabase
            .from('orders')
            .select('status')

        if (error) throw error

        const statusMap: { [key: string]: number } = {}
        orders.forEach((order: any) => {
            statusMap[order.status] = (statusMap[order.status] || 0) + 1
        })

        return Object.keys(statusMap).map(status => ({
            status,
            count: statusMap[status]
        }))
    }

    // Get Top Selling Products
    static async getTopProducts(): Promise<TopProduct[]> {
        const supabase = await createClient()

        // Option 1: Query 'inventory' where status = 'sold' (or check order connections)
        // Option 2: Query 'orders' and parse 'items' JSONB column.
        // Let's use 'orders' as it contains price at time of sale and valid sales.

        const { data: orders, error } = await supabase
            .from('orders')
            .select('items')
            .eq('status', 'completed')

        if (error) throw error

        const productStats: { [key: string]: TopProduct } = {}

        orders.forEach((order: any) => {
            const items = order.items as any[]
            if (Array.isArray(items)) {
                items.forEach(item => {
                    if (!productStats[item.id]) {
                        productStats[item.id] = {
                            productId: item.id,
                            title: item.title,
                            soldCount: 0,
                            revenue: 0
                        }
                    }
                    productStats[item.id].soldCount += 1
                    productStats[item.id].revenue += item.price
                })
            }
        })

        return Object.values(productStats)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5) // Top 5
    }

    static async getRecentRegisteredUsers() {
        // Since we don't have a 'users' table with 'created_at' purely reliable in public schema (it uses auth.users),
        // we use public.users created_at (which is synced).
        const supabase = await createClient()
        const { count } = await supabase.from('users').select('*', { count: 'exact', head: true })

        // Return simple count for now, maybe growth later if needed
        return count
    }

    // System Settings
    static async getSystemSettings(key: string) {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('system_settings')
            .select('value')
            .eq('key', key)
            .single()

        if (error) return null // return null if not found
        return data?.value || null
    }

    static async updateSystemSetting(key: string, value: string) {
        const supabase = await createClient()
        const { error } = await supabase
            .from('system_settings')
            .upsert({ key, value })

        if (error) throw error
        return true
    }
}
