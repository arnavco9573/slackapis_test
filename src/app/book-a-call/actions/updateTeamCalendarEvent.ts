'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { google } from 'googleapis'
import { revalidatePath } from 'next/cache'

export async function updateTeamCalendarEvent(
    bookingId: string,
    title: string,
    description: string,
    newTeamMemberId: string
) {
    const supabase = createAdminClient()

    try {
        console.log(`🚀 Starting Update for Booking: ${bookingId}`)

        // 1. Fetch Booking Details
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select(`*, wl_partners ( business_name, email )`)
            .eq('id', bookingId)
            .single()

        if (bookingError || !booking) throw new Error("Booking not found")

        // 2. Prepare Google Auth Key
        let rawKey = process.env.GOOGLE_PRIVATE_KEY!;
        const cleanBody = rawKey
            .replace(/-----BEGIN PRIVATE KEY-----/g, '')
            .replace(/-----END PRIVATE KEY-----/g, '')
            .replace(/\\n/g, '')
            .replace(/\n/g, '')
            .replace(/"/g, '')
            .replace(/ /g, '')
            .trim();
        const formattedKey = `-----BEGIN PRIVATE KEY-----\n${cleanBody}\n-----END PRIVATE KEY-----\n`;

        const isAdminChanged = booking.assigned_team_member_id !== newTeamMemberId

        if (isAdminChanged && booking.google_event_id && booking.assigned_team_member_id) {
            // Delete old event
            console.log(`🔄 Admin changed. Cancelling old event ${booking.google_event_id}...`)
            try {
                const { data: oldMember } = await supabase
                    .from('team_members')
                    .select('workspace_email')
                    .eq('id', booking.assigned_team_member_id)
                    .single()

                if (oldMember?.workspace_email) {
                    const oldAuth = new google.auth.JWT({
                        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                        key: formattedKey,
                        scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
                        subject: oldMember.workspace_email,
                    })
                    const oldCalendar = google.calendar({ version: 'v3', auth: oldAuth })
                    await oldCalendar.events.delete({
                        calendarId: 'primary',
                        eventId: booking.google_event_id,
                        sendUpdates: 'all',
                    })
                }
            } catch (e) {
                console.error(`❌ Non-critical error deleting old event:`, e)
            }
        }

        // Fetch (New) Team Member Details
        const { data: teamMember, error: teamError } = await supabase
            .from('team_members')
            .select('*')
            .eq('id', newTeamMemberId)
            .single()

        if (teamError || !teamMember) throw new Error("Team member not found")

        const auth = new google.auth.JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: formattedKey,
            scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
            subject: teamMember.workspace_email,
        })
        const calendar = google.calendar({ version: 'v3', auth })

        let finalEventId = booking.google_event_id
        let finalMeetLink = booking.meet_link

        if (isAdminChanged) {
            // Insert new event for new admin
            const eventBody = {
                summary: title,
                description: description,
                start: { dateTime: booking.final_start_time },
                end: { dateTime: booking.final_end_time },
                attendees: [
                    { email: teamMember.workspace_email },
                    { email: booking.wl_partners.email }
                ],
                conferenceData: {
                    createRequest: {
                        requestId: Math.random().toString(36).substring(7),
                        conferenceSolutionKey: { type: 'hangoutsMeet' },
                    },
                },
            }

            const googleRes = await calendar.events.insert({
                calendarId: 'primary',
                requestBody: eventBody,
                conferenceDataVersion: 1,
                sendUpdates: 'all',
            })

            finalEventId = googleRes.data.id || ""
            finalMeetLink = googleRes.data.hangoutLink || ""
        } else if (booking.google_event_id) {
            // Update existing event
            const eventBody = {
                summary: title,
                description: description,
                start: { dateTime: booking.final_start_time },
                end: { dateTime: booking.final_end_time },
                attendees: [
                    { email: teamMember.workspace_email },
                    { email: booking.wl_partners.email }
                ],
            }

            const googleRes = await calendar.events.update({
                calendarId: 'primary',
                eventId: booking.google_event_id,
                requestBody: eventBody,
                sendUpdates: 'all',
            })

            finalEventId = googleRes.data.id || ""
            finalMeetLink = googleRes.data.hangoutLink || booking.meet_link
        }

        // Update Database
        const { error: updateError } = await supabase
            .from('bookings')
            .update({
                title,
                description,
                assigned_team_member_id: newTeamMemberId,
                google_event_id: finalEventId,
                meet_link: finalMeetLink,
                updated_at: new Date().toISOString()
            })
            .eq('id', bookingId)

        if (updateError) throw updateError

        revalidatePath('/book-a-call')
        return { success: true }

    } catch (error: any) {
        console.error("❌ Update Error:", error.message)
        return { success: false, message: error.message }
    }
}
