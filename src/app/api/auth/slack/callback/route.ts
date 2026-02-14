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

        console.log("DEBUG: Callback - Supabase User:", user?.id);

        if (!user) {
            console.error("DEBUG: Callback - No authenticated user found");
            return NextResponse.json({ error: "User not logged in" }, { status: 401 });
        }

        const { createAdminClient } = await import("@/lib/supabase/server");
        const adminSupabase = createAdminClient();

        console.log("DEBUG: Callback - Attempting to update master_profiles for user:", user.id);
        console.log("DEBUG: Callback - Token Data:", {
            token_preview: result.authed_user.access_token.substring(0, 10) + "...",
            slack_id: result.authed_user.id
        });

        // Try updating by ID first
        let { data: updatedData, error: dbError } = await adminSupabase
            .from("master_profiles")
            .update({
                slack_access_token: result.authed_user.access_token,
                slack_user_id: result.authed_user.id,
            })
            .eq("id", user.id)
            .select();

        // If no rows updated by ID, try matching by Email
        if (!dbError && (!updatedData || updatedData.length === 0)) {
            console.log("DEBUG: Callback - No profile found by ID. Trying email:", user.email);
            if (user.email) {
                const { data: emailData, error: emailError } = await adminSupabase
                    .from("master_profiles")
                    .update({
                        slack_access_token: result.authed_user.access_token,
                        slack_user_id: result.authed_user.id,
                    })
                    .eq("email", user.email)
                    .select();

                updatedData = emailData;
                dbError = emailError;
            }
        }

        if (dbError) {
            console.error("DEBUG: Callback - DB Error updating master_profiles:", dbError);
            return NextResponse.json({ error: "Failed to store token in profile" }, { status: 500 });
        }

        console.log("DEBUG: Callback - Successfully updated master_profiles");

        // Redirect back to communication page
        return NextResponse.redirect(`${origin}/communication`);

    } catch (e: any) {
        console.error("OAuth Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
