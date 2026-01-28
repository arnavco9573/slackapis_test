"use client";

import { useState, useEffect, useMemo } from "react";
import { ChannelSidebar } from "../_components/channel-sidebar";
import { ConnectSlackButton } from "../_components/connect-slack-button";
import { ChatWindow } from "../_components/chat-window";
import { MessageInput } from "../_components/message-input";
import { fetchSlackChannels, getChannelHistory, sendMessage, uploadFile, getUsers, getChannelLastMessageTs, getSlackIdentity, fetchSlackDMs, clearSlackCache } from "@/app/actions/slack-actions";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { ThreadView } from "../_components/thread-view";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const EMPTY_ARRAY: any[] = [];

export function SlackInterface() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const channelParam = searchParams.get('channel');
    const threadParam = searchParams.get('thread');
    const messageIdParam = searchParams.get('messageId');

    const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
    const [activeThread, setActiveThread] = useState<any | null>(null);

    // Sync URL -> State
    useEffect(() => {
        if (channelParam && channelParam !== selectedChannelId) {
            setSelectedChannelId(channelParam);
        }
    }, [channelParam]);

    const handleSelectChannel = (id: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('channel', id);
        params.delete('thread');
        params.delete('messageId');
        router.push(`${pathname}?${params.toString()}`);
        setSelectedChannelId(id);
    };

    const handleOpenThread = (msg: any) => {
        const params = new URLSearchParams(searchParams);
        params.set('thread', msg.ts);
        router.push(`${pathname}?${params.toString()}`);
        setActiveThread(msg);
    };

    const handleCloseThread = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('thread');
        router.push(`${pathname}?${params.toString()}`);
        setActiveThread(null);
    };

    // 1. Data Fetching - Wrapped in arrow functions to fix Type Errors
    const { data: channels = [], isLoading: isChannelsLoading } = useQuery({
        queryKey: ['slack-channels'],
        queryFn: () => fetchSlackChannels(),
        staleTime: 5 * 60 * 1000,
    });

    const { data: dms = [], isLoading: isDMsLoading } = useQuery({
        queryKey: ['slack-dms'],
        queryFn: () => fetchSlackDMs(),
        staleTime: 5 * 60 * 1000,
    });

    const { data: userList = [], isLoading: isUsersLoading } = useQuery({
        queryKey: ['slack-users'],
        queryFn: () => getUsers(),
        staleTime: 5 * 60 * 1000,
    });

    const { data: identity } = useQuery({
        queryKey: ['slack-identity'],
        queryFn: () => getSlackIdentity(),
        staleTime: 60 * 60 * 1000,
    });

    // Memoize users map
    const users = useMemo(() => {
        const map: Record<string, any> = {};
        if (Array.isArray(userList)) {
            userList.forEach((u: any) => { if (u?.id) map[u.id] = u; });
        }
        return map;
    }, [userList]);

    const isInitialLoading = isChannelsLoading || isDMsLoading || isUsersLoading;
    const currentSlackUserId = identity?.id || null;

    // 2. Messages
    const {
        data: messagesData,
        isLoading: isHistoryLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['slack-messages', selectedChannelId],
        queryFn: async ({ pageParam = undefined }: { pageParam?: string }) => {
            if (!selectedChannelId) return { messages: [], nextCursor: undefined };
            return await getChannelHistory(undefined, selectedChannelId, pageParam, 30);
        },
        getNextPageParam: (lastPage: any) => lastPage?.nextCursor,
        initialPageParam: undefined,
        enabled: !!selectedChannelId,
        refetchInterval: 60000,
        staleTime: 5000,
    });

    const messages = useMemo(() => {
        return messagesData ? messagesData.pages.flatMap((page: any) => page.messages) : EMPTY_ARRAY;
    }, [messagesData]);

    // Deep link thread loading
    useEffect(() => {
        if (threadParam && selectedChannelId && messages.length > 0) {
            const threadParent = messages.find((m: any) => m.ts === threadParam);
            if (threadParent) setActiveThread(threadParent);
        } else if (!threadParam) {
            setActiveThread(null);
        }
    }, [threadParam, selectedChannelId, messages]);

    // 3. Unread Status
    const [lastReadTimestamps, setLastReadTimestamps] = useState<Record<string, string>>({});
    const [unreadChannels, setUnreadChannels] = useState<Set<string>>(new Set());

    useEffect(() => {
        const stored = localStorage.getItem("slack_last_read_ts");
        if (stored) setLastReadTimestamps(JSON.parse(stored));
    }, []);

    useEffect(() => {
        if (selectedChannelId) {
            const nowTs = (Date.now() / 1000).toString();
            setLastReadTimestamps(prev => {
                const updated = { ...prev, [selectedChannelId]: nowTs };
                localStorage.setItem("slack_last_read_ts", JSON.stringify(updated));
                return updated;
            });
            setUnreadChannels(prev => {
                const next = new Set(prev);
                next.delete(selectedChannelId);
                return next;
            });
        }
    }, [selectedChannelId, messages]);

    const { data: latestTsMap } = useQuery({
        queryKey: ['slack-unread-map-global'],
        queryFn: async () => {
            if (channels.length === 0) return {};
            const channelIds = channels.map((c: any) => c.id);
            const dmIds = dms.map((d: any) => d.id);
            const allIds = [...channelIds, ...dmIds];
            if (allIds.length === 0) return {};
            return await getChannelLastMessageTs(undefined, allIds);
        },
        enabled: channels.length > 0,
        refetchInterval: 60000,
        initialData: {},
    });

    useEffect(() => {
        if (!latestTsMap) return;
        setUnreadChannels(prev => {
            const next = new Set(prev);
            let changed = false;
            Object.entries(latestTsMap).forEach(([cid, latestTs]) => {
                if (cid === selectedChannelId) return;
                const lastRead = lastReadTimestamps[cid] || "0";
                // @ts-ignore
                if (parseFloat(latestTs) > parseFloat(lastRead)) {
                    if (!next.has(cid)) {
                        next.add(cid);
                        changed = true;
                    }
                }
            });
            return changed ? next : prev;
        });
    }, [latestTsMap, lastReadTimestamps, selectedChannelId]);

    // 4. Mutations
    const sendMessageMutation = useMutation({
        mutationFn: async (text: string) => {
            if (!selectedChannelId) return;
            return await sendMessage(undefined, selectedChannelId, text, "Master Admin", undefined);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['slack-messages', selectedChannelId] });
        }
    });

    const uploadFileMutation = useMutation({
        mutationFn: async (file: File) => {
            if (!selectedChannelId) return;
            const formData = new FormData();
            formData.append("file", file);
            return await uploadFile(undefined, selectedChannelId, formData);
        },
        onSuccess: (data) => {
            console.log("File uploaded successfully. Rich metadata:", data);
            queryClient.invalidateQueries({ queryKey: ['slack-messages', selectedChannelId] });
        }
    });

    const handleRefresh = async () => {
        await clearSlackCache();
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['slack-channels'] }),
            queryClient.invalidateQueries({ queryKey: ['slack-dms'] }),
            queryClient.invalidateQueries({ queryKey: ['slack-users'] })
        ]);
    }

    return (
        <div className="flex h-full border dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm bg-white dark:bg-zinc-950 font-sans antialiased">
            <ChannelSidebar
                channels={channels as any[]}
                selectedChannelId={selectedChannelId}
                onSelectChannel={handleSelectChannel}
                isLoading={isInitialLoading}
                onRefresh={handleRefresh}
                unreadChannelIds={unreadChannels}
                users={users}
                dms={dms as any[]}
                currentUserId={currentSlackUserId}
            />

            <div className="flex flex-col flex-1 min-w-0 bg-white dark:bg-zinc-950">
                <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 bg-white dark:bg-zinc-950">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                            {(() => {
                                const channel = channels.find((c: any) => c.id === selectedChannelId);
                                if (channel) return channel.name?.replace('wl-', '');
                                const dm = dms.find((d: any) => d.id === selectedChannelId);
                                if (dm) {
                                    const otherUser = dm.user ? users[dm.user] : undefined;
                                    return otherUser?.real_name || otherUser?.name || "Direct Message";
                                }
                                return 'Select a channel';
                            })()}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <ConnectSlackButton isConnected={!!currentSlackUserId} />
                        {selectedChannelId && (
                            <a
                                href={`https://slack.com/app_redirect?channel=${selectedChannelId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-500 hover:text-zinc-900 transition-colors"
                                title="Open in Slack"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.527 2.527 0 0 1 8.835 24a2.527 2.527 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.527 2.527 0 0 1 2.521 2.522v2.52h-2.521zM8.834 6.313a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.527 2.527 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.527 2.527 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.527 2.527 0 0 1-2.522 2.521 2.527 2.527 0 0 1-2.522-2.521V0a2.527 2.527 0 0 1 2.522 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.521-2.522 2.527 2.527 0 0 1 2.521-2.522h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.521h-6.313z" /></svg>
                            </a>
                        )}
                    </div>
                </div>

                {selectedChannelId ? (
                    <div className="flex flex-1 overflow-hidden">
                        <div className="flex-1 flex flex-col min-w-0">
                            <ChatWindow
                                key={selectedChannelId} // ✅ KEEPS SCROLL FIX
                                messages={messages}
                                isLoading={isHistoryLoading && messages.length === 0}
                                users={users}
                                currentUserId={currentSlackUserId}
                                onReply={handleOpenThread}
                                channelId={selectedChannelId || ""}
                                hasMore={hasNextPage}
                                onLoadMore={fetchNextPage}
                                isFetchingMore={isFetchingNextPage}
                                highlightMessageId={messageIdParam}
                            />
                            <MessageInput
                                onSendMessage={async (text) => { await sendMessageMutation.mutateAsync(text); }}
                                onUploadFile={async (file) => { await uploadFileMutation.mutateAsync(file); }}
                                users={users}
                            />
                        </div>
                        {activeThread && (
                            <ThreadView
                                channelId={selectedChannelId}
                                parentMessage={activeThread}
                                onClose={handleCloseThread}
                                users={users}
                                currentUserId={currentSlackUserId}
                            />
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        Select a partner channel from the sidebar to start chatting.
                    </div>
                )}
            </div>
        </div>
    );
}