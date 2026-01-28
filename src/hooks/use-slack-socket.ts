import { useEffect, useRef, useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import {
    fetchSlackChannels,
    getUsers,
    fetchSlackDMs,
    getSlackIdentity
} from "@/app/actions/slack-actions";
import { useRouter } from "next/navigation";

type SlackIdentity = {
    id: string | undefined;
    name?: string | undefined;
} | null;

let globalSocket: Socket | null = null;

export function useSlackSocket() {
    const [isConnected, setIsConnected] = useState(false);
    const queryClient = useQueryClient();

    const router = useRouter();
    const routerRef = useRef(router);

    // Update refs to ensure socket listeners always have latest data
    useEffect(() => {
        routerRef.current = router;
    }, [router]);

    /* ---------------- GLOBAL DATA ---------------- */

    useQuery({
        queryKey: ["slack-channels"],
        queryFn: () => fetchSlackChannels(),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
        retry: 2
    });

    useQuery({
        queryKey: ["slack-users"],
        queryFn: () => getUsers(),
        staleTime: 1000 * 60 * 30,
        refetchOnWindowFocus: true,
        retry: 2
    });

    useQuery({
        queryKey: ["slack-dms"],
        queryFn: () => fetchSlackDMs(),
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: true,
        retry: 2
    });

    const { data: identity } = useQuery({
        queryKey: ["slack-identity"],
        queryFn: () => getSlackIdentity(),
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        retry: 2
    });

    const identityRef = useRef<SlackIdentity>(null);
    useEffect(() => {
        identityRef.current = identity ?? null;
    }, [identity]);

    /* ---------------- SOCKET ---------------- */

    useEffect(() => {

        console.log("🔌 [useSlackSocket] Initializing socket...");
        // Singleton Pattern: Only create socket once
        if (!globalSocket) {
            console.log("🔌 [useSlackSocket] Initializing GLOBAL socket...");
            globalSocket = io({
                path: "/api/socket/io",
                addTrailingSlash: false,
                transports: ['websocket', 'polling'], // Enforce websocket
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000,
            });

            // Expose for debugging
            (window as any).slackSocket = globalSocket;
        }

        const socket = globalSocket;

        // Update local state based on current socket state
        if (socket.connected) {
            setIsConnected(true);
        }

        // Clean up OLD listeners to avoid duplicates when this effect re-runs
        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
        socket.off("message");
        socket.off("channel_created");
        socket.off("member_joined_channel");
        socket.off("channel_rename");

        // Bind NEW listeners with fresh closures (accessing current queryClient, routerRef, etc)
        socket.on("connect", () => {
            console.log("✅ [useSlackSocket] Socket connected:", socket.id);
            setIsConnected(true);

            // Eagerly prefetch data
            console.log("🔄 [useSlackSocket] Prefetching cache data...");
            queryClient.prefetchQuery({
                queryKey: ["slack-channels"],
                queryFn: () => fetchSlackChannels()
            });
            queryClient.prefetchQuery({
                queryKey: ["slack-users"],
                queryFn: () => getUsers()
            });
            queryClient.prefetchQuery({
                queryKey: ["slack-dms"],
                queryFn: () => fetchSlackDMs()
            });
            queryClient.prefetchQuery({
                queryKey: ["slack-identity"],
                queryFn: () => getSlackIdentity()
            });
        });

        socket.on("disconnect", (reason: any) => {
            console.log("❌ [useSlackSocket] Socket disconnected. Reason:", reason);
            setIsConnected(false);
        });

        socket.on("connect_error", (err: any) => {
            console.error("❌ [useSlackSocket] Connection error:", err);
        });

        socket.on("message", (event: any) => {
            try {
                // LOGGING AND NOTIFICATION LOGIC (Same as before)
                console.log("📨 [useSlackSocket] Received message event:", event);

                const message = event.message || event;
                const currentUserId = identityRef.current?.id;

                // Don't block on identity - just log warning and continue
                if (!currentUserId) {
                    console.warn("⚠️ [useSlackSocket] Identity not ready yet, will show notification anyway");
                }

                if (message.type !== "message" || !message.channel) {
                    console.log("❌ [useSlackSocket] Invalid message type or missing channel");
                    return;
                }

                const channelId = message.channel;
                const isDM = channelId.startsWith("D");
                const isSelf = currentUserId ? message.user === currentUserId : false;

                // Always invalidate messages
                queryClient.invalidateQueries({
                    queryKey: ["slack-messages", channelId]
                });
                queryClient.invalidateQueries({
                    queryKey: ["slack-unread-map-global"]
                });

                if (isDM) {
                    console.log("🔄 [useSlackSocket] Refreshing DM list");
                    queryClient.invalidateQueries({ queryKey: ["slack-dms"] });
                }

                if (message.thread_ts) {
                    queryClient.invalidateQueries({
                        queryKey: ["slack-thread", channelId, message.thread_ts]
                    });
                }

                /* ---- Notification logic ---- */
                const shouldNotify =
                    message.type === "message" &&
                    !message.subtype &&
                    message.user &&
                    !isSelf &&
                    message.hidden !== true;

                console.log("🔔 [useSlackSocket] Should notify?", shouldNotify, {
                    hasCorrectType: message.type === "message",
                    notSelf: !isSelf,
                });

                if (!shouldNotify) {
                    console.log("🚫 [useSlackSocket] Notification decision: SKIPPED");
                    return;
                }

                // ... Name resolution ...
                const channels = queryClient.getQueryData<any[]>(["slack-channels"]) || [];
                const users = queryClient.getQueryData<any[]>(["slack-users"]) || [];
                const dms = queryClient.getQueryData<any[]>(["slack-dms"]) || [];

                let channelName = "Direct Message";
                if (!isDM) {
                    const channel = channels.find(c => c.id === channelId);
                    if (channel) {
                        channelName = channel.name;
                    } else {
                        channelName = channelId;
                    }
                } else {
                    const dm = dms.find(d => d.id === channelId);
                    if (dm?.user) {
                        const dmUser = users.find(u => u.id === dm.user);
                        if (dmUser) {
                            channelName = `DM with ${dmUser.real_name || dmUser.name}`;
                        }
                    }
                }

                let senderName = message.user_profile?.real_name || message.user_profile?.display_name || message.username || null;
                if (!senderName && message.user) {
                    const user = users.find(u => u.id === message.user);
                    if (user) senderName = user.real_name || user.name;
                }
                if (!senderName) senderName = message.user || "Someone";

                const text = message.text || (message.files?.length ? "Sent a file" : "New message");
                const preview = text.length > 60 ? text.slice(0, 60) + "…" : text;

                console.log("🚀 [useSlackSocket] TRIGGERING TOAST NOW", { isDM, senderName, channelName });

                toast.message(
                    isDM ? `New message from ${senderName}` : `New message in #${channelName}`,
                    {
                        description: isDM ? preview : `${senderName}: ${preview}`,
                        duration: 5000,
                        action: {
                            label: "View",
                            onClick: () => {
                                console.log("👋 [useSlackSocket] Toast clicked, navigating...");
                                const params = new URLSearchParams();
                                params.set("channel", channelId);
                                params.set("messageId", message.ts);
                                if (message.thread_ts) params.set("thread", message.thread_ts);
                                routerRef.current.push(`/communication?${params.toString()}`);
                            }
                        }
                    }
                );
            } catch (err) {
                console.error("❌ [useSlackSocket] CRITICAL ERROR in message handler:", err);
            }
        });

        const invalidateChannels = () => queryClient.invalidateQueries({ queryKey: ["slack-channels"] });

        socket.on("channel_created", invalidateChannels);
        socket.on("member_joined_channel", invalidateChannels);
        socket.on("channel_rename", invalidateChannels);

        return () => {
            // cleanup listeners but keep socket alive
            socket.off("message");
            socket.off("connect");
            socket.off("disconnect");
            socket.off("connect_error");
            socket.off("channel_created");
            socket.off("member_joined_channel");
            socket.off("channel_rename");
        };
    }, [queryClient, routerRef, identityRef]);

    return { isConnected };
}
