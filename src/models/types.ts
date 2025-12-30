export interface InputField {
    name: string
    label: string
    type: 'text' | 'number' | 'select' | 'email'
    required?: boolean
    options?: string[] // For select fields
}

export interface InputSchema {
    fields: InputField[]
}

export interface Product {
    id: string
    title: string
    description: string | null
    price: number
    type: 'serial_key' | 'file' | 'direct_api'
    input_schema: InputSchema | null
    supplier_config: Record<string, any> | null
    seller_id: string
    created_at: string
}

export interface UserProfile {
    id: string
    email: string
    role: 'buyer' | 'seller' | 'admin'
    wallet_balance: number
    kyc_status: string
    created_at: string
}
