'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Product } from '@/models/types'

type CartItem = Product & {
    cartId: string
    formData?: Record<string, any>
}

type CartContextType = {
    items: CartItem[]
    addToCart: (product: Product, formData?: Record<string, any>) => void
    removeFromCart: (cartId: string) => void
    clearCart: () => void
    cartTotal: number
    cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('shop2games_cart')
        if (saved) {
            try {
                setItems(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to parse cart', e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save to local storage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('shop2games_cart', JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addToCart = (product: Product, formData?: Record<string, any>) => {
        // Generate a random ID for the cart item
        const newItem = { ...product, cartId: crypto.randomUUID(), formData }
        setItems(prev => [...prev, newItem])
    }

    const removeFromCart = (cartId: string) => {
        setItems(prev => prev.filter(item => item.cartId !== cartId))
    }

    const clearCart = () => {
        setItems([])
    }

    const cartTotal = items.reduce((sum, item) => sum + item.price, 0)

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            clearCart,
            cartTotal,
            cartCount: items.length
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
