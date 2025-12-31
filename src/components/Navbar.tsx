'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import CurrencySwitcher from './CurrencySwitcher'
import { useDictionary } from './LanguageProvider'

interface NavbarProps {
    user: any | null
    lang: string
    userRole?: 'buyer' | 'seller' | 'admin' | 'merchant' | null
}

export default function Navbar({ user, lang, userRole }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const { common } = useDictionary()

    const navigation = [
        { name: common.home, href: `/${lang}` },
        { name: common.shop, href: `/${lang}/shop` },
        ...(user ? [
            { name: common.dashboard, href: `/${lang}/dashboard` },
            { name: common.myOrders, href: `/${lang}/orders` },
            ...(userRole === 'admin' ? [{ name: 'Admin Panel', href: `/${lang}/admin` }] : []),
            ...((userRole === 'seller' || userRole === 'merchant' || userRole === 'admin') ? [{ name: 'Seller Dashboard', href: `/${lang}/seller` }] : [])
        ] : []),
    ]

    return (
        <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/10 bg-[#0a0a0c]/80 backdrop-blur-md">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href={`/${lang}`} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-bold whitespace-nowrap text-white">
                        Shop2<span className="text-indigo-500">games</span>
                    </span>
                </Link>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href={`/${lang}/cart`} className="relative group text-gray-400 hover:text-white transition-colors">
                                <span className="sr-only">{common.cart}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                </svg>
                            </Link>

                            <Link href={`/${lang}/profile`} className="relative group text-gray-400 hover:text-white transition-colors">
                                <span className="sr-only">{common.profile}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </Link>

                            <form action="/auth/signout" method="post">
                                <button type="submit" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                    {common.signOut}
                                </button>
                            </form>
                            <div className="pl-2 border-l border-white/10 flex items-center gap-2">
                                <CurrencySwitcher />
                                <LanguageSwitcher />
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <CurrencySwitcher />
                            <LanguageSwitcher />
                            <Link href={`/${lang}/login`} className="text-white hover:text-indigo-400 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors">
                                {common.login}
                            </Link>
                            <Link href={`/${lang}/register`} className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-800 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors">
                                {common.getStarted}
                            </Link>
                        </div>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        type="button"
                        className="hidden items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                        aria-controls="navbar-sticky"
                        aria-expanded={isOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isOpen ? 'block' : 'hidden'}`} id="navbar-sticky">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-700 rounded-lg bg-gray-800 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`block py-2 px-3 rounded md:p-0 transition-colors ${pathname === item.href
                                        ? 'text-white bg-indigo-600 md:bg-transparent md:text-indigo-500'
                                        : 'text-gray-400 hover:bg-gray-700 md:hover:bg-transparent md:hover:text-white'
                                        }`}
                                    aria-current={pathname === item.href ? 'page' : undefined}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
