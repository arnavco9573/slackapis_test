
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { createClientServer } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const fileUrl = searchParams.get("url");
    const fileName = searchParams.get("name") || "download";

    if (!fileUrl) {
        return new NextResponse("Missing URL", { status: 400 });
    }

    // Security check: ensure strictly from slack.com
    if (!fileUrl.startsWith("https://files.slack.com/") && !fileUrl.includes("slack.com")) {
        return new NextResponse("Invalid URL domain", { status: 403 });
    }

    try {
        // 1. Get authenticated user
        const supabaseClient = await createClientServer();
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

        if (authError || !user) {
            console.error("[PROXY] User not authenticated");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // 2. Get user's Slack token from master_profiles table
        const { data: userProfile, error: tokenError } = await supabaseClient
            .from('master_profiles')
            .select('slack_access_token')
            .eq('id', user.id)
            .single();

        if (tokenError || !userProfile?.slack_access_token) {
            console.warn("[PROXY] No Slack user token found for user:", user.id);
            // Fallback to bot token if user token not available
            const botToken = process.env.SLACK_BOT_TOKEN;
            if (!botToken) {
                return new NextResponse("Server Configuration Error", { status: 500 });
            }
            console.log("[PROXY] Using bot token as fallback");
            return await fetchFile(fileUrl, fileName, botToken);
        }

        console.log("[PROXY] Using user token for authenticated access");
        return await fetchFile(fileUrl, fileName, userProfile.slack_access_token);

    } catch (error: any) {
        console.error("[PROXY] Unexpected error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

async function fetchFile(fileUrl: string, fileName: string, token: string) {
    try {
        console.log(`[PROXY] Fetching file from: ${fileUrl}`);
        const response = await axios.get(fileUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: "arraybuffer", // Important for binary files
        });

        const contentType = response.headers["content-type"] || "application/octet-stream";
        // console.log(`[PROXY] Success! Content-Type: ${contentType}, Size: ${response.data.length} bytes`);

        const safeFileName = fileName.replace(/[^\x20-\x7E]/g, '_'); // Safe ASCII characters only

        return new NextResponse(response.data, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `inline; filename="${safeFileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
                "Cache-Control": "private, max-age=3600",
            },
        });
    } catch (error: any) {
        console.error("[PROXY] Error proxying Slack file:", error.message);
        console.error("[PROXY] Error response:", error.response?.status, error.response?.statusText);
        // console.error("[PROXY] Error data:", error.response?.data?.toString?.());
        return new NextResponse("Failed to fetch file", { status: 502 });
    }
}
