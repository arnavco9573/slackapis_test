"use server";

import { createAdminClient, createClientServer } from "@/lib/supabase/server";
import { createSlackClient } from "@/lib/slack";

export type Message = {
    ts: string;
    text: string;
    user: string;
    avatar?: string;
    reply_count?: number;
    latest_reply?: string;
    files?: any[];
    attachments?: any[];
    id?: string;
    subtype?: string;
    username?: string;
    userId?: string;
    icons?: any;
    reactions?: any[];
};

// Cache storage
const cache = {
    channels: new Map<string, { data: any[]; timestamp: number }>(),
    users: new Map<string, { data: any[]; timestamp: number }>()
};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function clearSlackCache(wlPartnerId?: string) {
    const cacheKey = wlPartnerId || "default";
    cache.channels.delete(cacheKey);
    cache.users.delete(cacheKey);
    return { success: true };
}

export async function fetchSlackChannels(wlPartnerId?: string) {
    const cacheKey = wlPartnerId || "default";
    const now = Date.now();
    const cached = cache.channels.get(cacheKey);

    if (cached && (now - cached.timestamp < CACHE_TTL)) {
        return cached.data;
    }

    const slack = await getSlackClient(wlPartnerId);

    // 3. Slack API call - Fetch ALL channels with pagination
    let allChannels: any[] = [];
    let cursor: string | undefined = undefined;
    let pageCount = 0;
    const MAX_PAGES = 50;

    try {
        do {
            pageCount++;
            if (pageCount > MAX_PAGES) {
                console.warn("fetchSlackChannels: Max pages reached, stopping.");
                break;
            }

            const result: any = await slack.conversations.list({
                types: "public_channel,private_channel,mpim", // Include mpim (group DMs)
                exclude_archived: true,
                limit: 200,
                cursor: cursor,
            });

            if (result.channels) {
                allChannels = [...allChannels, ...result.channels];
            }

            cursor = result.response_metadata?.next_cursor;
        } while (cursor);
    } catch (error: any) {
        console.error("Error fetching channels with private/mpim types:", error?.data?.error || error);

        // Fallback: Try fetching only public channels if scope error occurs
        if (error?.data?.error === 'missing_scope') {
            try {
                console.log("Falling back to public_channel only...");
                cursor = undefined;
                allChannels = []; // Reset
                do {
                    const result: any = await slack.conversations.list({
                        types: "public_channel",
                        exclude_archived: true,
                        limit: 200,
                        cursor: cursor,
                    });
                    if (result.channels) allChannels = [...allChannels, ...result.channels];
                    cursor = result.response_metadata?.next_cursor;
                } while (cursor);
            } catch (fallbackError) {
                console.error("Error in fallback fetching:", fallbackError);
            }
        }
    }

    cache.channels.set(cacheKey, { data: allChannels, timestamp: now });

    return allChannels;
}

// Reuse token fetching logic (Private Helper)
async function getSlackClient(wlPartnerId?: string) {
    const { client } = await getSlackClientAndType(wlPartnerId);
    return client;
}

// Extended helper to return type
async function getSlackClientAndType(wlPartnerId?: string) {
    // 1. Try User Token FIRST (so we act as the user if connected)
    try {
        const supabase = await createClientServer();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (user) {
            // Try ID first
            let { data } = await supabase.from('master_profiles').select('slack_access_token').eq('id', user.id).single();

            // Fallback: Try Email if ID lookup failed or returned no token
            if (!data?.slack_access_token && user.email) {
                const { data: emailData } = await supabase.from('master_profiles').select('slack_access_token').eq('email', user.email).single();
                data = emailData;
            }

            if (data?.slack_access_token) {
                return { client: createSlackClient(data.slack_access_token), type: 'user' as const };
            }
        }
    } catch (e) {
        // Ignore auth errors, fall back to bot
    }

    // 2. If no User Token, check for Partner-specific Bot Token
    if (wlPartnerId) {
        const adminSupabase = createAdminClient();
        const { data, error } = await adminSupabase
            .from("wl_partners")
            .select("slack_bot_token")
            .eq("id", wlPartnerId)
            .single();

        if (data?.slack_bot_token) {
            return { client: createSlackClient(data.slack_bot_token), type: 'bot' as const };
        }
    }

    // 3. Fallback: Global Bot Token
    if (process.env.SLACK_BOT_TOKEN) {
        return { client: createSlackClient(process.env.SLACK_BOT_TOKEN), type: 'bot' as const };
    }
    throw new Error("Slack bot token not found for WL");
}

export async function getChannelHistory(wlPartnerId: string | undefined, channelId: string, cursor?: string, limit: number = 30) {
    const slack = await getSlackClient(wlPartnerId);
    try {
        const result = await slack.conversations.history({
            channel: channelId,
            limit: limit,
            cursor: cursor,
        });

        const messages = result.messages ?? [];
        const nextCursor = result.response_metadata?.next_cursor;

        // Enrich files in messages with full metadata
        const enrichedMessages = await Promise.all(
            messages.map(async (msg) => {
                if (msg.files && msg.files.length > 0) {
                    // Enrich each file with full info
                    const enrichedFiles = await Promise.all(
                        msg.files.map(async (file: any) => {
                            try {
                                const fileInfo = await slack.files.info({ file: file.id });
                                return fileInfo.file || file; // Use enriched file or fallback to original
                            } catch (e) {
                                console.error(`Failed to enrich file ${file.id}:`, e);
                                return file; // Fallback to original file object
                            }
                        })
                    );
                    return { ...msg, files: enrichedFiles };
                }
                return msg;
            })
        );

        return { messages: enrichedMessages, has_more: result.has_more, nextCursor };
    } catch (e) {
        console.error("Error fetching history:", e);
        return { messages: [], has_more: false, nextCursor: undefined };
    }
}

export async function sendMessage(
    wlPartnerId: string | undefined,
    channelId: string,
    text: string,
    username?: string,
    iconUrl?: string,
    threadTs?: string // New optional parameter for threads
) {
    const { client, type } = await getSlackClientAndType(wlPartnerId);
    try {
        const payload: any = {
            channel: channelId,
            text: text,
        };
        // Only override username/icon if it's a BOT. 
        // If it's a User Token, Slack uses their real identity automatically.

        if (type === 'bot') {
            if (username) payload.username = username;
            if (iconUrl) payload.icon_url = iconUrl;
        } else {
            // Force user identity (even though default for User Token, sometimes helps)
            payload.as_user = true;
        }

        if (threadTs) {
            payload.thread_ts = threadTs;
        }

        const result = await client.chat.postMessage(payload);
        return { success: true, ts: result.ts };
    } catch (e) {
        console.error("Error sending message:", e);
        return { success: false, error: e };
    }
}

export async function getMessage(channelId: string, messageTs: string, wlPartnerId?: string) {
    const slack = await getSlackClient(wlPartnerId);
    try {
        const result = await slack.conversations.replies({
            channel: channelId,
            ts: messageTs,
            limit: 1,
            inclusive: true
        });

        if (result.messages && result.messages.length > 0) {
            return result.messages[0];
        }
        return null;
    } catch (e) {
        console.error("Error fetching message:", e);
        return null;
    }
}


export async function addReaction(wlPartnerId: string | undefined, channelId: string, timestamp: string, emojiName: string) {
    console.log("Server Action addReaction:", { channelId, timestamp, emojiName });
    const { client } = await getSlackClientAndType(wlPartnerId);
    try {
        await client.reactions.add({
            channel: channelId,
            timestamp: timestamp,
            name: emojiName
        });
        return { success: true };
    } catch (e: any) {
        if (e?.data?.error === 'already_reacted') {
            return { success: true }; // Treat as success
        }
        console.error("Error adding reaction:", e);
        return { success: false, error: e };
    }
}

export async function getThreadReplies(wlPartnerId: string | undefined, channelId: string, threadTs: string) {
    const { client } = await getSlackClientAndType(wlPartnerId);
    try {
        const result = await client.conversations.replies({
            channel: channelId,
            ts: threadTs
        });
        return { success: true, messages: result.messages || [] };
    } catch (e) {
        console.error("Error fetching replies:", e);
        return { success: false, error: e };
    }
}

export async function uploadFile(wlPartnerId: string | undefined, channelId: string, formData: FormData, threadTs?: string) {
    const { client } = await getSlackClientAndType(wlPartnerId);
    const file = formData.get("file") as File;

    if (!file) return { error: "No file provided" };

    try {
        // 1. Get Upload URL
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadUrlRes = await client.files.getUploadURLExternal({
            filename: file.name,
            length: buffer.length,
        });

        if (!uploadUrlRes.ok || !uploadUrlRes.upload_url || !uploadUrlRes.file_id) {
            throw new Error("Failed to get upload URL");
        }

        const { upload_url, file_id } = uploadUrlRes;

        // 2. Upload File to URL
        const uploadBody = new FormData();
        uploadBody.append('file', new Blob([buffer]), file.name);

        const uploadRes = await fetch(upload_url, {
            method: 'POST',
            body: uploadBody,
        });

        if (!uploadRes.ok) {
            throw new Error(`Failed to upload file to external URL: ${uploadRes.statusText}`);
        }

        // 3. Complete Upload
        const completeRes = await client.files.completeUploadExternal({
            files: [{ id: file_id, title: file.name }],
            channel_id: channelId,
            thread_ts: threadTs,
        });

        if (!completeRes.ok) {
            throw new Error("Failed to complete upload");
        }

        // 4. Fetch full file info to return rich metadata immediately
        let fileData: any = { id: file_id, name: file.name };
        try {
            const infoRes = await client.files.info({ file: file_id });
            if (infoRes.ok && infoRes.file) {
                fileData = infoRes.file;
            }
        } catch (infoError) {
            console.warn("Failed to fetch rich file info after upload:", infoError);
            // Fallback to basic info is already set
        }

        return { success: true, file: fileData };

    } catch (e) {
        console.error("Error uploading file:", e);
        return { success: false, error: e };
    }
}

export async function createChannel(wlPartnerId: string | undefined, channelName: string, isPrivate: boolean = false, userIds: string[] = []) {
    const slack = await getSlackClient(wlPartnerId);
    try {
        // 0. Get Identity of the Creator (User or Bot)
        const authTest = await slack.auth.test();
        const creatorId = authTest.user_id;

        console.log(`Creating channel '${channelName}' as user/bot: ${creatorId}. Initial invite list: ${JSON.stringify(userIds)}`);

        // 1. Create Channel
        const result = await slack.conversations.create({
            name: channelName,
            is_private: isPrivate
        });

        if (!result.channel?.id) {
            throw new Error("Failed to create channel");
        }

        const channelId = result.channel.id;

        // 2. Invite Users
        const validUserIds = userIds.filter(id => id !== creatorId);

        if (validUserIds.length > 0) {
            try {
                console.log(`Inviting users to ${channelId}: ${validUserIds.join(",")}`);
                await slack.conversations.invite({
                    channel: channelId,
                    users: validUserIds.join(",")
                });
                console.log("Invitation successful");
            } catch (inviteError: any) {
                console.warn("Error inviting users:", inviteError?.data?.error || inviteError);
            }
        } else {
            console.log("No valid users to invite (or only creator was selected).");
        }

        // Invalidate channel cache
        const cacheKey = wlPartnerId || "default";
        cache.channels.delete(cacheKey);

        return { success: true, channel: result.channel };
    } catch (e: any) {
        console.error("Error creating channel:", JSON.stringify(e));
        return {
            success: false,
            error: {
                message: e.message,
                code: e.code,
                data: e.data
            }
        };
    }
}

export async function getUsers(wlPartnerId?: string) {
    const cacheKey = wlPartnerId || "default";
    const now = Date.now();
    const cached = cache.users.get(cacheKey);

    if (cached && (now - cached.timestamp < CACHE_TTL)) {
        return cached.data;
    }

    const slack = await getSlackClient(wlPartnerId);
    try {
        const result = await slack.users.list({});
        const members = result.members ?? [];
        // if (members.length > 0) {
        //     // console.log("DEBUG: getUsers - First User Profile:", JSON.stringify(members[0]?.profile, null, 2));
        // }
        cache.users.set(cacheKey, { data: members, timestamp: now });
        return members;
    } catch (e) {
        console.error("Error fetching users:", e);
        return [];
    }
}

export async function getChannelLastMessageTs(wlPartnerId: string | undefined, channelIds: string[]) {
    const slack = await getSlackClient(wlPartnerId);
    const results: Record<string, string> = {};

    await Promise.all(channelIds.map(async (id) => {
        try {
            const result = await slack.conversations.history({
                channel: id,
                limit: 1,
            });
            if (result.messages && result.messages.length > 0) {
                results[id] = result.messages[0].ts!;
            }
        } catch (e) {
            // ignore
        }
    }));

    return results;
}

export async function getSlackIdentity(wlPartnerId?: string) {
    const { client, type } = await getSlackClientAndType(wlPartnerId);

    // If we fell back to a bot token, we consider the user "not connected"
    if (type === 'bot') {
        return null;
    }

    try {
        const result = await client.auth.test();
        return {
            id: result.user_id,
            name: result.user
        };
    } catch (e) {
        console.error("Error fetching identity:", e);
        return null;
    }
}


export async function fetchSlackDMs(wlPartnerId?: string) {
    const slack = await getSlackClient(wlPartnerId);
    try {
        let allDMs: any[] = [];
        let cursor: string | undefined = undefined;
        let pageCount = 0;
        const MAX_PAGES = 50;

        console.log("Fetching DMs with pagination...");

        do {
            pageCount++;
            if (pageCount > MAX_PAGES) {
                console.warn("fetchSlackDMs: Max pages reached, stopping.");
                break;
            }

            const result: any = await slack.conversations.list({
                types: "im",
                exclude_archived: true,
                limit: 100, // Reasonable limit
                cursor: cursor,
            });

            if (result.channels) {
                allDMs = [...allDMs, ...result.channels];
            }

            cursor = result.response_metadata?.next_cursor;
        } while (cursor);

        console.log(`Total DMs fetched: ${allDMs.length}`);
        return allDMs;
    } catch (e: any) {
        console.error("Error fetching DMs:", e?.data?.error || e);
        return [];
    }
}

export async function isSlackConnectedInDB() {
    try {
        const supabase = await createClientServer();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        // Try ID first
        let { data, error } = await supabase
            .from('master_profiles')
            .select('slack_access_token')
            .eq('id', user.id)
            .single();

        // Fallback: Try Email if ID lookup failed or returned no token
        if (!data?.slack_access_token && user.email) {
            const { data: emailData } = await supabase
                .from('master_profiles')
                .select('slack_access_token')
                .eq('email', user.email)
                .single();
            data = emailData;
        }

        return !!data?.slack_access_token;
    } catch (e) {
        console.error("Error checking slack connection in DB:", e);
        return false;
    }
}
