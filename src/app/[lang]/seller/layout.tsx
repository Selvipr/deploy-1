import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SellerSidebar from '@/components/SellerSidebar'

export default async function SellerLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params;
    const supabase = await createClient()

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/${lang}/login?next=/${lang}/seller`)
    }

    // 2. Role Check (RBAC)
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    // Allow 'seller' (or 'merchant') AND 'admin' to access seller dashboard
    if (!profile || (profile.role !== 'seller' && profile.role !== 'merchant' && profile.role !== 'admin')) {
        // Redirect unauthorized users to home
        redirect(`/${lang}`)
    }

    return (
        <div className="min-h-screen bg-[#0a0a0c]">
            <SellerSidebar lang={lang} />
            <main className="ml-64 pt-20 p-8">
                {children}
            </main>
        </div>
    )
}
