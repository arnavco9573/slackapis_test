'use server'

import { createClientServer } from '@/lib/supabase/server'

export async function fetchAllTeamMembers(masterId: string) {
    try {
        const supabase = await createClientServer()

        const { data, error } = await supabase
            .from('team_members')
            .select('id, name, workspace_email, color, avatar_url, is_active')
            .eq('master_id', masterId)
            .order('name', { ascending: true })

        if (error) {
            console.error('Error fetching all team members:', error)
            return { success: false, error: error.message, data: [] }
        }

        return { success: true, data: data || [] }
    } catch (error: any) {
        console.error('Unexpected error:', error)
        return { success: false, error: error.message, data: [] }
    }
}
