'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { google } from 'googleapis'
import { revalidatePath } from 'next/cache'

export async function assignBooking(
    bookingId: string,
    teamMemberId: string,
    selectedTimeISO: string
) {
    const supabase = createAdminClient()

    try {
        console.log(`🚀 Starting Assignment for Booking: ${bookingId}`)

        // 1. Fetch Booking Details
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select(`*, wl_partners ( business_name, email )`)
            .eq('id', bookingId)
            .single()

        if (bookingError || !booking) throw new Error("Booking not found")

        const attendeeEmail = booking.calendar_email || booking.wl_partners?.email;

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

        // 🚨 RE-ASSIGNMENT LOGIC: Check if already scheduled and needs cancellation
        console.log(`📋 Booking Status Check:`, {
            status: booking.status,
            assigned_team_member_id: booking.assigned_team_member_id,
            google_event_id: booking.google_event_id,
            new_team_member_id: teamMemberId
        })

        if (booking.status === 'scheduled' && booking.assigned_team_member_id && booking.google_event_id) {
            console.log(`🔄 Re-assigning booking. Cancelling old event ${booking.google_event_id}...`)
            try {
                // Fetch OLD team member to impersonate
                const { data: oldMember, error: oldMemberError } = await supabase
                    .from('team_members')
                    .select('workspace_email')
                    .eq('id', booking.assigned_team_member_id)
                    .single()

                if (oldMemberError) {
                    console.error(`❌ Failed to fetch old team member:`, oldMemberError)
                    throw oldMemberError
                }

                console.log(`👤 Old assignee email: ${oldMember?.workspace_email}`)

                if (oldMember?.workspace_email) {
                    const oldAuth = new google.auth.JWT({
                        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                        key: formattedKey,
                        scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
                        subject: oldMember.workspace_email,
                    })

                    const oldCalendar = google.calendar({ version: 'v3', auth: oldAuth })

                    console.log(`🗑️ Attempting to delete event ${booking.google_event_id} from ${oldMember.workspace_email}'s calendar...`)

                    const deleteResult = await oldCalendar.events.delete({
                        calendarId: 'primary',
                        eventId: booking.google_event_id,
                        sendUpdates: 'all', // Notify attendees (WL Partner) of cancellation
                    })

                    console.log(`✅ Old event ${booking.google_event_id} deleted successfully!`, deleteResult.status)
                } else {
                    console.warn(`⚠️ Old member email not found, skipping event deletion`)
                }
            } catch (e: any) {
                console.error(`❌ Failed to delete old event:`, {
                    message: e.message,
                    code: e.code,
                    errors: e.errors,
                    stack: e.stack
                })
                // Continue anyway, don't block new assignment
            }
        } else {
            console.log(`ℹ️ Not a re-assignment, skipping old event deletion`)
        }

        // 3. Fetch NEW Team Member Details
        const { data: teamMember, error: teamError } = await supabase
            .from('team_members')
            .select('*')
            .eq('id', teamMemberId)
            .single()

        if (teamError || !teamMember) throw new Error("Team member not found")

        console.log(`📅 Scheduling for: ${teamMember.workspace_email}`)

        // 4. Google Calendar Logic (Impersonating NEW Team Member)
        const auth = new google.auth.JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: formattedKey,
            scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
            subject: teamMember.workspace_email,
        })

        const calendar = google.calendar({ version: 'v3', auth })

        const startTime = new Date(selectedTimeISO)
        const endTime = new Date(startTime.getTime() + 60 * 60000) // 1 Hour

        const eventBody = {
            summary: `${booking.title} - Accepted`,
            description: booking.description,
            start: { dateTime: startTime.toISOString() },
            end: { dateTime: endTime.toISOString() },
            attendees: [
                { email: teamMember.workspace_email },
                { email: attendeeEmail }
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

        const generatedLink = googleRes.data.hangoutLink || ""
        const eventId = googleRes.data.id || ""

        console.log("✅ Meet Link Generated:", generatedLink)

        // 5. Update Database (Status -> 'scheduled')
        const { error: updateError } = await supabase
            .from('bookings')
            .update({
                status: 'scheduled', // 👈 Status changed
                assigned_team_member_id: teamMemberId,
                final_start_time: selectedTimeISO,
                final_end_time: endTime.toISOString(),
                meet_link: generatedLink,
                google_event_id: eventId,
                updated_at: new Date().toISOString()
            })
            .eq('id', bookingId)

        if (updateError) throw updateError

        // 6. Reject Sibling Requests (Same Group ID)
        if (booking.request_group_id) {
            await supabase
                .from('bookings')
                .update({
                    status: 'rejected', // 👈 Mark others as rejected
                    rejection_reason: 'Another slot in this request was confirmed.'
                })
                .eq('request_group_id', booking.request_group_id)
                .neq('id', bookingId) // Don't reject the one we just confirmed
                .eq('status', 'requested') // Only reject pending ones
        }

        revalidatePath('/book-a-call')
        return { success: true, meetLink: generatedLink }

    } catch (error: any) {
        console.error("❌ Assign Error:", error.message)
        return { success: false, message: error.message }
    }
}