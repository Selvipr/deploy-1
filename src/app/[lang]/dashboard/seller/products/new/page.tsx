'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '', // use string for input, parse later
        type: 'serial_key',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) throw new Error("Not authenticated")

            const { error } = await supabase
                .from('products')
                .insert({
                    title: form.title,
                    description: form.description,
                    price: parseFloat(form.price),
                    type: form.type,
                    seller_id: user.id
                })

            if (error) throw error

            router.push('/dashboard/seller')
            router.refresh()
        } catch (err) {
            alert('Error creating product: ' + (err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Product</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Title</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md bg-gray-900 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300">Description</label>
                    <textarea
                        required
                        className="mt-1 block w-full rounded-md bg-gray-900 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                        rows={3}
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="mt-1 block w-full rounded-md bg-gray-900 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                            value={form.price}
                            onChange={e => setForm({ ...form, price: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Type</label>
                        <select
                            className="mt-1 block w-full rounded-md bg-gray-900 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                            value={form.type}
                            onChange={e => setForm({ ...form, type: e.target.value })}
                        >
                            <option value="serial_key">Serial Key</option>
                            <option value="file">File Download</option>
                            <option value="direct_api">Direct API</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Listing'}
                    </button>
                </div>
            </form>
        </div>
    )
}
