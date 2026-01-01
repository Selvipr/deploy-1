'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addFunds(amount: number) {
    const supabase = await createClient()

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    if (amount <= 0) throw new Error('Amount must be positive')

    // 2. Get Current Balance
    const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('wallet_balance')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) throw new Error('User profile not found')

    const currentBalance = profile.wallet_balance || 0
    const newBalance = currentBalance + amount

    // 3. Update Balance
    const { error: updateError } = await supabase
        .from('users')
        .update({ wallet_balance: newBalance })
        .eq('id', user.id)

    if (updateError) throw new Error('Failed to update wallet')

    revalidatePath('/[lang]/profile', 'page')
    return { success: true, newBalance }
}
