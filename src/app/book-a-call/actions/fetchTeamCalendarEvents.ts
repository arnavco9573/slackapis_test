'use server'

import { google } from 'googleapis'
import { createClientServer } from '@/lib/supabase/server'

interface TeamCalendarEventsParams {
    memberIds: string[]
    startDate: Date
    endDate: Date
}

export async function fetchTeamCalendarEvents({ memberIds, startDate, endDate }: TeamCalendarEventsParams) {
    try {
        const supabase = await createClientServer()

        // 1. Fetch team member details (emails and colors)
        const { data: members, error: membersError } = await supabase
            .from('team_members')
            .select('id, workspace_email, color, name')
            .in('id', memberIds)

        if (membersError || !members || members.length === 0) {
            return { success: false, error: 'No team members found', data: [] }
        }

        // 2. Setup Google Auth
        let rawKey = process.env.GOOGLE_PRIVATE_KEY!
        if (!rawKey) throw new Error("Missing GOOGLE_PRIVATE_KEY")

        const cleanBody = rawKey
            .replace(/-----BEGIN PRIVATE KEY-----/g, '')
            .replace(/-----END PRIVATE KEY-----/g, '')
            .replace(/\\n/g, '')
            .replace(/\n/g, '')
            .replace(/"/g, '')
            .replace(/ /g, '')
            .trim()
        const formattedKey = `-----BEGIN PRIVATE KEY-----\n${cleanBody}\n-----END PRIVATE KEY-----\n`

        const auth = new google.auth.JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: formattedKey,
            scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
            subject: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        })

        const calendar = google.calendar({ version: 'v3', auth })

        // 3. Fetch events for each member in parallel
        const promises = members.map(async (member) => {
            try {
                const res = await calendar.events.list({
                    calendarId: member.workspace_email,
                    timeMin: startDate.toISOString(),
                    timeMax: endDate.toISOString(),
                    singleEvents: true,
                    orderBy: 'startTime',
                })

                const events = (res.data.items || []).map((event: any) => ({
                    id: event.id,
                    title: event.summary || '(No Title)',
                    start: event.start?.dateTime ? new Date(event.start.dateTime) : new Date(event.start?.date || new Date()),
                    end: event.end?.dateTime ? new Date(event.end.dateTime) : new Date(event.end?.date || new Date()),
                    source: 'google' as const,
                    color: member.color || '#888888',
                    memberId: member.id,
                    memberName: member.name,
                }))

                return { memberId: member.id, events, error: null }
            } catch (err: any) {
                console.error(`Failed to fetch calendar for ${member.workspace_email}:`, err.message)
                return { memberId: member.id, events: [], error: err.message }
            }
        })

        const results = await Promise.all(promises)

        // 4. Flatten all events into a single array
        const allEvents = results.flatMap(r => r.events)

        return { success: true, data: allEvents }
    } catch (error: any) {
        console.error("Team Calendar Fetch Error:", error)
        return { success: false, error: error.message, data: [] }
    }
}
