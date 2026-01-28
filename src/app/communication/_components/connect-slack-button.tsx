"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase/client";

interface ConnectSlackButtonProps {
    isConnected?: boolean;
}

export function ConnectSlackButton({ isConnected }: ConnectSlackButtonProps) {
    const handleConnect = () => {
        const clientId = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;
        const redirectUri = `${window.location.origin}/api/auth/slack/callback`;
        const scopes = "chat:write,files:write,channels:read,users:read,groups:read,mpim:read,im:read,channels:history,groups:history,mpim:history,im:history";

        const url = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=&user_scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;

        window.location.href = url;
    };

    const buttonClass = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow h-9 px-4 py-2";

    if (isConnected) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm text-green-600 font-medium">● Connected</span>
                <button
                    onClick={handleConnect}
                    className={`${buttonClass} border border-input bg-background shadow-sm hover:bg-zinc-100 hover:text-accent-foreground h-8 px-3 text-xs`}
                >
                    Reconnect
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleConnect}
            className={`${buttonClass} bg-[#4A154B] hover:bg-[#361136] text-white`}
        >
            Connect Slack Account
        </button>
    );
}
