import { createClient } from '@/lib/supabase/server'
import { InventoryService } from '@/services/inventory.service'
import Link from 'next/link'

export default async function SellerDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const products = await InventoryService.getSellerProducts(user.id)

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Your Products</h1>
                <Link
                    href="/dashboard/seller/products/new"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md transition-colors"
                >
                    + New Product
                </Link>
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {products?.map((product: any) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{product.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">{product.type.replace('_', ' ')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">${product.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {product.inventory?.[0]?.count || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/dashboard/seller/inventory?productId=${product.id}`} className="text-indigo-400 hover:text-indigo-300">
                                        Manage Stock
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {(!products || products.length === 0) && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No products found. Create your first listing!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
