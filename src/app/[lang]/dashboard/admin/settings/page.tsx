'use client'

import { useState, useEffect } from 'react'
import { AdminService } from '@/services/admin.service'
import Link from 'next/link'

// We need to fetch data client-side or use server actions. 
// For simplicity in this protected dashboard, we'll use a client-side fetch wrapper or simple state if we had an API.
// Since AdminService is server-side (uses header cookies), we should use a Server Component mostly, 
// but for form interaction we need client.
// Let's make a Server Action wrapper or use an API route. 
// Actually, let's stick to the pattern: Server Component passes data to Client Component.

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">System Settings</h1>
                <Link href="/dashboard/admin" className="text-sm text-indigo-400 hover:text-indigo-300">
                    Back to Dashboard
                </Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <SettingsForm />
            </div>
        </div>
    )
}

function SettingsForm() {
    const [rate, setRate] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    // Fetch initial rate handling
    // In a real app, this should be passed from parent Server Component.
    // For now, we'll just allow setting it.

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setMessage('')

        const newRate = formData.get('rate') as string
        if (!newRate) return;

        try {
            // We need a server action to call AdminService
            // Since we didn't set up a dedicated action file yet, we'll implementation it inline if Next.js allowed, 
            // but here we will mock the call or Assume we added 'updateSettings' action.
            // Let's create `src/app/[lang]/dashboard/admin/settings/actions.ts` next.

            await updateExhangeRate(newRate)
            setMessage('Exchange rate updated successfully!')
        } catch (e) {
            setMessage('Error updating rate.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm font-medium text-gray-300">
                    USD to RUB Exchange Rate (1 USD = ? RUB)
                </label>
                <div className="mt-2 flex gap-2">
                    <input
                        name="rate"
                        type="number"
                        step="0.01"
                        placeholder="e.g. 90"
                        className="block w-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
                {message && <p className="mt-2 text-sm text-indigo-400">{message}</p>}
            </div>
        </form>
    )
}

// Check actions.ts for implementation
import { updateExhangeRate } from './actions'
