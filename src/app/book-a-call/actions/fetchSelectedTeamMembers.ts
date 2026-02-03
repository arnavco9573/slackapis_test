'use server'

import { createClientServer } from '@/lib/supabase/server'

export async function fetchSelectedTeamMembers(masterId: string) {
    try {
        const supabase = await createClientServer()
        // console.log(masterId, "masterID")
        const { data, error } = await supabase
            .from('team_members')
            .select('*')
            .eq('master_id', masterId)
            .eq('is_active', true)
            .order('name', { ascending: true })

        if (error) {
            console.error('Error fetching team members:', error)
            return { success: false, error: error.message, data: [] }
        }
        // console.log(data, "Data for Team Members")
        return { success: true, data: data || [] }
    } catch (error: any) {
        console.error('Unexpected error:', error)
        return { success: false, error: error.message, data: [] }
    }
}
