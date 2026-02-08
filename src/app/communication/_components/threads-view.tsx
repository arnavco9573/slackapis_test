'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, MessageSquare, ChevronRight, Hash, Lock } from 'lucide-react';
import { getChannelHistory, sendMessage, getMessage, uploadFile, getUsers, type Message } from '@/app/actions/slack-actions';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Channel } from './channel-sidebar';
import { MessageInput } from './message-input';

interface ThreadsViewProps {
    allChannels: Channel[];
    currentUserId: string | null | undefined;
    onThreadClick: (msg: any) => void;
}

export function ThreadsView({ allChannels, currentUserId, onThreadClick }: ThreadsViewProps) {
    const [visibleCount, setVisibleCount] = useState(20);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Fetch users for mapping IDs to names/avatars
    const { data: userList = [] } = useQuery({
        queryKey: ['slack-users'],
        queryFn: () => getUsers(),
        staleTime: 5 * 60 * 1000,
    });

    const usersMap = useMemo(() => {
        const map: Record<string, any> = {};
        if (Array.isArray(userList)) {
            userList.forEach((u: any) => { if (u?.id) map[u.id] = u; });
        }
        return map;
    }, [userList]);

    // Strategy: Fetch history from ALL allowed channels (limited to visibleCount).
    const targetChannels = useMemo(() => allChannels.slice(0, visibleCount), [allChannels, visibleCount]);

    const { data: threadsData, isLoading, isFetching } = useQuery({
        queryKey: ['all-threads', targetChannels.map(c => c.id).join(',')],
        queryFn: async () => {
            const promises = targetChannels.map(async (channel) => {
                const history = await getChannelHistory(undefined, channel.id);
                // Filter for messages that have replies (thread parents). 
                const threads = history.messages.filter((m: any) => (m.reply_count || 0) > 0);

                // Fetch the latest reply for each thread
                const threadsWithReplies = await Promise.all(threads.map(async (thread: any) => {
                    let latestReplyMessage = null;
                    if (thread.latest_reply) {
                        latestReplyMessage = await getMessage(channel.id, thread.latest_reply);
                    }
                    return {
                        ...thread,
                        channelId: channel.id,
                        channelName: channel.name,
                        channelType: channel.type,
                        latestReplyMessage
                    };
                }));

                return threadsWithReplies;
            });
            const results = await Promise.all(promises);
            // Sort by latest reply timestamp if available, else thread timestamp
            return results.flat().sort((a: any, b: any) => {
                const aTime = a.latest_reply ? parseFloat(a.latest_reply) : parseFloat(a.ts);
                const bTime = b.latest_reply ? parseFloat(b.latest_reply) : parseFloat(b.ts);
                return bTime - aTime;
            });
        },
        enabled: targetChannels.length > 0,
        staleTime: 60000,
    });

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        if (scrollHeight - scrollTop <= clientHeight + 100 && !isFetching && visibleCount < allChannels.length) {
            setVisibleCount(prev => Math.min(prev + 20, allChannels.length));
        }
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 h-full bg-[#1A1B1E] text-white font-sans antialiased">
            <div className="h-14 border-b border-white/5 flex items-center px-6 shrink-0">
                <h2 className="text-[18px] font-medium text-white">Thread</h2>
            </div>

            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
            >
                {isLoading && visibleCount === 20 ? (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                    </div>
                ) : !threadsData?.length ? (
                    <div className="flex bg-[#1A1B1E] flex-col items-center justify-center h-full text-center opacity-60">
                        <MessageSquare className="w-12 h-12 mb-4 text-zinc-500" />
                        <p>No active threads found</p>
                    </div>
                ) : (
                    <>
                        {threadsData.map((thread: any) => (
                            <ThreadCard
                                key={thread.ts}
                                thread={thread}
                                currentUserId={currentUserId || undefined}
                                usersMap={usersMap}
                                onClick={() => onThreadClick(thread)}
                            />
                        ))}
                        {isFetching && (
                            <div className="flex justify-center p-4">
                                <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function ThreadCard({ thread, currentUserId, usersMap, onClick }: {
    thread: Message & { channelId: string, channelName: string, channelType: string, latestReplyMessage?: Message | null },
    currentUserId?: string,
    usersMap: Record<string, any>,
    onClick: () => void
}) {
    // Date formatting
    const date = new Date(parseFloat(thread.ts) * 1000);
    const dateStr = format(date, 'd MMM, yyyy');

    const sender = usersMap[thread.user] || { real_name: thread.user, name: thread.user };
    const senderName = sender.real_name || sender.name || thread.user;
    const senderAvatar = sender.profile?.image_48;

    const latestReplySender = thread.latestReplyMessage ? (usersMap[thread.latestReplyMessage.user] || { real_name: thread.latestReplyMessage.user, name: thread.latestReplyMessage.user }) : null;
    const latestReplySenderName = latestReplySender ? (latestReplySender.real_name || latestReplySender.name || thread.latestReplyMessage!.user) : '';
    const latestReplySenderAvatar = latestReplySender?.profile?.image_48;

    const handleSendMessage = async (text: string, file?: File | null) => {
        try {
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                await uploadFile(undefined, thread.channelId, formData, thread.ts);
                toast.success('File uploaded');
            }
            if (text.trim()) {
                await sendMessage(undefined, thread.channelId, text, undefined, undefined, thread.ts);
                toast.success('Reply sent');
            }
        } catch (e) {
            toast.error('Failed to send reply');
        }
    };

    return (
        <div
            className="rounded-[12px] overflow-hidden transition-all border border-white/5"
            style={{
                background: 'rgba(255, 255, 255, 0.01)',
                boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                backdropFilter: 'blur(10px)'
            }}
        >
            <div className="p-4 flex flex-col gap-4">
                {/* Header */}
                <div className="flex justify-between items-center px-1">
                    <div>
                        <div className="text-sm font-medium text-zinc-200">
                            {thread.channelType === 'im' ? senderName : thread.channelName.replace('wl-', '')}
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                            {senderName} & You
                        </div>
                    </div>
                    <div className="text-[11px] text-zinc-600 font-medium">
                        {dateStr}
                    </div>
                </div>

                {/* Inner Card (Message History) */}
                <div
                    onClick={onClick}
                    className="bg-[#2B2D31] rounded-lg p-5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-8 h-8 rounded bg-zinc-800 shrink-0 overflow-hidden">
                            {senderAvatar ? <img src={senderAvatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs bg-zinc-700">{senderName[0]}</div>}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-zinc-200">{senderName}</span>
                                <span className="text-[10px] text-zinc-500">{format(date, 'h:mm a')}</span>
                            </div>
                            <div className="text-sm text-zinc-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: thread.text.replace(/\n/g, '<br/>') }} />
                        </div>
                    </div>

                    {/* Divider */}
                    {thread.latestReplyMessage && (
                        <div className="flex items-center gap-4 py-2">
                            <span className="text-[10px] text-[#D4AF37] font-medium tracking-wide">
                                New
                            </span>
                            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(195, 156, 95, 0.40) 0%, rgba(195, 156, 95, 0.50) 50.25%, rgba(195, 156, 95, 0.10) 100%)' }} />
                        </div>
                    )}

                    {/* Latest Reply */}
                    {thread.latestReplyMessage && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded bg-zinc-800 shrink-0 overflow-hidden">
                                {latestReplySenderAvatar ? <img src={latestReplySenderAvatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs bg-zinc-700">{latestReplySenderName[0]}</div>}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-zinc-200">{latestReplySenderName}</span>
                                    <span className="text-[10px] text-zinc-500">
                                        {format(new Date(parseFloat(thread.latestReplyMessage.ts) * 1000), 'h:mm a')}
                                    </span>
                                </div>
                                <div className="text-sm text-zinc-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: thread.latestReplyMessage.text.replace(/\n/g, '<br/>') }} />
                            </div>
                        </div>
                    )}
                </div>

                <MessageInput
                    onSendMessage={handleSendMessage}
                    channelName={senderName}
                />
            </div>
        </div>
    );
}
