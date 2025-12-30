import { createClient } from '@/lib/supabase/server'

export type CreateProductParams = {
    title: string
    description: string
    price: number
    type: 'serial_key' | 'file' | 'direct_api'
    input_schema?: any
    supplier_config?: any
}

export type AddInventoryParams = {
    productId: string
    secretData: string
}

export class InventoryService {
    static async getSellerProducts(sellerId: string) {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('products')
            .select('*, inventory(count)')
            .eq('seller_id', sellerId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    }

    static async createProduct(sellerId: string, params: CreateProductParams) {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('products')
            .insert({
                ...params,
                seller_id: sellerId
            })
            .select()
            .single()

        if (error) throw error
        return data
    }

    static async addInventoryItem(sellerId: string, params: AddInventoryParams) {
        // First verify ownership
        const supabase = await createClient()

        // Check if product belongs to seller
        const { data: product, error: prodError } = await supabase
            .from('products')
            .select('id')
            .eq('id', params.productId)
            .eq('seller_id', sellerId)
            .single()

        if (prodError || !product) throw new Error('Unauthorized or Product not found')

        // Insert inventory
        const { data, error } = await supabase
            .from('inventory')
            .insert({
                product_id: params.productId,
                secret_data: params.secretData, // TODO: Add encryption
                status: 'available'
            })
            .select()
            .single()

        if (error) throw error
        return data
    }
}
