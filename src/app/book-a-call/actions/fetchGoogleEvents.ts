'use server'

import { google } from 'googleapis'

export async function fetchGoogleEvents(emails: string[], date: Date) {
    try {
        // 1. Setup Auth (Impersonating Admin)
        // We use the same "Nuclear Key Fix" here to be safe
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
            scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
            subject: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        })

        const calendar = google.calendar({ version: 'v3', auth })

        // 2. Define Time Range (Start of Day to End of Day)
        const timeMin = new Date(date);
        timeMin.setHours(0, 0, 0, 0);

        const timeMax = new Date(date);
        timeMax.setHours(23, 59, 59, 999);

        // 3. Fetch Events for ALL emails in parallel
        const promises = emails.map(async (email) => {
            try {
                const res = await calendar.events.list({
                    calendarId: email, // The team member's email is their Calendar ID
                    timeMin: timeMin.toISOString(),
                    timeMax: timeMax.toISOString(),
                    singleEvents: true,
                    orderBy: 'startTime',
                });

                return {
                    email,
                    events: res.data.items || [],
                    error: null
                };
            } catch (err: any) {
                console.error(`Failed to fetch for ${email}:`, err.message);
                return { email, events: [], error: err.message };
            }
        });

        const results = await Promise.all(promises);
        return { success: true, data: results };

    } catch (error: any) {
        console.error("Calendar Fetch Error:", error);
        return { success: false, message: error.message };
    }
}
