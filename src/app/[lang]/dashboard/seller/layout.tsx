import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function SellerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || (profile.role !== 'seller' && profile.role !== 'admin')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="mb-6 text-gray-400">You must be a verified Seller to view this area.</p>
                    <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300">
                        &larr; Return to Dashboard
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden md:block">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-white">Seller Hub</h2>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <Link
                        href="/dashboard/seller"
                        className="block px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                        Overview
                    </Link>
                    <Link
                        href="/dashboard/seller/products/new"
                        className="block px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                        Add Product
                    </Link>
                    <Link
                        href="/dashboard/seller/inventory"
                        className="block px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                        Inventory
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 text-white">
                {children}
            </main>
        </div>
    )
}
