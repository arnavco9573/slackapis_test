import { createClientServer } from "@/lib/supabase/server";
import { WebClient } from "@slack/web-api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }

    if (!code) {
        return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    try {
        const client = new WebClient();
        // Determine the correct origin using headers (essential for ngrok/proxies)
        const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
        const protocol = request.headers.get("x-forwarded-proto") || "http";
        const origin = `${protocol}://${host}`;

        const result = await client.oauth.v2.access({
            client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID!,
            client_secret: process.env.SLACK_CLIENT_SECRET!,
            code: code,
            redirect_uri: `${origin}/api/auth/slack/callback`,
        });

        if (!result.ok || !result.authed_user?.access_token) {
            throw new Error(result.error || "Failed to get access token");
        }

        const supabase = await createClientServer();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "User not logged in" }, { status: 401 });
        }

        // Store the token
        const { error: dbError } = await supabase
            .from("user_slack_tokens")
            .upsert({
                user_id: user.id,
                slack_user_id: result.authed_user.id,
                access_token: result.authed_user.access_token,
                scopes: result.scope,
                updated_at: new Date().toISOString()
            }, { onConflict: "user_id" });

        if (dbError) {
            console.error("DB Error:", dbError);
            return NextResponse.json({ error: "Failed to store token" }, { status: 500 });
        }

        // Redirect back to communication page
        return NextResponse.redirect(`${origin}/communication`);

    } catch (e: any) {
        console.error("OAuth Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
