'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchTeamCalendar } from '../actions/fetchTeamCalendar'

export const useTeamCalendar = (masterId: string, date: Date) => {
    return useQuery({
        queryKey: ['team-calendar', masterId, date.toISOString().split('T')[0]], // Key changes when date changes
        queryFn: async () => {
            const result = await fetchTeamCalendar(masterId, date)
            if (!result.success) {
                console.error("Fetch Error:", result.message)
                throw new Error(result.message || "Failed to fetch calendar")
            }
            return result.data
        },
        enabled: !!masterId,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    })
}
