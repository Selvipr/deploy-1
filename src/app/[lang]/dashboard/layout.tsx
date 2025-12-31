import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/${lang}/login`)
    }

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    const role = profile?.role || 'buyer'

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">

                    {/* Desktop Sidebar (Hidden on Mobile) */}
                    <aside className="hidden py-6 px-2 sm:px-6 lg:col-span-3 lg:block lg:py-0 lg:px-0">
                        <nav className="space-y-1">
                            <Link
                                href={`/${lang}/dashboard`}
                                className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 group rounded-md px-3 py-2 flex items-center text-sm font-medium"
                            >
                                <svg
                                    className="flex-shrink-0 -ml-1 mr-3 h-6 w-6 text-gray-500 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span className="truncate">Overview</span>
                            </Link>

                            <Link
                                href={`/${lang}/orders`}
                                className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 group rounded-md px-3 py-2 flex items-center text-sm font-medium"
                            >
                                <svg
                                    className="flex-shrink-0 -ml-1 mr-3 h-6 w-6 text-gray-500 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span className="truncate">My Orders</span>
                            </Link>

                            <Link
                                href={`/${lang}/profile`}
                                className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 group rounded-md px-3 py-2 flex items-center text-sm font-medium"
                            >
                                <svg
                                    className="flex-shrink-0 -ml-1 mr-3 h-6 w-6 text-gray-500 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="truncate">Settings (Profile)</span>
                            </Link>

                            {(role === 'seller' || role === 'admin') && (
                                <Link
                                    href={`/${lang}/dashboard/seller`}
                                    className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 group rounded-md px-3 py-2 flex items-center text-sm font-medium mt-8"
                                >
                                    <svg
                                        className="flex-shrink-0 -ml-1 mr-3 h-6 w-6 text-green-500 group-hover:text-green-500"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="truncate">Seller Dashboard</span>
                                </Link>
                            )}

                            {role === 'admin' && (
                                <Link
                                    href={`/${lang}/admin`}
                                    className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 group rounded-md px-3 py-2 flex items-center text-sm font-medium"
                                >
                                    <svg
                                        className="flex-shrink-0 -ml-1 mr-3 h-6 w-6 text-red-500 group-hover:text-red-500"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span className="truncate">Admin Panel</span>
                                </Link>
                            )}
                        </nav>
                    </aside>

                    {/* Content */}
                    <main className="lg:col-span-9 mb-20 lg:mb-0">
                        {children}
                    </main>

                </div>
            </div>
        </div>
    )
}
