'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { google } from 'googleapis'
import { revalidatePath } from 'next/cache'

export async function syncTeamMembers(masterId: string) {
    try {
        console.log(`Starting Sync for Master ID: ${masterId}`)

        // 1. Setup Auth (Admin Directory API)
        let rawKey = process.env.GOOGLE_PRIVATE_KEY!;
        if (!rawKey) throw new Error("Missing GOOGLE_PRIVATE_KEY");

        const cleanBody = rawKey
            .replace(/-----BEGIN PRIVATE KEY-----/g, '')
            .replace(/-----END PRIVATE KEY-----/g, '')
            .replace(/\\n/g, '')
            .replace(/\n/g, '')
            .replace(/"/g, '')
            .replace(/ /g, '')
            .trim();
        const formattedKey = `-----BEGIN PRIVATE KEY-----\n${cleanBody}\n-----END PRIVATE KEY-----\n`;

        const auth = new google.auth.JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: formattedKey,
            scopes: [
                'https://www.googleapis.com/auth/admin.directory.user.readonly',
                'https://www.googleapis.com/auth/calendar.readonly'
            ],
            subject: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        })

        const admin = google.admin({ version: 'directory_v1', auth })

        // 2. Fetch Users from Domain
        const res = await admin.users.list({
            customer: 'my_customer', // Indicates "my account's customer"
            maxResults: 50,
            orderBy: 'email',
            projection: 'full',
            viewType: 'admin_view'
        })

        const users = res.data.users || []
        console.log(`Found ${users.length} users.`)
        // if (users.length > 0) {
        //     console.log('User Keys:', Object.keys(users[0]))
        //     console.log('Thumbnail:', users[0].thumbnailPhotoUrl)
        // }

        if (users.length === 0) {
            return { success: true, count: 0, members: [] }
        }

        // 3. Upsert into Supabase
        const supabase = createAdminClient()

        const upsertData = users.map(u => ({
            master_id: masterId,
            workspace_email: u.primaryEmail!,
            name: u.name?.fullName || u.primaryEmail!.split('@')[0],
            is_active: true,
            avatar_url: u.thumbnailPhotoUrl,
            // Don't overwrite color if it exists, but we can't easily check in a bulk upsert without conflict handling
            // We'll rely on onConflict to UPDATE details but ideally we want to preserve color if set.
            // For this specific 'sync' logic, we are just adding new ones mostly. 
            // Let's rely on the fact that if they exist, we just confirm them.
        }))

        // We process sequentially or use upsert. 
        // We want to return the LIST of members to the UI for the wizard.

        const { data: upserted, error } = await supabase
            .from('team_members')
            .upsert(upsertData, {
                onConflict: 'workspace_email',
                ignoreDuplicates: false // Update existing to ensure names match Google
            })
            .select('*')

        if (error) throw error

        revalidatePath('/book-a-call')
        return { success: true, count: upserted.length, members: upserted }

    } catch (error: any) {
        console.error("Sync Error:", error)
        return { success: false, message: error.message }
    }
}
