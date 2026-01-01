'use client'

import { useState } from 'react'

type EscrowActionsProps = {
    onConfirm: () => Promise<void>
    onDispute: () => Promise<void>
    dict: {
        confirmReceived: string
        disputeTransaction: string
        confirming: string
        processing: string
    }
}

export default function EscrowActions({ onConfirm, onDispute, dict }: EscrowActionsProps) {
    const [loading, setLoading] = useState(false)

    const handleConfirm = async () => {
        if (!confirm('Are you sure you have received the goods? This will release funds to the seller.')) return

        setLoading(true)
        try {
            await onConfirm()
        } catch (e) {
            alert('Error: ' + (e as Error).message)
            setLoading(false)
        }
    }

    const handleDispute = async () => {
        if (!confirm('Are you sure you want to dispute this order? This will freeze funds and alert admin.')) return

        setLoading(true)
        try {
            await onDispute()
        } catch (e) {
            alert('Error: ' + (e as Error).message)
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors text-center"
            >
                {loading ? dict.confirming : dict.confirmReceived}
            </button>
            <button
                onClick={handleDispute}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors text-center"
            >
                {loading ? dict.processing : dict.disputeTransaction}
            </button>
        </div>
    )
}
