'use client'

import { useState } from 'react'
import { addFunds } from '@/actions/wallet'
import { useRouter } from 'next/navigation'

export default function WalletTopUp() {
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleTopUp = async (e: React.FormEvent) => {
        e.preventDefault()
        alert('Wallet top-up is currently unavailable.')
    }

    return (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white">Top Up Wallet</h3>
            <div className="text-gray-400 text-sm">
                Top-up service is currently under maintenance. Please check back later.
            </div>
        </div>
    )
}
