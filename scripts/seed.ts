import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or Service Key')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const products = [
    {
        title: 'Mobile Legends: Bang Bang',
        description: 'Instant Diamonds Top-Up. Direct delivery to your account.',
        price: 0, // Base price, variations handled via logic or separate entries usually, but for now 0 as it's a "service" product with variable amounts
        type: 'direct_api',
        input_schema: {
            fields: [
                { name: 'userId', label: 'User ID', type: 'number', required: true },
                { name: 'zoneId', label: 'Zone ID', type: 'number', required: true },
            ],
        },
        supplier_config: { provider: 'smile_one', game_code: 'mobile_legends' },
    },
    {
        title: 'PUBG Mobile',
        description: 'Global UC Top-Up. Requires Player ID.',
        price: 0,
        type: 'direct_api',
        input_schema: {
            fields: [
                { name: 'playerId', label: 'Player ID', type: 'text', required: true },
            ],
        },
        supplier_config: { provider: 'smile_one', game_code: 'pubg_mobile' },
    },
    {
        title: 'Free Fire',
        description: 'Diamond Top-Up. Instant delivery via Player ID.',
        price: 0,
        type: 'direct_api',
        input_schema: {
            fields: [
                { name: 'playerId', label: 'Player ID', type: 'text', required: true },
            ],
        },
        supplier_config: { provider: 'smile_one', game_code: 'free_fire' },
    },
    {
        title: 'Genshin Impact',
        description: 'Genesis Crystals via UID and Server.',
        price: 0,
        type: 'direct_api',
        input_schema: {
            fields: [
                { name: 'uid', label: 'UID', type: 'text', required: true },
                {
                    name: 'server',
                    label: 'Server',
                    type: 'select',
                    options: ['Asia', 'America', 'Europe', 'TW/HK/MO'],
                    required: true,
                },
            ],
        },
        supplier_config: { provider: 'smile_one', game_code: 'genshin_impact' },
    },
    {
        title: 'Steam Wallet Code (USD)',
        description: 'Redeemable Steam Wallet Code for US Region.',
        price: 10, // Example fixed price
        type: 'serial_key', // This is a key, not direct API topup
        input_schema: {}, // No input needed from user to buy, they just get a key
        supplier_config: {},
    },
]

async function seed() {
    console.log('Seeding products...')

    // Check if products already exist to avoid duplicates
    const { data: existing } = await supabase.from('products').select('title')

    if (existing && existing.length > 0) {
        console.log('Products already exist. Skipping seed.')
        return
    }

    const { error } = await supabase.from('products').insert(products)

    if (error) {
        console.error('Error seeding products:', error)
    } else {
        console.log('Successfully seeded products!')
    }
}

seed()
