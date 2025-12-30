'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Currency = 'USD' | 'RUB'

interface CurrencyContextType {
    currency: Currency
    exchangeRate: number
    setCurrency: (currency: Currency) => void
    formatPrice: (priceInUsd: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | null>(null)

export default function CurrencyProvider({
    initialRate,
    children,
}: {
    initialRate: number
    children: React.ReactNode
}) {
    const [currency, setCurrency] = useState<Currency>('USD')
    const [exchangeRate, setExchangeRate] = useState(initialRate)

    // Optionally fetch fresh rate on mount if needed, but initialRate passed from server is good for now.

    const formatPrice = (priceInUsd: number) => {
        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(priceInUsd)
        } else {
            return new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(priceInUsd * exchangeRate)
        }
    }

    return (
        <CurrencyContext.Provider value={{ currency, exchangeRate, setCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    const context = useContext(CurrencyContext)
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider')
    }
    return context
}
