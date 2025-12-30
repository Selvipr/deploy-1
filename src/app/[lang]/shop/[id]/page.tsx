import { ProductService } from '@/services/product.service'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ProductDetailSkeleton } from '@/components/Skeletons'
import { Product } from '@/models/types'
import ProductPurchaseForm from '@/components/ProductPurchaseForm'

interface ProductPageProps {
    params: Promise<{
        id: string
        lang: string
    }>
}

export default async function ProductPage({ params }: ProductPageProps) {
    // Await params in Next.js 15
    const { id, lang } = await params

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white">
            <Suspense fallback={<ProductDetailSkeleton />}>
                <ProductView id={id} lang={lang} />
            </Suspense>
        </div>
    )
}

async function ProductView({ id, lang }: { id: string, lang: string }) {
    const product = await ProductService.getProductById(id)

    if (!product) {
        notFound()
    }

    // Parse schema safely
    const schema = product.input_schema as any

    return (
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-2 lg:gap-x-16">
                {/* Product Image/Info Column */}
                <div>
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-800 relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-8xl font-bold text-white/5 uppercase tracking-widest text-center select-none">
                                {product.title.substring(0, 3)}
                            </span>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 p-6">
                            <span className="inline-flex items-center rounded-full bg-indigo-400/10 px-3 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/20">
                                {product.type === 'direct_api' ? 'Automatic Delivery' : 'Instant Key'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{product.title}</h1>
                        <p className="mt-4 text-gray-400">{product.description}</p>
                    </div>
                </div>

                {/* Form Column */}
                <div className="mt-10 lg:mt-0">
                    <ProductPurchaseForm product={product} lang={lang} />
                    {/* Note: In a real app, 'lang' should be passed down from params properly. 
                        For now hardcoding 'en' or need to drill it from ProductPage props. 
                        Let's update ProductView signature to accept lang if needed, 
                        but to minimize diff, assuming 'en' or simple fix. 
                        Wait, this file has 'params' with lang. 
                        I should update ProductView to accept lang.
                    */}
                </div>
            </div>
        </div>
    )
}
