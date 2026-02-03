'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTeamMemberColor(memberId: string, color: string) {
    const supabase = createAdminClient()

    try {
        const { error } = await supabase
            .from('team_members')
            .update({ color })
            .eq('id', memberId)

        if (error) throw error

        revalidatePath('/book-a-call')
        return { success: true }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}
