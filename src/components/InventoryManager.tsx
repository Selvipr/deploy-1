'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { SellerService } from '@/services/seller.service'

// We need to move this service call to client-side compatible way or use Server Actions.
// Since SellerService uses 'createClient' from server/client interchangeably in our setup (usually), 
// but 'createClient' in 'seller.service.ts' imports from '@/lib/supabase/client'? 
// Wait, previous file view showed: import { createClient } from '@/lib/supabase/client' in SellerService?
// Let me double check usage. 
// Actually, standard pattern: Service is usually Server-Side, but some helper might be shared.
// For Client Component, it's safer to use direct Supabase client or a unified method.
// Let's just use direct Supabase calls here for 'fetch' to avoid importing Server modules if any.
// BUT, if SellerService is all 'client' compatible, we can use it.
// Let's stick to direct supabase for 'fetch' in useEffect to be safe, or Server Actions.
// For now, I will use direct fetch inside useEffect.

interface InventoryItem {
    id: string
    secret_data: string
    status: 'available' | 'locked' | 'sold'
    created_at: string
}

export default function InventoryManager({ productId, currentCount }: { productId: string, currentCount: number }) {
    const [keys, setKeys] = useState('')
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState<InventoryItem[]>([])
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const router = useRouter()

    const [activeTab, setActiveTab] = useState<'keys' | 'file'>('keys')
    const [file, setFile] = useState<File | null>(null)

    // Fetch Inventory
    useEffect(() => {
        const fetchInventory = async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('inventory')
                .select('*')
                .eq('product_id', productId)
                .order('created_at', { ascending: false })

            if (data) setItems(data as any)
        }
        fetchInventory()
    }, [productId, refreshTrigger])

    const handleAddKeys = async () => {
        if (!keys.trim()) return
        setLoading(true)

        const keyList = keys.split('\n').filter(k => k.trim().length > 0)

        try {
            await SellerService.addInventoryKeys(productId, keyList)
            setKeys('')
            alert(`Successfully added ${keyList.length} keys`)
            setRefreshTrigger(prev => prev + 1)
            router.refresh()
        } catch (error: any) {
            console.error(error)
            alert('Failed to add inventory: ' + (error.message || JSON.stringify(error)))
        } finally {
            setLoading(false)
        }
    }

    const handleUploadFile = async () => {
        if (!file) return
        setLoading(true)

        try {
            // 1. Upload to Storage
            const supabase = createClient()
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${productId}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('digital-products')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 2. Add to Inventory DB
            await SellerService.addInventoryFile(productId, filePath, file.name)

            setFile(null)
            alert('File uploaded and added to inventory!')
            setRefreshTrigger(prev => prev + 1)
            router.refresh()

        } catch (error: any) {
            console.error(error)
            alert('Upload failed: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return
        try {
            await SellerService.deleteInventoryItem(id)
            setRefreshTrigger(prev => prev + 1)
            router.refresh()
        } catch (e) {
            alert('Failed to delete. It might be sold or locked.')
        }
    }

    return (
        <div className="bg-[#151518] rounded-xl border border-white/5 p-6 mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Inventory Management</h2>

            <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/5 px-4 py-2 rounded-lg">
                    <span className="text-gray-400 text-sm">Real-time Stock</span>
                    <p className="text-2xl font-bold text-green-400">{items.filter(i => i.status === 'available').length}</p>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-lg">
                    <span className="text-gray-400 text-sm">Total Sold</span>
                    <p className="text-2xl font-bold text-indigo-400">{items.filter(i => i.status === 'sold' || i.status === 'locked').length}</p>
                </div>
            </div>

            {/* Add Section */}
            <div className="mb-8">
                <div className="flex border-b border-white/10 mb-4">
                    <button
                        onClick={() => setActiveTab('keys')}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'keys' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                    >
                        Serial Keys
                    </button>
                    <button
                        onClick={() => setActiveTab('file')}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'file' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                    >
                        File Upload
                    </button>
                </div>

                {activeTab === 'keys' ? (
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-300">Add New Keys (One per line)</label>
                        <textarea
                            rows={3}
                            placeholder="Key-1234-ABCD&#10;Key-5678-EFGH"
                            value={keys}
                            onChange={e => setKeys(e.target.value)}
                            className="block w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2 font-mono text-sm focus:ring-indigo-500"
                        />
                        <button
                            onClick={handleAddKeys}
                            disabled={loading || !keys.trim()}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Adding Keys...' : 'Add Keys'}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center bg-white/5 hover:bg-white/10 transition-colors">
                            <input
                                type="file"
                                onChange={e => setFile(e.target.files?.[0] || null)}
                                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                            />
                            <p className="mt-2 text-xs text-gray-500">Supports zip, pdf, rar, etc.</p>
                        </div>
                        <button
                            onClick={handleUploadFile}
                            disabled={loading || !file}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Uploading...' : 'Upload & Add Stock'}
                        </button>
                    </div>
                )}
            </div>

            {/* List Section */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Current Inventory List</h3>
                <div className="max-h-60 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className={`w-2 h-2 rounded-full ${item.status === 'available' ? 'bg-green-500' :
                                    item.status === 'sold' ? 'bg-indigo-500' : 'bg-yellow-500'
                                    }`} />
                                <div className="flex flex-col">
                                    <code className="text-sm text-gray-300 font-mono truncate max-w-[200px] sm:max-w-md">
                                        {item.secret_data}
                                    </code>
                                    {/* Try to detect if it's a file by extension or some meta. For now, heuristics. */}
                                    {item.secret_data.includes('/') && <span className="text-[10px] text-gray-500">FILE PATH</span>}
                                </div>
                                <span className="text-xs text-gray-500 uppercase px-2 py-0.5 rounded bg-black/30 border border-white/5">
                                    {item.status}
                                </span>
                            </div>
                            {item.status === 'available' && (
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-white/5 transition-colors"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                    {items.length === 0 && (
                        <p className="text-gray-500 text-sm text-center py-4">No inventory items found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
