'use client'

import { useQuery } from '@tanstack/react-query'
import { createClientBrowser } from '@/lib/supabase/client'

export const usePendingRequests = () => {
    const supabase = createClientBrowser()

    return useQuery({
        queryKey: ['master-pending-requests'],
        queryFn: async () => {
            // 1. Get Current User (The Master)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not logged in")

            // 2. Get Master Profile ID
            // Assuming your master_profiles table uses 'email' to link, or 'id' matches auth.uid()
            const { data: master } = await supabase
                .from('master_profiles')
                .select('id, timezone, availability')
                .eq('email', user.email)
                .single()

            if (!master) throw new Error("Master Profile not found")

            // 3. Fetch Pending Bookings with WL Details
            const { data: requests, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    wl_partners (
                        id,
                        business_name,
                        email,
                        first_name, 
                        last_name
                    ),
                    team_members (
                        id,
                        name,
                        avatar_url
                    )
                `)
                .eq('master_id', master.id)
                .in('status', ['requested', 'scheduled', 'concluded', 'rejected'])
                .order('created_at', { ascending: true })

            if (error) {
                console.error("Error fetching requests:", error)
                throw error
            }

            // Return requests AND masterId (useful for other components)
            return { requests, masterId: master.id, timezone: master.timezone, availability: master.availability }
        }
    })
}