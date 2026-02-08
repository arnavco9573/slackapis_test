'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getThreadReplies, sendMessage, addReaction, type Message, uploadFile } from '@/app/actions/slack-actions';
import { X, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageInput } from './message-input';
import { MessageItem } from './message-item';
import { useEffect, useRef, useMemo } from 'react';

interface ThreadViewProps {
    channelId: string;
    parentMessage: Message;
    onClose: () => void;
    users: Record<string, any>;
    currentUserId: string | null;
    onMediaClick?: (url: string, name: string, type: string) => void;
}

export function ThreadView({ channelId, parentMessage, onClose, users, currentUserId, onMediaClick }: ThreadViewProps) {
    const queryClient = useQueryClient();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch replies
    const { data: repliesData, isLoading } = useQuery({
        queryKey: ['slack-thread', channelId, parentMessage.ts],
        queryFn: async () => {
            const res = await getThreadReplies(undefined, channelId, parentMessage.ts);
            return res.success ? res.messages : [];
        },
        refetchInterval: 10000,
    });

    const replies = (repliesData || []) as Message[];

    // Scroll to bottom on load
    useEffect(() => {
        if (replies.length > 0 && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [replies.length]);

    const handleSendReply = async (text: string, file?: File | null) => {
        try {
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                await uploadFile(undefined, channelId, formData, parentMessage.ts);
            }
            if (text.trim()) {
                await sendMessage(undefined, channelId, text, undefined, undefined, parentMessage.ts);
            }
            // Invalidate thread query
            queryClient.invalidateQueries({ queryKey: ['slack-thread', channelId, parentMessage.ts] });
            // Also invalidate main channel history to update reply counts
            queryClient.invalidateQueries({ queryKey: ['slack-messages', channelId] });
            queryClient.invalidateQueries({ queryKey: ['all-threads'] });
        } catch (error) {
            console.error("Failed to send reply", error);
        }
    };

    const handleReact = async (msg: Message, emoji: string) => {
        try {
            await addReaction(undefined, channelId, msg.ts, emoji);
            queryClient.invalidateQueries({ queryKey: ['slack-thread', channelId, parentMessage.ts] });
        } catch (error) {
            console.error("Failed to react", error);
        }
    };

    const parentWithProfile = useMemo(() => ({
        ...parentMessage,
        user: users[parentMessage.user]?.real_name || users[parentMessage.user]?.name || parentMessage.user,
        avatar: users[parentMessage.user]?.profile?.image_48 || parentMessage.avatar
    }), [parentMessage, users]);

    return (
        <div
            className="flex flex-col h-full w-full border-l border-white/10 shrink-0"
            style={{
                background: '#1A1B1E',
            }}
        >
            {/* Header */}
            <div className="h-14 shrink-0 flex items-center justify-between px-4 w-full">
                <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-medium text-white flex items-center gap-2">
                        Reply Thread
                    </h3>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5">
                    <X className="w-4 h-4" />
                </Button>
            </div>

            {/* Scroll Area */}
            <div className="flex-1 overflow-y-auto px-4 py-1 w-full" ref={scrollRef} style={{ scrollbarWidth: 'none' }}>
                <MessageItem
                    message={parentWithProfile}
                    showReplyCount={false}
                    onReact={handleReact}
                    currentUserId={currentUserId}
                    onMediaClick={onMediaClick}
                />

                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full h-px" style={{ background: 'linear-gradient(90deg, #1A1B1E 0%, #3F4042 50.25%, #1A1B1E 100%)' }} />
                    </div>
                </div>

                {isLoading && replies.length === 0 ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {replies.slice(1).map((msg, i) => {
                            // Only allow compact mode if it's NOT the first reply
                            // i starts at 0 for replies.slice(1)
                            const prevMsg = i > 0 ? (replies.slice(1))[i - 1] : null;
                            const isCompact = !!(prevMsg && prevMsg.user === msg.user && (parseFloat(msg.ts) - parseFloat(prevMsg.ts) < 300));

                            return (
                                <MessageItem
                                    key={msg.ts}
                                    message={{
                                        ...msg,
                                        user: users[msg.user]?.real_name || users[msg.user]?.name || msg.user,
                                        avatar: users[msg.user]?.profile?.image_48 || msg.avatar
                                    }}
                                    onReact={handleReact}
                                    showReplyCount={false}
                                    isCompact={isCompact}
                                    currentUserId={currentUserId}
                                    onMediaClick={onMediaClick}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="shrink-0 w-full p-4 pt-1">
                <MessageInput
                    onSendMessage={handleSendReply}
                    channelName="Thread"
                />
            </div>
        </div>
    );
}
