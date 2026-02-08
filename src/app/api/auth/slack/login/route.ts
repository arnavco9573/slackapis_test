import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "bot"; // 'bot' or 'user'

    const clientId = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;

    // Scopes for User Token (acting as the user)
    const userScopes = [
        "channels:read",
        "channels:history",
        "chat:write",
        "groups:read",
        "groups:history",
        "im:read",
        "im:history",
        "mpim:read",
        "mpim:history",
        "users:read",
        "users:read.email",
        "files:read",
        "search:read"
    ].join(",");

    // Build the correct redirect URI
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const origin = `${protocol}://${host}`;
    const redirectUri = `${origin}/api/auth/slack/callback`;

    // Construct authorization URL
    const url = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=&user_scope=${userScopes}&redirect_uri=${redirectUri}`;

    return NextResponse.redirect(url);
}
