import Link from 'next/link'
import { ProductService } from '@/services/product.service'
import GameCard from '@/components/GameCard'
import { Suspense } from 'react'
import { GameCardSkeletonGrid } from '@/components/Skeletons'

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-[#0a0a0c] text-white">
            {/* Hero Section */}
            <section className="relative isolate overflow-hidden pt-14 lg:pt-20">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl py-20 text-center sm:py-32">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            Shop2games <span className="text-indigo-500">Market</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            The ultimate hybrid marketplace. Instant top-ups for your favorite games and secure P2P trading.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href="/shop"
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Browse All Games
                            </Link>
                            <Link href="/register" className="text-sm font-semibold leading-6 text-white">
                                Create Account <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Grid */}
            <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Featured Games</h2>
                    <Link href="/shop" className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
                        View all &rarr;
                    </Link>
                </div>

                <Suspense fallback={<GameCardSkeletonGrid count={4} />}>
                    <FeaturedGames />
                </Suspense>

                {/* Value Props */}
                <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white/5 p-8 backdrop-blur-sm border border-white/10">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white">Instant Delivery</h3>
                        <p className="mt-2 text-sm text-gray-400">Direct API integration ensures your game credits are delivered in seconds.</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-8 backdrop-blur-sm border border-white/10">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white">Secure & Trusted</h3>
                        <p className="mt-2 text-sm text-gray-400">Every transaction is protected. P2P trades use our secure escrow system.</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-8 backdrop-blur-sm border border-white/10">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 text-green-400">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white">Best Prices</h3>
                        <p className="mt-2 text-sm text-gray-400">Competitive global rates and localized pricing for your region.</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

async function FeaturedGames() {
    const products = await ProductService.getAllProducts()

    return (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.slice(0, 4).map((product) => (
                <GameCard key={product.id} product={product} />
            ))}
        </div>
    )
}
