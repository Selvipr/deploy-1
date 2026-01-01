import Razorpay from 'razorpay'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
    try {
        const { orderCreationId, razorpayPaymentId, razorpaySignature, amount } = await req.json()

        const signature = orderCreationId + "|" + razorpayPaymentId

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(signature.toString())
            .digest('hex')

        if (expectedSignature !== razorpaySignature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
        }

        // Signature is valid. Payment successful. 
        // Now credit the wallet.
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Get current balance
        const { data: profile } = await supabase
            .from('users')
            .select('wallet_balance')
            .eq('id', user.id)
            .single()

        const currentBalance = profile?.wallet_balance || 0
        const newBalance = currentBalance + Number(amount)

        // Update balance
        const { error } = await supabase
            .from('users')
            .update({ wallet_balance: newBalance })
            .eq('id', user.id)

        if (error) throw error

        return NextResponse.json({ success: true, newBalance })

    } catch (error) {
        console.error('Razorpay Verification Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
