import ProductForm from '@/components/ProductForm'
import InventoryManager from '@/components/InventoryManager'
import { createClient } from '@/lib/supabase/server'
import { SellerService } from '@/services/seller.service'
import { notFound } from 'next/navigation'

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ lang: string; id: string }>
}) {
    const { lang, id } = await params;
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const productId = id
    const product = await SellerService.getProductById(productId)

    if (!product || product.seller_id !== user?.id) {
        notFound()
    }

    const stockCount = await SellerService.getInventoryStats(productId)

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-white mb-8">Edit Product</h1>

            <ProductForm
                lang={lang}
                sellerId={user!.id}
                initialData={product}
            />

            <div className="border-t border-white/10 my-8 pt-8">
                <InventoryManager productId={product.id} currentCount={stockCount} />
            </div>
        </div>
    )
}
