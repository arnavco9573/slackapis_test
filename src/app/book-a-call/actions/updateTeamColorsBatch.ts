'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type ColorUpdate = {
    id: string
    color: string
}

export async function updateTeamColorsBatch(updates: ColorUpdate[]) {
    const supabase = createAdminClient()

    try {
        // Run updates in parallel
        const promises = updates.map(u =>
            supabase
                .from('team_members')
                .update({ color: u.color })
                .eq('id', u.id)
        )

        await Promise.all(promises)

        revalidatePath('/book-a-call')
        return { success: true }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}
