'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BottomNavProps {
    lang: string
}

export default function BottomNav({ lang }: BottomNavProps) {
    const pathname = usePathname()

    const isActive = (path: string) => {
        return pathname === `/${lang}${path}` || (path === '' && pathname === `/${lang}`)
    }

    return (
        <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-[#0a0a0c]/80 backdrop-blur-lg border-t border-white/10">
            <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
                {/* Home */}
                <Link
                    href={`/${lang}`}
                    className={`inline-flex flex-col items-center justify-center px-5 group ${isActive('') ? 'text-indigo-500' : 'text-gray-400 hover:text-gray-200'
                        }`}
                >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-xs">Home</span>
                </Link>

                {/* Shop */}
                <Link
                    href={`/${lang}/shop`}
                    className={`inline-flex flex-col items-center justify-center px-5 group ${isActive('/shop') ? 'text-indigo-500' : 'text-gray-400 hover:text-gray-200'
                        }`}
                >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="text-xs">Shop</span>
                </Link>

                {/* Cart */}
                <Link
                    href={`/${lang}/cart`}
                    className={`inline-flex flex-col items-center justify-center px-5 group ${isActive('/cart') ? 'text-indigo-500' : 'text-gray-400 hover:text-gray-200'
                        }`}
                >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-xs">Cart</span>
                </Link>

                {/* Profile */}
                <Link
                    href={`/${lang}/profile`}
                    className={`inline-flex flex-col items-center justify-center px-5 group ${isActive('/profile') ? 'text-indigo-500' : 'text-gray-400 hover:text-gray-200'
                        }`}
                >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs">Profile</span>
                </Link>
            </div>
        </div>
    )
}
