'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function checkTeamMembersExist() {
    const supabase = createAdminClient()

    // Get current user to find their master_id
    // We need to get the session first using a standard client to identify the user
    const cookieStore = await cookies()
    const browserSupabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    const { data: { user } } = await browserSupabase.auth.getUser()
    if (!user) return { success: false, exists: false }

    // Find master profile
    const { data: master } = await supabase
        .from('master_profiles')
        .select('id')
        .eq('email', user.email)
        .single()

    if (!master) return { success: false, exists: false }

    // Check count
    const { count, error } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('master_id', master.id)
        .eq('is_active', true)

    if (error) return { success: false, message: error.message }

    return { success: true, exists: (count || 0) > 0, masterId: master.id }
}
