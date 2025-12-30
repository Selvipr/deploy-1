import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPanelLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params;
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/${lang}/login`)
    }

    // specific check for admin role
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        redirect(`/${lang}/dashboard`) // kick non-admins out
    }

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-white/10 hidden md:block">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-indigo-500">Admin Panel</h2>
                </div>
                <nav className="px-4 space-y-2">
                    <Link href={`/${lang}/admin`} className="block px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white">
                        Overview
                    </Link>
                    <Link href={`/${lang}/admin/users`} className="block px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white">
                        User Management
                    </Link>
                    <Link href={`/${lang}/admin/disputes`} className="block px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white">
                        Disputes & Orders
                    </Link>
                    <div className="pt-8 mt-8 border-t border-white/10">
                        <Link href={`/${lang}/dashboard`} className="block px-4 py-2 rounded-lg text-gray-400 hover:text-white">
                            &larr; Back to App
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Mobile Nav would go here (omitted for MVP speed) */}

            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
