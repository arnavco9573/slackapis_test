'use server'

import { createClientServer } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTeamMemberStatus(memberId: string, isActive: boolean) {
    try {
        const supabase = await createClientServer()

        const { error } = await supabase
            .from('team_members')
            .update({ is_active: isActive })
            .eq('id', memberId)

        if (error) {
            console.error('Error updating member status:', error)
            return { success: false, message: error.message }
        }

        revalidatePath('/book-a-call')
        return { success: true }
    } catch (error: any) {
        console.error('Unexpected error:', error)
        return { success: false, message: error.message }
    }
}
