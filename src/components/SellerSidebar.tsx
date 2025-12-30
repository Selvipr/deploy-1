import Link from 'next/link'

interface SidebarProps {
    lang: string
}

export default function SellerSidebar({ lang }: SidebarProps) {
    return (
        <aside className="w-64 h-screen fixed left-0 top-0 pt-20 bg-[#0a0a0c] border-r border-white/10 z-0">
            <div className="px-6 py-4">
                <h2 className="text-xl font-bold text-white mb-6">Seller Hub</h2>
                <nav className="space-y-2">
                    <Link
                        href={`/${lang}/seller`}
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href={`/${lang}/seller/products`}
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <span>My Products</span>
                    </Link>
                    <Link
                        href={`/${lang}/seller/products/new`}
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <span>+ Add Product</span>
                    </Link>
                </nav>
            </div>
        </aside>
    )
}
