import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
        return new NextResponse("Missing URL parameter", { status: 400 });
    }

    // Security: Ensure we only proxy Slack URLs
    if (!url.startsWith("https://files.slack.com")) {
        console.error("Invalid URL domain:", url);
        return new NextResponse("Invalid URL domain", { status: 403 });
    }

    try {
        const supabase = await createClientServer();

        // 1. Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error("[PROXY-IMG] User not authenticated");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // 2. Get user's Slack token
        const { data: userToken, error: tokenError } = await supabase
            .from("user_slack_tokens")
            .select("access_token")
            .eq("user_id", user.id)
            .single();

        let token = userToken?.access_token;

        // 3. Fallback to bot token if no user token
        if (!token) {
            console.warn("[PROXY-IMG] No user token, falling back to bot token");
            token = process.env.SLACK_BOT_TOKEN;
        }

        if (!token) {
            console.error("[PROXY-IMG] No Slack token available");
            return new NextResponse("Server Config Error", { status: 500 });
        }

        // console.log("Proxying Slack file:", url);
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch from Slack:", response.status, response.statusText);
            return new NextResponse(`Failed to fetch image: ${response.status}`, { status: response.status });
        }

        const contentType = response.headers.get("content-type") || "application/octet-stream";
        const buffer = await response.arrayBuffer();

        // console.log("Successfully proxied file, size:", buffer.byteLength, "type:", contentType);

        return new NextResponse(Buffer.from(buffer), {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "private, max-age=3600", // Private because it depends on User Auth
            },
        });

    } catch (e) {
        console.error("Proxy error:", e);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
