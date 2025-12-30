'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function LanguageSwitcher() {
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()
    const [isOpen, setIsOpen] = useState(false)

    // Attempt to parse locale from pathname
    // Assumes pathname starts with /[locale]/...
    const currentLocale = pathname.split('/')[1] === 'ru' ? 'ru' : 'en'

    const handleLanguageChange = (locale: string) => {
        const segments = pathname.split('/')
        // Replace the second segment (the locale) if it exists and matches en/ru, otherwise prepend
        if (segments[1] === 'en' || segments[1] === 'ru') {
            segments[1] = locale
        } else {
            segments.splice(1, 0, locale)
        }
        const newPath = segments.join('/')

        startTransition(() => {
            router.push(newPath)
            router.refresh()
            setIsOpen(false)
        })
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
                <span className="uppercase">{currentLocale}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.546-3.131 1.566-4.375m15.686 0A8.959 8.959 0 0121 12" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-[#1a1a1c] border border-white/10 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <button
                            onClick={() => handleLanguageChange('en')}
                            className={`block w-full px-4 py-2 text-left text-sm ${currentLocale === 'en' ? 'text-indigo-400 bg-white/5' : 'text-gray-300 hover:bg-white/5'}`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => handleLanguageChange('ru')}
                            className={`block w-full px-4 py-2 text-left text-sm ${currentLocale === 'ru' ? 'text-indigo-400 bg-white/5' : 'text-gray-300 hover:bg-white/5'}`}
                        >
                            Русский
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
