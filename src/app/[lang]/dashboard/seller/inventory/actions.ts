'use server'

import { InventoryService } from '@/services/inventory.service'
import { createClient } from '@/lib/supabase/server'

export async function getSellerProductsAction() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    return await InventoryService.getSellerProducts(user.id)
}

export async function addInventoryItemAction(productId: string, secretData: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    return await InventoryService.addInventoryItem(user.id, {
        productId,
        secretData
    })
}
