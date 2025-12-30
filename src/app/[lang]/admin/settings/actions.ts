'use server'

import { AdminService } from "@/services/admin.service"
import { revalidatePath } from "next/cache"

export async function updateExhangeRate(rate: string) {
    if (!rate) return
    await AdminService.updateSystemSetting('rub_rate', rate)
    revalidatePath('/') // refresh globally as it affects pricing everywhere
}
