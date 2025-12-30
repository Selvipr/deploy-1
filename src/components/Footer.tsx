'use client'

import Link from 'next/link'
import { useDictionary } from './LanguageProvider'

export default function Footer() {
    const { footer } = useDictionary()

    return (
        <footer className="bg-[#050507] border-t border-white/5 pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <span className="text-2xl font-bold text-white block mb-4">
                            Shop2<span className="text-indigo-500">games</span>
                        </span>
                        <p className="text-gray-400 text-sm max-w-xs">
                            Your trusted marketplace for digital keys, direct top-ups, and gaming accounts. Secure, fast, and reliable.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">{footer.company}</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/shop" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    {footer.about}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">{footer.legal}</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/legal/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    {footer.privacy}
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    {footer.terms}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">
                        {footer.copyright}
                    </p>

                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-500 hover:text-gray-400">
                            <span className="sr-only">Make it real</span>
                            {/* Placeholder Social Icons */}
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
