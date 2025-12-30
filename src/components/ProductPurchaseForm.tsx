'use client'

import { useState } from 'react'
import { Product } from '@/models/types'
import { useCart } from '@/context/CartContext'
import AdaptiveForm from './AdaptiveForm'
import Link from 'next/link'

interface ProductPurchaseFormProps {
    product: Product
    lang: string
}

export default function ProductPurchaseForm({ product, lang }: ProductPurchaseFormProps) {
    const { addToCart } = useCart()
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [added, setAdded] = useState(false)

    const handleFormChange = (data: Record<string, any>) => {
        setFormData(data)
    }

    const handleAddToCart = () => {
        // Validate required fields
        if (product.input_schema?.fields) {
            for (const field of product.input_schema.fields) {
                if (field.required && !formData[field.name]) {
                    alert(`Please fill in ${field.label}`)
                    return
                }
            }
        }

        addToCart(product, formData)
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div className="rounded-2xl bg-white/5 p-8 border border-white/10 shadow-2xl backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Purchase Details</h2>

            {product.input_schema && (
                <div className="mb-6 pb-6 border-b border-white/10">
                    <AdaptiveForm
                        schema={product.input_schema}
                        onChange={handleFormChange}
                    />
                </div>
            )}

            <div className="my-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Total Price</span>
                    <span className="text-2xl font-bold text-white">${product.price > 0 ? product.price : ' --'}</span>
                </div>

                {added ? (
                    <Link
                        href={`/${lang}/cart`}
                        className="block w-full text-center rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors"
                    >
                        Added to Cart! View Cart
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                    >
                        Add to Cart
                    </button>
                )}
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
                Secure transaction via Shop2games Escrow
            </p>
        </div>
    )
}
