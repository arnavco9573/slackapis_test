'use server'

import { google } from 'googleapis'
import { createAdminClient } from '@/lib/supabase/server'

export async function fetchTeamCalendar(masterId: string, date: Date) {
    try {
        console.log(`Getting calendar for Master ID: ${masterId}`);
        const supabase = createAdminClient();

        // 1. Fetch Team Members from DB (Server-side Admin Client = Bypasses RLS)
        const { data: team, error } = await supabase
            .from('team_members')
            .select('id, name, workspace_email, color, avatar_url')
            .eq('master_id', masterId)
            .eq('is_active', true);

        if (error) {
            console.error("Supabase Fetch Error:", error);
            return { success: false, message: "DB Error: " + error.message };
        }

        if (!team || team.length === 0) {
            console.log("No team members found for this ID.");
            return { success: false, data: [] };
        }

        console.log(`Found ${team.length} members. Fetching Google Events...`);

        // 2. Setup Auth (Impersonating Admin)
        let rawKey = process.env.GOOGLE_PRIVATE_KEY;
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
            scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
            subject: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        });

        const calendar = google.calendar({ version: 'v3', auth });

        // 3. Define Time Range
        const timeMin = new Date(date);
        timeMin.setHours(0, 0, 0, 0);

        const timeMax = new Date(date);
        timeMax.setHours(23, 59, 59, 999);

        // 4. Fetch Events for ALL emails
        const promises = team.map(async (member) => {
            try {
                const res = await calendar.events.list({
                    calendarId: member.workspace_email,
                    timeMin: timeMin.toISOString(),
                    timeMax: timeMax.toISOString(),
                    singleEvents: true,
                    orderBy: 'startTime',
                });

                const items = res.data.items || [];

                return {
                    id: member.id,
                    email: member.workspace_email,
                    name: member.name,
                    color: member.color,
                    profile_picture: member.avatar_url,
                    events: items,
                    error: null
                };
            } catch (err: any) {
                console.error(`Failed to fetch for ${member.workspace_email}:`, err.message);
                return {
                    id: member.id,
                    email: member.workspace_email,
                    name: member.name,
                    color: member.color,
                    profile_picture: member.avatar_url,
                    events: [],
                    error: err.message
                };
            }
        });

        const results = await Promise.all(promises);
        return { success: true, data: results };

    } catch (error: any) {
        console.error("General Fetch Error:", error);
        return { success: false, message: error.message };
    }
}
