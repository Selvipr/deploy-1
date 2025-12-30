'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useCurrency } from '@/context/CurrencyContext'
import { Product } from '@/models/types'

export default function GameCard({ product }: { product: Product }) {
    const { addToCart } = useCart()
    const { formatPrice } = useCurrency()

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(product)
        alert('Added to cart!') // Simple feedback for now
    }

    // Generate a placeholder image based on title (in a real app, this would be a real URL)
    // For now, using a gradient placeholder.
    return (
        <div className="group relative block overflow-hidden rounded-xl bg-gray-900 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20">
            <Link href={`/shop/${product.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {product.title}</span>
            </Link>

            {/* Image Placeholder */}
            <div className="aspect-[4/5] w-full overflow-hidden bg-gray-800">
                <div className="h-full w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 object-cover transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white/10 select-none uppercase tracking-widest">{product.title.substring(0, 2)}</span>
                </div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pointer-events-none">
                <div className="translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="text-xl font-bold text-white">{product.title}</h3>
                    <p className="mt-1 text-sm text-gray-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {product.type === 'direct_api' ? 'Instant Top-Up' : 'digital Key'}
                    </p>
                    <div className="mt-2 text-green-400 font-bold">
                        {formatPrice(product.price)}
                    </div>
                </div>
            </div>

            {/* Actions (Above Link) */}
            <div className="absolute bottom-4 right-4 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                <button
                    onClick={handleAddToCart}
                    className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <title>Add</title>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    Add
                </button>
            </div>

            {/* Type Badge */}
            <div className="absolute top-4 right-4 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md pointer-events-none">
                {product.type === 'direct_api' ? 'Top-Up' : 'Key'}
            </div>
        </div>
    )
}
