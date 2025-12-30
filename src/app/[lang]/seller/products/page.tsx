import { createClient } from '@/lib/supabase/server'
import { SellerService } from '@/services/seller.service'
import Link from 'next/link'

export default async function SellerProductsPage({
    params,
}: {
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params;
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const products = await SellerService.getMyProducts(user!.id)

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">My Products</h1>
                <Link
                    href={`/${lang}/seller/products/new`}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    + New Product
                </Link>
            </div>

            <div className="bg-[#151518] rounded-xl border border-white/5 overflow-hidden">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-white/5 text-xs uppercase text-gray-400">
                        <tr>
                            <th className="px-6 py-4">Product Name</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{product.title}</td>
                                <td className="px-6 py-4 text-green-400">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-white/10 px-2 py-1 rounded text-xs">
                                        {product.type === 'serial_key' ? 'Serial Key' : 'File'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/${lang}/seller/products/${product.id}`}
                                        className="text-indigo-400 hover:text-indigo-300 font-medium"
                                    >
                                        Manage
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        You haven't created any products yet.
                    </div>
                )}
            </div>
        </div>
    )
}
