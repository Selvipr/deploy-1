'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ProfilePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [form, setForm] = useState({
        full_name: '',
        email: '',
        phone: '',
        wallet_balance: 0,
        role: ''
    })

    useEffect(() => {
        async function loadProfile() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single()

            if (data) {
                setForm({
                    full_name: data.full_name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    wallet_balance: data.wallet_balance || 0,
                    role: data.role || 'buyer'
                })
            }
            setLoading(false)
        }
        loadProfile()
    }, [router])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setUpdating(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { error } = await supabase
            .from('users')
            .update({
                full_name: form.full_name,
                phone: form.phone
            })
            .eq('id', user.id)

        if (error) {
            alert('Error updating profile: ' + error.message)
        } else {
            alert('Profile updated successfully!')
            router.refresh()
        }
        setUpdating(false)
    }

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white">
            {/* Header / Cover */}
            <div className="h-48 w-full bg-gradient-to-r from-indigo-900 to-purple-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute -bottom-16 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0c] to-transparent pointer-events-none" />
            </div>

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* Sidebar / User Card */}
                    <div className="flex-shrink-0 w-full md:w-80 space-y-6">
                        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                            <div className="flex flex-col items-center text-center">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px] mb-4">
                                    <div className="h-full w-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                                        <span className="text-3xl font-bold text-white uppercase">{form.full_name ? form.full_name[0] : form.email[0]}</span>
                                    </div>
                                </div>
                                <h1 className="text-xl font-bold text-white">{form.full_name || 'Anonymous User'}</h1>
                                <p className="text-sm text-gray-400 mb-4">{form.email}</p>

                                <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${form.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                        form.role === 'seller' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                            'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                    }`}>
                                    {form.role}
                                </span>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Wallet Balance</span>
                                    <span className="font-mono font-bold text-green-400">${form.wallet_balance.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Member Since</span>
                                    <span className="text-white">Jan 2025</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
                            <nav className="flex flex-col space-y-1">
                                <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 rounded-xl hover:bg-white/5 hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                    My Orders
                                </Link>
                                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 rounded-xl hover:bg-white/5 hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                    </svg>
                                    Dashboard Overview
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content / Form */}
                    <div className="flex-1 w-full">
                        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
                            <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                                        <input
                                            type="text"
                                            value={form.full_name}
                                            onChange={e => setForm({ ...form, full_name: e.target.value })}
                                            placeholder="Enter your full name"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                    <input
                                        type="text"
                                        disabled
                                        value={form.email}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
                                    />
                                    <p className="mt-2 text-xs text-gray-500">Email address cannot be changed. Contact support for assistance.</p>
                                </div>

                                <div className="pt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {updating ? 'Saving Changes...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
