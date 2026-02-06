'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function cancelBooking({ requestGroupId, reason, shouldSendEmail }: { requestGroupId: string, reason: string, shouldSendEmail?: boolean }) {
    const supabase = createAdminClient()

    try {
        console.log(`🚫 Rejecting Group/ID: ${requestGroupId} | Reason: ${reason} | SendEmail: ${shouldSendEmail}`)

        // 1. Resolve Group ID & Fetch Details
        // Fetch ALL bookings that match the ID or Group ID, regardless of status
        const { data: bookings, error: fetchError } = await supabase
            .from('bookings')
            .select('id, request_group_id, google_event_id, assigned_team_member_id, status')
            .or(`id.eq.${requestGroupId},request_group_id.eq.${requestGroupId}`)

        if (fetchError) {
            console.error("Error fetching bookings:", fetchError)
        }

        // 2. Google Calendar Deletion Logic
        // Find any scheduled bookings in this group preventing future calendar clutter
        const scheduledBookings = bookings?.filter(b => b.status === 'scheduled' && b.google_event_id && b.assigned_team_member_id) || []

        if (scheduledBookings.length > 0) {
            console.log(`find ${scheduledBookings.length} scheduled bookings to delete from GCal`)

            // Import googleapis dynamically
            const { google } = await import('googleapis')

            // Prepare key once
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

            for (const booking of scheduledBookings) {
                console.log(`🗑️ Attempting to delete Google Event: ${booking.google_event_id}`)
                try {
                    // Fetch team member to impersonate
                    const { data: member } = await supabase
                        .from('team_members')
                        .select('workspace_email')
                        .eq('id', booking.assigned_team_member_id)
                        .single()

                    if (member?.workspace_email) {
                        const auth = new google.auth.JWT({
                            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                            key: formattedKey,
                            scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
                            subject: member.workspace_email,
                        })

                        const calendar = google.calendar({ version: 'v3', auth })
                        await calendar.events.delete({
                            calendarId: 'primary',
                            eventId: booking.google_event_id,
                            sendUpdates: 'all',
                        })
                        console.log(`✅ Google Event ${booking.google_event_id} deleted successfully.`)
                    }
                } catch (e: any) {
                    console.error(`❌ Failed to delete calendar event ${booking.google_event_id}:`, e.message)
                    // We don't throw here to ensure the DB update still happens
                }
            }
        }

        // 3. Update Database Status
        const { error } = await supabase
            .from('bookings')
            .update({
                status: 'rejected',
                rejection_reason: reason,
                rejected_by: 'master',
                updated_at: new Date().toISOString()
            })
            .or(`id.eq.${requestGroupId},request_group_id.eq.${requestGroupId}`)

        if (error) throw error

        revalidatePath('/book-a-call')
        return { success: true }

    } catch (error: any) {
        console.error("❌ Cancel Error:", error.message)
        return { success: false, message: error.message }
    }
}