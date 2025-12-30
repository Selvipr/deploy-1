'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface ProductFormProps {
    lang: string
    initialData?: any
    sellerId: string
}

export default function ProductForm({ lang, initialData, sellerId }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        type: initialData?.type || 'serial_key',
        input_schema: initialData?.input_schema || { fields: [] }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const supabase = createClient()
        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            seller_id: sellerId
        }

        try {
            if (initialData?.id) {
                // Update
                const { error } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', initialData.id)
                if (error) throw error
            } else {
                // Create
                const { error } = await supabase
                    .from('products')
                    .insert(payload)
                if (error) throw error
            }

            router.push(`/${lang}/seller/products`)
            router.refresh()
        } catch (error) {
            console.error('Error saving product:', error)
            alert('Failed to save product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Product Title</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300">Description</label>
                    <textarea
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Type</label>
                        <select
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                            className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2 focus:ring-indigo-500"
                        >
                            <option value="serial_key">Serial Key</option>
                            <option value="file">File Download</option>
                            <option value="direct_api">Direct Top-Up (API)</option>
                        </select>
                    </div>
                </div>

                {/* Schema Builder Section */}
                <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-white">Required User Inputs</h3>
                        <button
                            type="button"
                            onClick={() => {
                                const currentFields = formData.input_schema?.fields || []
                                setFormData({
                                    ...formData,
                                    input_schema: {
                                        fields: [
                                            ...currentFields,
                                            { name: `field_${Date.now()}`, label: 'New Field', type: 'text', required: true }
                                        ]
                                    }
                                })
                            }}
                            className="text-sm bg-indigo-600/50 hover:bg-indigo-600 text-white px-3 py-1 rounded transition-colors"
                        >
                            + Add Field
                        </button>
                    </div>

                    <div className="space-y-4">
                        {formData.input_schema?.fields?.map((field: any, index: number) => (
                            <div key={index} className="flex gap-4 items-start bg-white/5 p-3 rounded-lg border border-white/5">
                                <div className="flex-1 space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Label (e.g. Player ID)"
                                        value={field.label}
                                        onChange={e => {
                                            const newFields = [...(formData.input_schema?.fields || [])]
                                            newFields[index].label = e.target.value
                                            // Auto-generate name from label
                                            newFields[index].name = e.target.value.toLowerCase().replace(/\s+/g, '_')
                                            setFormData({ ...formData, input_schema: { fields: newFields } })
                                        }}
                                        className="block w-full rounded bg-black/20 border-white/10 text-white text-sm px-2 py-1"
                                    />
                                    <div className="flex gap-2">
                                        <select
                                            value={field.type}
                                            onChange={e => {
                                                const newFields = [...(formData.input_schema?.fields || [])]
                                                newFields[index].type = e.target.value
                                                setFormData({ ...formData, input_schema: { fields: newFields } })
                                            }}
                                            className="block w-1/2 rounded bg-black/20 border-white/10 text-white text-xs px-2 py-1"
                                        >
                                            <option value="text">Text</option>
                                            <option value="number">Number</option>
                                            <option value="email">Email</option>
                                        </select>
                                        <label className="flex items-center gap-2 text-xs text-gray-400">
                                            <input
                                                type="checkbox"
                                                checked={field.required}
                                                onChange={e => {
                                                    const newFields = [...(formData.input_schema?.fields || [])]
                                                    newFields[index].required = e.target.checked
                                                    setFormData({ ...formData, input_schema: { fields: newFields } })
                                                }}
                                                className="rounded bg-white/10 border-white/20"
                                            />
                                            Required
                                        </label>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newFields = formData.input_schema?.fields?.filter((_: any, i: number) => i !== index)
                                        setFormData({ ...formData, input_schema: { fields: newFields } })
                                    }}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        {(!formData.input_schema?.fields || formData.input_schema.fields.length === 0) && (
                            <p className="text-sm text-gray-500 italic text-center py-2">No custom inputs defined.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Product'}
                </button>
            </div>
        </form>
    )
}
