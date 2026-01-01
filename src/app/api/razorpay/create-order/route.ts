import Razorpay from 'razorpay'
import { NextRequest, NextResponse } from 'next/server'

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
    try {
        const { amount, currency = 'USD' } = await req.json()

        // Amount in Razorpay is in smallest currency unit (cents/paise)
        // If USD, it's cents.
        const options = {
            amount: Math.round(amount * 100),
            currency: currency,
            receipt: `rcpt_${Date.now()}`,
        }

        const order = await razorpay.orders.create(options)

        return NextResponse.json(order)
    } catch (error) {
        console.error('Razorpay Order Creation Error:', error)
        return NextResponse.json({ error: 'Error creating order' }, { status: 500 })
    }
}
