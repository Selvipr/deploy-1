'use client'

import { useCurrency } from '@/context/CurrencyContext'
import { useState } from 'react'

export default function CurrencySwitcher() {
    const { currency, setCurrency } = useCurrency()
    const [isOpen, setIsOpen] = useState(false)

    const toggleCurrency = (newCurrency: 'USD' | 'RUB') => {
        setCurrency(newCurrency)
        setIsOpen(false)
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
                <span>{currency}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-24 origin-top-right rounded-md bg-[#1a1a1c] border border-white/10 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                        <button
                            onClick={() => toggleCurrency('USD')}
                            className={`block w-full px-4 py-2 text-left text-sm ${currency === 'USD' ? 'text-indigo-400 bg-white/5' : 'text-gray-300 hover:bg-white/5'}`}
                        >
                            USD ($)
                        </button>
                        <button
                            onClick={() => toggleCurrency('RUB')}
                            className={`block w-full px-4 py-2 text-left text-sm ${currency === 'RUB' ? 'text-indigo-400 bg-white/5' : 'text-gray-300 hover:bg-white/5'}`}
                        >
                            RUB (₽)
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
