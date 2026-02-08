"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    fetchSlackChannels,
    fetchSlackDMs,
    getChannelHistory,
    getUsers,
    sendMessage,
    uploadFile,
    getSlackIdentity,
    getChannelLastMessageTs,
    addReaction,
    isSlackConnectedInDB
} from "@/app/actions/slack-actions";
import { ChannelSidebar } from "../_components/channel-sidebar";
import { ChatArea } from "../_components/chat-area";
import { MessageInput } from "../_components/message-input";
import { ThreadView } from "../_components/thread-view";
import { ThreadsView } from "../_components/threads-view";
import { MediaViewer } from "../_components/media-viewer";
import { CreateChannelModal } from "../_components/create-channel-modal";
import { DirectoryView } from "../_components/directory-view";
import { fetchDirectoryRoles } from "../actions";

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
    const [activeView, setActiveView] = useState<'chat' | 'threads' | 'directory'>('chat');
    const [viewingMedia, setViewingMedia] = useState<{ url: string; name: string; type: string } | null>(null);
    const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);

    // Scroll handling
    const chatScrollRef = useRef<HTMLDivElement>(null);

    // Sync URL -> State
    useEffect(() => {
        if (channelParam && channelParam !== selectedChannelId) {
            setSelectedChannelId(channelParam);
            setActiveView('chat');
        }
    }, [channelParam, selectedChannelId]);

    const handleSelectChannel = (id: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('channel', id);
        params.delete('thread');
        params.delete('messageId');
        router.push(`${pathname}?${params.toString()}`);
        setSelectedChannelId(id);
        setActiveView('chat');
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

    // 1. Data Fetching
    const { data: identity, isLoading: isIdentityLoading } = useQuery({
        queryKey: ['slack-identity'],
        queryFn: () => getSlackIdentity(),
        staleTime: 60 * 60 * 1000,
    });

    const { data: isDbConnected, isLoading: isDbLoading } = useQuery({
        queryKey: ['slack-db-connection'],
        queryFn: () => isSlackConnectedInDB(),
        staleTime: 5 * 60 * 1000,
    });

    const isConnected = !!identity?.id;

    const { data: channels = [], isLoading: isChannelsLoading } = useQuery({
        queryKey: ['slack-channels'],
        queryFn: () => fetchSlackChannels(),
        staleTime: 5 * 60 * 1000,
        enabled: isConnected,
    });

    const { data: dms = [], isLoading: isDMsLoading } = useQuery({
        queryKey: ['slack-dms'],
        queryFn: () => fetchSlackDMs(),
        staleTime: 5 * 60 * 1000,
        enabled: isConnected,
    });

    const { data: userList = [], isLoading: isUsersLoading } = useQuery({
        queryKey: ['slack-users'],
        queryFn: () => getUsers(),
        staleTime: 5 * 60 * 1000,
        enabled: isConnected,
    });

    const { data: directoryRoles = { partners: [], admins: [] } } = useQuery({
        queryKey: ['slack-directory-roles'],
        queryFn: async () => {
            const roles = await fetchDirectoryRoles();
            console.log("DEBUG: SlackInterface - Fetched Roles:", roles);
            return roles;
        },
        staleTime: 5 * 60 * 1000,
    });

    // Memoize users map
    const users = useMemo(() => {
        const map: Record<string, any> = {};
        if (Array.isArray(userList)) {
            userList.forEach((u: any) => { if (u?.id) map[u.id] = u; });
        }
        console.log("DEBUG: SlackInterface - Users Map Size:", Object.keys(map).length);
        if (Object.keys(map).length > 0) {
            const sampleUser = Object.values(map)[0];
            console.log("DEBUG: SlackInterface - Sample User:", { id: sampleUser.id, email: sampleUser.profile?.email });
        }
        return map;
    }, [userList]);

    const isInitialLoading = isChannelsLoading || isDMsLoading || isUsersLoading;
    const currentSlackUserId = identity?.id || null;

    const allChannelsForSidebar = useMemo(() => {
        const sidebarChannels: any[] = (channels || []).map((c: any) => ({
            id: c.id,
            name: c.name,
            type: c.is_private ? 'private' : 'public',
            description: c.purpose?.value || '',
            num_members: c.num_members,
            is_member: c.is_member,
            userId: c.creator,
            avatar: undefined
        }));

        const sidebarDms = (dms || []).map((d: any) => {
            const otherUser = users[d.user];
            return {
                id: d.id,
                name: otherUser?.real_name || otherUser?.name || "Direct Message",
                type: 'dm',
                avatar: otherUser?.profile?.image_512 || otherUser?.profile?.image_192 || otherUser?.profile?.image_original || otherUser?.profile?.image_48,
                userId: d.user,
                is_member: true,
                num_members: 2
            };
        });

        return [...sidebarChannels, ...sidebarDms];
    }, [channels, dms, users]);

    // 2. Messages
    const {
        data: messagesData,
        isLoading: isHistoryLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['slack-messages', selectedChannelId],
        queryFn: async ({ pageParam = undefined }) => {
            if (!selectedChannelId) return { messages: [], hasMore: false, nextCursor: undefined };
            const history = await getChannelHistory(undefined, selectedChannelId, pageParam);
            return {
                messages: history.messages || [],
                hasMore: history.has_more,
                nextCursor: history.nextCursor
            };
        },
        getNextPageParam: (lastPage: any) => lastPage?.nextCursor,
        initialPageParam: undefined,
        enabled: !!selectedChannelId && activeView === 'chat',
        refetchInterval: 60000,
        staleTime: 5000,
    });

    const messages = useMemo(() => {
        if (!messagesData) return EMPTY_ARRAY;
        return [...messagesData.pages]
            .reverse()
            .flatMap((page: any) => [...page.messages].reverse());
    }, [messagesData]);

    useEffect(() => {
        if (threadParam && selectedChannelId && messages.length > 0) {
            const threadParent = messages.find((m: any) => m.ts === threadParam);
            if (threadParent) setActiveThread(threadParent);
        } else if (!threadParam) {
            setActiveThread(null);
        }
    }, [threadParam, selectedChannelId, messages]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (selectedChannelId && activeView === 'chat' && chatScrollRef.current) {
            const scrollContainer = chatScrollRef.current;
            // Use setTimeout to ensure DOM is updated
            setTimeout(() => {
                scrollContainer.scrollTo({
                    top: scrollContainer.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }, [selectedChannelId, activeView, messages.length]);

    // 3. Unread Status
    const [lastReadTimestamps, setLastReadTimestamps] = useState<Record<string, string>>({});
    const [unreadChannels, setUnreadChannels] = useState<Set<string>>(new Set());

    useEffect(() => {
        const stored = localStorage.getItem("slack_last_read_ts");
        if (stored) setLastReadTimestamps(JSON.parse(stored));
    }, []);

    useEffect(() => {
        if (selectedChannelId && activeView === 'chat' && messages.length > 0) {
            const latestTs = messages[messages.length - 1]?.ts;
            if (latestTs && lastReadTimestamps[selectedChannelId] !== latestTs) {
                setLastReadTimestamps(prev => {
                    if (prev[selectedChannelId] === latestTs) return prev;
                    const updated = { ...prev, [selectedChannelId]: latestTs };
                    localStorage.setItem("slack_last_read_ts", JSON.stringify(updated));
                    return updated;
                });
            }
        }
    }, [selectedChannelId, messages, activeView, lastReadTimestamps]);

    useEffect(() => {
        if (selectedChannelId && activeView === 'chat') {
            setUnreadChannels(prev => {
                if (!prev.has(selectedChannelId)) return prev;
                const next = new Set(prev);
                next.delete(selectedChannelId);
                return next;
            });
        }
    }, [selectedChannelId, activeView]);

    const { data: latestTsMap } = useQuery({
        queryKey: ['slack-unread-map-global'],
        queryFn: async () => {
            if (channels.length === 0) return {};
            const allIds = [...channels.map((c: any) => c.id), ...dms.map((d: any) => d.id)];
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
            Object.entries(latestTsMap as Record<string, string>).forEach(([cid, latestTs]) => {
                if (cid === selectedChannelId && activeView === 'chat') return;
                const lastRead = lastReadTimestamps[cid] || "0";
                if (parseFloat(latestTs as string) > parseFloat(lastRead)) {
                    if (!next.has(cid)) {
                        next.add(cid);
                        changed = true;
                    }
                }
            });
            return changed ? next : prev;
        });
    }, [latestTsMap, lastReadTimestamps, selectedChannelId, activeView]);

    // 4. Mutations
    const sendMessageMutation = useMutation({
        mutationFn: async ({ text, threadTs }: { text: string, threadTs?: string }) => {
            if (!selectedChannelId) return;
            return await sendMessage(undefined, selectedChannelId, text, "Master Admin", undefined, threadTs);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['slack-messages', selectedChannelId] });
            if (variables.threadTs) {
                queryClient.invalidateQueries({ queryKey: ['slack-thread-replies', selectedChannelId, variables.threadTs] });
            }
        }
    });

    const reactMutation = useMutation({
        mutationFn: async ({ timestamp, emojiName }: { timestamp: string, emojiName: string }) => {
            if (!selectedChannelId) return;
            return await addReaction(undefined, selectedChannelId, timestamp, emojiName);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['slack-messages', selectedChannelId] });
        }
    });

    return (
        <div className="flex h-full rounded-lg overflow-hidden bg-card section-border shadow-sm font-sans antialiased">
            {currentSlackUserId && (
                <ChannelSidebar
                    channelsData={{
                        isSlackConnected: !!identity,
                        currentSlackUserId: currentSlackUserId
                    }}
                    channelsLoading={isInitialLoading}
                    allChannels={allChannelsForSidebar}
                    selectedChannel={selectedChannelId}
                    setSelectedChannel={handleSelectChannel}
                    unreadStatus={unreadChannels}
                    lastReadTimestamps={lastReadTimestamps}
                    activeView={activeView}
                    setActiveView={setActiveView}
                    slackAuthUrl={undefined}
                    users={users}
                    onOpenCreateChannel={() => setIsCreateChannelModalOpen(true)}
                />
            )}

            <div className="flex-1 min-w-0 bg-[#0F1115] relative flex flex-col h-full">
                {activeView === 'directory' ? (
                    <DirectoryView
                        allChannels={allChannelsForSidebar}
                        users={users}
                        onChannelSelect={(id) => handleSelectChannel(id)}
                        directoryRoles={directoryRoles}
                    />
                ) : activeView === 'threads' ? (
                    <ThreadsView
                        allChannels={allChannelsForSidebar}
                        currentUserId={currentSlackUserId ?? undefined}
                        onThreadClick={(msg: any) => {
                            handleOpenThread(msg);
                            setActiveView('chat');
                            if (msg.channelId) handleSelectChannel(msg.channelId as string);
                        }}
                    />
                ) : (
                    <div className="flex-1 min-h-0 flex flex-row h-full">
                        <ChatArea
                            channelsData={{
                                isSlackConnected: !!identity || (isDbConnected ?? false),
                                isDbLoading: isDbLoading,
                                isIdentityLoading: isIdentityLoading,
                                currentSlackUserId: currentSlackUserId
                            }}
                            selectedChannel={selectedChannelId}
                            allChannels={allChannelsForSidebar}
                            messages={messages}
                            isLoading={isHistoryLoading || isChannelsLoading}
                            currentUserId={currentSlackUserId}
                            onReply={handleOpenThread}
                            users={users}
                            onMediaClick={(url: string, name: string, type: string) => setViewingMedia({ url, name, type })}
                            onSendMessage={async (text: string, file?: File | null) => {
                                if (file && selectedChannelId) {
                                    const formData = new FormData();
                                    formData.append("file", file);
                                    await uploadFile(undefined, selectedChannelId, formData);
                                }
                                if (text.trim()) {
                                    await sendMessageMutation.mutateAsync({ text });
                                }
                            }}
                            onReact={async (message: any, emoji: string) => {
                                await reactMutation.mutateAsync({ timestamp: message.ts, emojiName: emoji });
                            }}
                            onLoadMore={fetchNextPage}
                            hasMore={hasNextPage}
                            isFetchingMore={isFetchingNextPage}
                            scrollRef={chatScrollRef}
                            activeThreadId={activeThread?.ts}
                            highlightMessageId={messageIdParam}
                        />

                        {activeThread && selectedChannelId && (
                            <ThreadView
                                parentMessage={activeThread}
                                channelId={selectedChannelId}
                                currentUserId={currentSlackUserId}
                                onClose={handleCloseThread}
                                users={users}
                                onMediaClick={(url, name, type) => setViewingMedia({ url, name, type })}
                            />
                        )}
                    </div>
                )}
            </div>

            <MediaViewer
                media={viewingMedia}
                onClose={() => setViewingMedia(null)}
            />

            <CreateChannelModal
                isOpen={isCreateChannelModalOpen}
                onClose={() => setIsCreateChannelModalOpen(false)}
                onCreated={() => {
                    setIsCreateChannelModalOpen(false);
                    queryClient.invalidateQueries({ queryKey: ['slack-channels'] });
                }}
                users={users}
            />
        </div>
    );
}
