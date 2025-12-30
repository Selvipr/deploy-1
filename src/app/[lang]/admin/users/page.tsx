import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function UsersPage() {
    const supabase = await createClient()

    // Fetch all users
    const { data: users } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

    async function updateUserRole(formData: FormData) {
        'use server'
        const userId = formData.get('userId') as string
        const role = formData.get('role') as string

        const supabase = await createClient()
        await supabase
            .from('users')
            .update({ role: role })
            .eq('id', userId)

        revalidatePath('/admin/users')
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-gray-200">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Current Role</th>
                            <th className="px-6 py-4">Wallet</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users?.map((user: any) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-white font-medium">{user.full_name || 'Anonymous'}</span>
                                        <span className="text-xs">{user.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                                            user.role === 'seller' ? 'bg-green-500/20 text-green-400' :
                                                'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-green-400">
                                    ${user.wallet_balance?.toFixed(2) || '0.00'}
                                </td>
                                <td className="px-6 py-4">
                                    <form action={updateUserRole} className="flex gap-2">
                                        <input type="hidden" name="userId" value={user.id} />
                                        <select
                                            name="role"
                                            defaultValue={user.role}
                                            className="bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white"
                                        >
                                            <option value="buyer">Buyer</option>
                                            <option value="seller">Seller</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <button className="text-indigo-400 hover:text-indigo-300 text-xs font-bold">
                                            Update
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
