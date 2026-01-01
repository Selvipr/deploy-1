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
        const val = parseFloat(amount)
        if (isNaN(val) || val <= 0) {
            alert('Please enter a valid positive amount')
            return
        }

        setLoading(true)
        try {
            // 1. Create Order on Server
            const res = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: val, currency: 'USD' })
            })

            if (!res.ok) throw new Error('Failed to create order')
            const order = await res.json()

            // 2. Load Razorpay SDK
            const loadScript = (src: string) => {
                return new Promise((resolve) => {
                    const script = document.createElement('script')
                    script.src = src
                    script.onload = () => resolve(true)
                    script.onerror = () => resolve(false)
                    document.body.appendChild(script)
                })
            }

            const resLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
            if (!resLoaded) {
                alert('Razorpay SDK failed to load')
                return
            }

            // 3. Open Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Shop2Games",
                description: "Wallet Top Up",
                order_id: order.id,
                handler: async function (response: any) {
                    // 4. Verify Payment on Server
                    const verifyRes = await fetch('/api/razorpay/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            orderCreationId: order.id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            amount: val
                        })
                    })

                    if (verifyRes.ok) {
                        alert('Payment Successful! Funds added.')
                        setAmount('')
                        router.refresh()
                    } else {
                        alert('Payment Verification Failed')
                    }
                },
                theme: {
                    color: "#4f46e5" // Indigo-600 logic
                }
            }

            const paymentObject = new (window as any).Razorpay(options)
            paymentObject.open()

        } catch (error) {
            alert('Error processing payment: ' + (error as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white">Top Up Wallet</h3>
            <form onSubmit={handleTopUp} className="flex flex-col gap-3">
                <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Amount ($)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm"
                >
                    {loading ? 'Processing...' : 'Add Funds'}
                </button>
            </form>
            <p className="text-xs text-gray-500">
                Mock Payment: This will immediately add funds to your demo account.
            </p>
        </div>
    )
}
