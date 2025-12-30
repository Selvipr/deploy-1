'use client'

import { createClient } from '@/lib/supabase/client'
import { getSellerProductsAction, addInventoryItemAction } from './actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function InventoryPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const preselectedProductId = searchParams.get('productId') || ''

    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const [selectedProduct, setSelectedProduct] = useState(preselectedProductId)
    const [secretData, setSecretData] = useState('')

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await getSellerProductsAction()
                setProducts(data || [])
            } catch (error) {
                console.error('Failed to load products', error)
            } finally {
                setLoading(false)
            }
        }
        loadProducts()
    }, [])

    const handleAddStock = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            // For now, treating secretData as a single item. 
            // In a real bulk tool we'd split by newlines.
            await addInventoryItemAction(selectedProduct, secretData)

            alert('Inventory added successfully!')
            setSecretData('')
            router.refresh()
        } catch (err) {
            alert('Error adding stock: ' + (err as Error).message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="p-8 text-white">Loading products...</div>

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Manage Inventory</h1>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <form onSubmit={handleAddStock} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Select Product</label>
                        <select
                            required
                            className="mt-1 block w-full rounded-md bg-gray-900 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                        >
                            <option value="">-- Choose a product --</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.title} ({p.type})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Secret Data (Key / URL)
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                            This data will be encrypted and only revealed to the buyer after purchase.
                        </p>
                        <textarea
                            required
                            rows={4}
                            className="mt-1 block w-full rounded-md bg-gray-900 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 font-mono"
                            value={secretData}
                            onChange={(e) => setSecretData(e.target.value)}
                            placeholder="XXXX-XXXX-XXXX-XXXX or https://..."
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={submitting || !selectedProduct}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {submitting ? 'Adding...' : 'Add to Inventory'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
