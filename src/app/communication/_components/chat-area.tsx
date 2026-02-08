'use client';

import { Loader2, Slack, Search, Bell, Lock, Hash } from 'lucide-react';
import { MessageInput } from './message-input';
import { MessageItem } from './message-item';
import type { Message } from '@/app/actions/slack-actions';
import { Channel } from './channel-sidebar';
import VanquishLogoSvg from '@/components/svg/vanquish-logo';
import Button from '@/components/core/button';

interface ChatAreaProps {
    channelsData: any;
    selectedChannel: string | null;
    allChannels: Channel[];
    messages: Message[];
    isLoading: boolean;
    users: Record<string, any>;
    currentUserId: string | null;
    onReply: (msg: any) => void;
    onReact: (message: any, emoji: string) => Promise<void>;
    onSendMessage: (text: string, file?: File | null) => Promise<void>;
    scrollRef: React.RefObject<HTMLDivElement | null>;
    onLoadMore: () => void;
    hasMore: boolean;
    isFetchingMore: boolean;
    activeThreadId?: string;
    highlightMessageId?: string | null;
    onMediaClick?: (url: string, name: string, type: string) => void;
}

export function ChatArea({
    channelsData,
    selectedChannel,
    allChannels,
    messages,
    isLoading,
    users,
    currentUserId,
    onReply,
    onReact,
    onSendMessage,
    scrollRef,
    onLoadMore,
    hasMore,
    isFetchingMore,
    activeThreadId,
    highlightMessageId,
    onMediaClick
}: ChatAreaProps) {
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop } = e.currentTarget;
        if (scrollTop < 100 && hasMore && !isFetchingMore && !isLoading) {
            onLoadMore();
        }
    };

    const selectedChannelData = allChannels.find(c => c.id === selectedChannel);

    // SLACK CONNECTION HANDLING
    // 1. If we are still checking the DB, show skeleton
    // 2. If DB says NOT connected, show overlay
    // 3. If DB says connected but slow identity call is still pending, show skeleton
    const isDbLoading = channelsData?.isDbLoading;
    const isIdentityLoading = channelsData?.isIdentityLoading;
    const isConnected = channelsData?.isSlackConnected;

    if (isDbLoading || (isConnected && isIdentityLoading && !currentUserId)) {
        return <ChatAreaSkeleton />;
    }

    return (
        <div
            className="flex-1 flex flex-col min-w-0 h-full relative"
            style={{ background: '#14161B' }}
        >
            {!isConnected && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#14161B] opacity-90" />
                    <div
                        className="relative z-10 flex flex-col items-center"
                        style={{
                            width: '380px',
                            padding: '24px',
                            gap: '36px',
                            borderRadius: '12px',
                            background: '#1D1E21',
                            boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        {/* Icon */}
                        <div style={{
                            display: 'flex',
                            width: '52px',
                            height: '52px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                            borderRadius: '12px',
                            border: '0.5px solid #636363',
                            background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.10) -0.21%, rgba(255, 255, 255, 0.01) 105.1%)'
                        }}>
                            <Slack className="w-5 h-5 text-white" />
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <h2 style={{
                                color: '#FFF',
                                fontSize: '20px',
                                fontStyle: 'normal',
                                fontWeight: 500,
                                lineHeight: '24px',
                                textAlign: 'center'
                            }}>
                                Connect slack to get started
                            </h2>

                            <p style={{
                                color: '#888',
                                textAlign: 'center',
                                fontSize: '14px',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                lineHeight: '18px',
                                maxWidth: '300px'
                            }}>
                                Connect your slack workspace to start communicating with your team
                            </p>
                        </div>

                        <a
                            href="/api/auth/slack/login?type=user"
                            className="w-full h-[40px] text-sm flex items-center justify-center rounded-[500px] border-[0.5px] border-[#636363] bg-white/10 hover:bg-white/5 text-white transition-colors"
                        >
                            Connect Slack
                        </a>
                    </div>
                </div>
            )}
            {/* Header - Only show when Slack is connected */}
            {isConnected && (
                <div
                    className="h-14 flex items-center justify-between px-4 shrink-0"
                    style={{ borderBottom: '1px solid #1A1B1E', background: '#1A1B1E' }}
                >
                    <div className="flex items-center gap-2">
                        {selectedChannelData?.type === 'private' ? (
                            <Lock className="w-5 h-5 text-zinc-500" />
                        ) : (
                            <Hash className="w-5 h-5 text-zinc-500" />
                        )}
                        <h3
                            className="font-medium"
                            style={{ color: '#FFF', fontSize: '16px', lineHeight: '18px' }}
                        >
                            {selectedChannelData?.name.replace('wl-', '') || 'Select a channel'}
                        </h3>
                    </div>
                    {/* <div className="flex items-center gap-1 text-zinc-400">
                        <Search className="w-4 h-4 cursor-pointer hover:text-zinc-600" />
                        <Bell className="w-4 h-4 cursor-pointer hover:text-zinc-600" />
                    </div> */}
                </div>
            )}

            {/* Empty State */}
            {!selectedChannel && isConnected && (
                <div className="flex-1 flex flex-col items-center justify-center h-full text-center px-6">
                    <VanquishLogoSvg className="mb-8 opacity-20" />
                    <h3 className="text-lg font-medium text-white mb-2">
                        Select a channel to start communicating
                    </h3>
                    <p className="text-sm text-zinc-500 max-w-sm">
                        Stay connected with admins and easily communicate with the Vanquish team for any queries or issues.
                    </p>
                </div>
            )}

            {/* Messages */}
            {selectedChannel && (
                <div
                    className="flex-1 overflow-y-auto px-4 py-2"
                    ref={scrollRef}
                    onScroll={handleScroll}
                    style={{ scrollbarWidth: 'none' }}
                >
                    {isLoading && messages.length === 0 ? (
                        <div className="flex-1 flex flex-col gap-4 py-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex gap-3 animate-pulse">
                                    <div className="w-9 h-9 rounded-full bg-white/5" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-white/10 rounded w-24" />
                                        <div className="h-3 bg-white/5 rounded w-full" />
                                        <div className="h-3 bg-white/5 rounded w-3/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (messages || []).length === 0 ? (
                        <div className="flex h-full items-center justify-center text-zinc-500 text-sm">
                            No messages in this channel yet.
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {isFetchingMore && (
                                <div className="flex justify-center py-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                                </div>
                            )}
                            {(messages || []).map((msg: Message, i: number) => {
                                const prevMsg = (messages || [])[i - 1];
                                const isCompact = prevMsg && prevMsg.user === msg.user && (parseFloat(msg.ts) - parseFloat(prevMsg.ts) < 300) && prevMsg.subtype !== 'channel_join' && msg.subtype !== 'channel_join';

                                if (msg.subtype === 'channel_join') {
                                    const userName = users[msg.user]?.real_name || users[msg.user]?.name || msg.user;
                                    return (
                                        <div key={msg.ts} className="flex justify-center my-4 relative">
                                            <div className="absolute inset-x-0 top-1/2 border-t border-white/5 -z-10"></div>
                                            <div
                                                className="px-2 text-[11px] text-zinc-400 flex items-center gap-1"
                                                style={{ background: '#14161B' }}
                                            >
                                                <span className="font-bold text-zinc-500">@{userName}</span> joined the channel
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <MessageItem
                                        key={msg.ts}
                                        message={{
                                            ...msg,
                                            user: users[msg.user]?.real_name || users[msg.user]?.name || msg.user,
                                            avatar: users[msg.user]?.profile?.image_48 || msg.avatar
                                        }}
                                        isActive={activeThreadId === msg.ts || highlightMessageId === msg.ts}
                                        isCompact={isCompact}
                                        onReply={onReply}
                                        onReact={onReact}
                                        onMediaClick={onMediaClick}
                                        currentUserId={currentUserId}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Input Area */}
            {selectedChannel && (
                <div className="shrink-0 p-4 pt-2">
                    <MessageInput
                        onSendMessage={onSendMessage}
                        channelName={selectedChannelData?.name.replace('wl-', '')}
                    />
                </div>
            )}
        </div>
    );
}

function ChatAreaSkeleton() {
    return (
        <div className="flex-1 flex flex-col min-w-0 h-full bg-[#14161B]">
            {/* Header Skeleton */}
            <div className="h-14 flex items-center px-4 border-b border-[#1A1B1E] bg-[#1A1B1E] animate-pulse">
                <div className="w-5 h-5 rounded bg-white/5 mr-2" />
                <div className="h-4 bg-white/10 rounded w-32" />
            </div>

            {/* Messages Skeleton */}
            <div className="flex-1 p-4 space-y-6 overflow-hidden">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-10 h-10 rounded-lg bg-white/5 shrink-0" />
                        <div className="flex-1 space-y-2 mt-1">
                            <div className="flex items-center gap-2">
                                <div className="h-3 bg-white/10 rounded w-28" />
                                <div className="h-2 bg-white/5 rounded w-12" />
                            </div>
                            <div className="h-3 bg-white/5 rounded w-full" />
                            <div className="h-3 bg-white/5 rounded w-[80%]" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Skeleton */}
            <div className="p-4 pt-2 shrink-0 animate-pulse">
                <div className="h-[44px] bg-white/5 rounded-[8px] w-full" />
            </div>
        </div>
    );
}
