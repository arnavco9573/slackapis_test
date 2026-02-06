'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveMasterSyncConfig(masterId: string, timezone: string, availability: any) {
    const supabase = createAdminClient()

    try {
        const { error } = await supabase
            .from('master_profiles')
            .update({
                timezone: timezone,
                availability: availability
            })
            .eq('id', masterId)

        if (error) throw error

        revalidatePath('/book-a-call')
        return { success: true }
    } catch (error: any) {
        console.error('Error saving master config:', error)
        return { success: false, message: error.message }
    }
}
