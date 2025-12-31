'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { useDictionary } from '@/components/LanguageProvider'

export default function RegisterPage() {
    const router = useRouter()
    const { lang } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Form State
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [username, setUsername] = useState('')

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const supabase = createClient()

        // 1. Sign Up
        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone,
                    username: username
                    // Note: Supabase trigger will handle plain 'users' table 
                    // IF we updated the trigger to pull metadata.
                    // But our trigger 'handle_new_user' just inserts ID/Email.
                    // We need to manually update profile after signup or update trigger.
                    // Manual update is safer for now without changing DDL again.
                }
            }
        })

        if (authError) {
            setError(authError.message)
            setLoading(false)
            return
        }

        if (data.user) {
            // Success
            alert("Account created! Please check your email.")
            router.push(`/${lang}/login`)
        }
        setLoading(false)
    }

    return (
        <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-[#0a0a0c] text-white">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Link href="/" className="block text-center text-3xl font-bold tracking-tight text-white hover:text-indigo-400 transition-colors">
                    Shop2<span className="text-indigo-500">games</span>
                </Link>
                <h2 className="mt-6 text-center text-xl font-bold leading-9 tracking-tight text-white">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    Join the hybrid marketplace for digital goods
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {error && (
                    <div className="mb-4 rounded-md bg-red-900/30 border border-red-500/30 p-4 text-sm text-red-400 text-center">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSignup}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-300">
                            Full Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    {/* Username Field - for future use or distinct from email */}
                    {/* 
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-300">
                            Username
                        </label>
                        <div className="mt-2">
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    {/* Mobile Number Field */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-300">
                            Mobile Number
                        </label>
                        <div className="mt-2">
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                required
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="+1234567890"
                                className="block w-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-300">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-300">
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Sign up'}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
