import ProductForm from '@/components/ProductForm'
import { createClient } from '@/lib/supabase/server'

export default async function NewProductPage({
    params,
}: {
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params;
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Add New Product</h1>
            <ProductForm lang={lang} sellerId={user!.id} />
        </div>
    )
}
