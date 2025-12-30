'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'

export default function CartPage() {
    const { items, removeFromCart, cartTotal, clearCart } = useCart()

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Shopping Cart</h1>

                <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-2 lg:gap-x-16">
                    {/* Cart Items */}
                    <div>
                        {items.length === 0 ? (
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center py-12">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 mb-4">
                                    <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white">Your cart is empty</h3>
                                <p className="mt-2 text-gray-400">Add some games to get started.</p>
                                <div className="mt-6">
                                    <a href="/shop" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
                                        Browse Shop
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <ul role="list" className="divide-y divide-white/10 rounded-2xl bg-white/5 border border-white/10 px-6">
                                {items.map((item) => (
                                    <li key={item.cartId} className="flex py-6">
                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-white">
                                                    <h3>
                                                        <a href={`/shop/${item.id}`}>{item.title}</a>
                                                    </h3>
                                                    <p className="ml-4">${item.price}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-400">{item.type}</p>
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                <p className="text-gray-400">Qty 1</p>

                                                <div className="flex">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.cartId)}
                                                        className="font-medium text-indigo-400 hover:text-indigo-300"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                                <li className="py-4 text-center">
                                    <button onClick={clearCart} className="text-xs text-red-400 hover:text-red-300">
                                        Clear Cart
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="mt-10 lg:mt-0">
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                            <h2 className="text-lg font-medium text-white">Order Summary</h2>
                            <dl className="mt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <dt className="text-sm text-gray-400">Subtotal</dt>
                                    <dd className="text-sm font-medium text-white">${cartTotal.toFixed(2)}</dd>
                                </div>
                                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                    <dt className="text-base font-medium text-white">Order total</dt>
                                    <dd className="text-base font-medium text-white">${cartTotal.toFixed(2)}</dd>
                                </div>
                            </dl>

                            <div className="mt-6">
                                <Link
                                    href="/checkout"
                                    className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors ${items.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
