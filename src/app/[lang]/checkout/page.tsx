'use client'

import { useCart } from '@/context/CartContext'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'

import { createBatchOrder } from '@/actions/checkout'

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart()
    const router = useRouter()
    const params = useParams()
    const lang = params?.lang ?? 'en'
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Form State
    const [paymentMethod, setPaymentMethod] = useState('credit_card')
    const [contactEmail, setContactEmail] = useState('')
    const [deliveryNotes, setDeliveryNotes] = useState('')

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (!contactEmail) {
            setError('Contact email is required')
            setLoading(false)
            return
        }

        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push(`/${lang}/login?next=/${lang}/checkout`)
                return
            }

            // createBatchOrder is now statically imported

            if (paymentMethod === 'razorpay') {
                // 1. Create Order on Server (Razorpay)
                const res = await fetch('/api/razorpay/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: cartTotal, currency: 'USD' })
                })

                if (!res.ok) throw new Error('Failed to create Razorpay order')
                const order = await res.json()

                // 2. Load SDK
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
                    throw new Error('Razorpay SDK failed to load')
                }

                // 3. Open Checkout
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: order.amount,
                    currency: order.currency,
                    name: "Shop2Games",
                    description: "Order Checkout",
                    order_id: order.id,
                    handler: async function (response: any) {
                        try {
                            // 4. Submit Order to our Backend with Signature
                            const result = await createBatchOrder({
                                items,
                                paymentMethod: 'razorpay',
                                contactEmail,
                                deliveryNotes,
                                razorpayData: {
                                    orderId: order.id,
                                    paymentId: response.razorpay_payment_id,
                                    signature: response.razorpay_signature
                                }
                            })

                            if (result.error) throw new Error(result.error)

                            clearCart()
                            router.push(`/${lang}/orders/${result.orderId}`)
                        } catch (finalErr: any) {
                            console.error(finalErr)
                            alert('Order creation failed: ' + finalErr.message)
                            setLoading(false)
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setLoading(false)
                        }
                    },
                    theme: { color: "#4f46e5" }
                }

                const paymentObject = new (window as any).Razorpay(options)
                paymentObject.open()
                return // Wait for handler
            }

            // Normal or Wallet Checkout
            const result = await createBatchOrder({
                items,
                paymentMethod,
                contactEmail,
                deliveryNotes
            })

            if (result.error) {
                throw new Error(result.error)
            }

            clearCart()
            router.push(`/${lang}/orders/${result.orderId}`)

        } catch (err) {
            console.error(err)
            setError((err as Error).message)
            setLoading(false)
        }
    }

    if (items.length === 0) {
        return <div className="p-8 text-white text-center">Your cart is empty.</div>
    }

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white">
            <div className="mx-auto max-w-4xl px-4 py-16">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Form */}
                    <div>
                        <form onSubmit={handleCheckout} className="space-y-8">

                            {/* Contact Info */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={contactEmail}
                                        onChange={e => setContactEmail(e.target.value)}
                                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/20 text-white px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="you@example.com"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">We'll send your receipt and keys here.</p>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Delivery Notes (Optional)</label>
                                    <textarea
                                        id="notes"
                                        value={deliveryNotes}
                                        onChange={e => setDeliveryNotes(e.target.value)}
                                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/20 text-white px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Any special instructions..."
                                        rows={2}
                                    />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            id="card"
                                            name="payment-method"
                                            type="radio"
                                            checked={paymentMethod === 'credit_card'}
                                            onChange={() => setPaymentMethod('credit_card')}
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-300">Credit Card</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="crypto"
                                            name="payment-method"
                                            type="radio"
                                            checked={paymentMethod === 'crypto'}
                                            onChange={() => setPaymentMethod('crypto')}
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="crypto" className="ml-3 block text-sm font-medium text-gray-300">Cryptocurrency</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="wallet"
                                            name="payment-method"
                                            type="radio"
                                            checked={paymentMethod === 'wallet'}
                                            onChange={() => setPaymentMethod('wallet')}
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="wallet" className="ml-3 block text-sm font-medium text-gray-300">Platform Wallet</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="razorpay"
                                            name="payment-method"
                                            type="radio"
                                            checked={paymentMethod === 'razorpay'}
                                            onChange={() => setPaymentMethod('razorpay')}
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="razorpay" className="ml-3 block text-sm font-medium text-gray-300">Razorpay (Cards/UPI)</label>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
                            </button>

                        </form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 sticky top-24">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <ul className="divide-y divide-white/10 font-medium mb-4">
                                {items.map(item => (
                                    <li key={item.cartId} className="flex justify-between py-3">
                                        <span className="text-gray-300">{item.title}</span>
                                        <span>${item.price}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold text-green-400">
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <p className="text-center text-gray-500 text-xs mt-6">
                                By confirming, you agree to our Terms of Service. Funds will be held in escrow until delivery is confirmed.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
