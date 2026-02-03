'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function cancelBooking({ requestGroupId, reason, shouldSendEmail }: { requestGroupId: string, reason: string, shouldSendEmail?: boolean }) {
    const supabase = createAdminClient()

    try {
        console.log(`🚫 Rejecting Group/ID: ${requestGroupId} | Reason: ${reason} | SendEmail: ${shouldSendEmail}`)

        // 1. Resolve Group ID
        // If a single ID was passed, find its group ID to ensure we reject all siblings
        const { data: row } = await supabase
            .from('bookings')
            .select('request_group_id')
            .or(`id.eq.${requestGroupId},request_group_id.eq.${requestGroupId}`)
            .limit(1)
            .single()

        if (!row) throw new Error("Booking not found")

        const actualGroupId = row.request_group_id

        // 2. Prepare Update Query
        let updateQuery = supabase.from('bookings').update({
            status: 'rejected', // 👈 Status changed
            rejection_reason: reason,
            rejected_by: 'master',
            updated_at: new Date().toISOString()
        })

        // 3. Reject ALL bookings in this group
        if (actualGroupId) {
            const { error } = await updateQuery.eq('request_group_id', actualGroupId)
            if (error) throw error
        } else {
            // Fallback for old data without group ID
            const { error } = await updateQuery.eq('id', requestGroupId)
            if (error) throw error
        }

        revalidatePath('/book-a-call')
        return { success: true }

    } catch (error: any) {
        console.error("❌ Cancel Error:", error.message)
        return { success: false, message: error.message }
    }
}