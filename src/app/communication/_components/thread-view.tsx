"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, MessageSquare, Send } from "lucide-react";
import { getThreadReplies, sendMessage, uploadFile } from "@/app/actions/slack-actions";
import { MessageInput } from "./message-input";
import { format } from "date-fns";

interface ThreadViewProps {
    channelId: string;
    parentMessage: any;
    onClose: () => void;
    users: Record<string, any>;
    currentUserId: string | null;
}

export function ThreadView({ channelId, parentMessage, onClose, users, currentUserId }: ThreadViewProps) {
    const [replyText, setReplyText] = useState("");
    const queryClient = useQueryClient();
    const threadTs = parentMessage.ts;

    // Fetch replies
    const { data: replies = [], isLoading } = useQuery({
        queryKey: ['slack-thread', channelId, threadTs],
        queryFn: async () => {
            const res = await getThreadReplies(undefined, channelId, threadTs);
            return res.success ? res.messages : [];
        },
        // We'll rely on global polling or socket updates for now, 
        // but for immediate feedback we refetch on send.
        staleTime: 1000 * 60,
    });

    // Send Reply Mutation
    const sendReplyMutation = useMutation({
        mutationFn: async (text: string) => {
            return await sendMessage(undefined, channelId, text, undefined, undefined, threadTs);
        },
        onSuccess: () => {
            setReplyText("");
            queryClient.invalidateQueries({ queryKey: ['slack-thread', channelId, threadTs] });
            queryClient.invalidateQueries({ queryKey: ['slack-messages', channelId] }); // Update reply count in main view
        }
    });

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        sendReplyMutation.mutate(replyText);
    };

    const getSender = (msg: any) => {
        if (msg.user && users[msg.user]) {
            const user = users[msg.user];
            return { name: user.real_name || user.name, avatar: user.profile?.image_24 };
        }
        if (msg.bot_id || msg.subtype === "bot_message") return { name: "Bot", avatar: null };
        return { name: "Unknown", avatar: null };
    };

    return (
        <div className="w-[350px] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-full shadow-xl">
            {/* Header */}
            <div className="h-12 px-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-neutral-05/50">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Thread</h3>
                    <span className="text-xs text-zinc-500">#{channelId.replace('wl-', '')}</span>
                </div>
                <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Parent Message */}
                <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
                    <MessageItem msg={parentMessage} users={users} currentUserId={currentUserId} isParent />
                </div>

                {/* Replies */}
                {isLoading ? (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                    </div>
                ) : (
                    replies.slice(1).map((msg: any) => ( // Skip first, as it's the parent usually returned by 'replies'
                        <MessageItem key={msg.ts} msg={msg} users={users} currentUserId={currentUserId} />
                    ))
                )}
                {replies.length <= 1 && !isLoading && (
                    <p className="text-xs text-zinc-400 text-center italic">No replies yet.</p>
                )}
            </div>

            {/* Input */}
            <MessageInput
                onSendMessage={async (text) => {
                    await sendMessage(undefined, channelId, text, undefined, undefined, threadTs);
                    queryClient.invalidateQueries({ queryKey: ['slack-thread', channelId, threadTs] });
                    queryClient.invalidateQueries({ queryKey: ['slack-messages', channelId] });
                }}
                onUploadFile={async (file) => {
                    // Similar to slack-interface, but we need to ensure uploadFile handles threadTs if possible.
                    // If uploadFile doesn't support threadTs yet, we might need to update it.
                    // Assuming we updated uploadFile to take threadTs as 4th arg.
                    const formData = new FormData();
                    formData.append("file", file);
                    await uploadFile(undefined, channelId, formData, threadTs);
                    queryClient.invalidateQueries({ queryKey: ['slack-thread', channelId, threadTs] });
                }}
                users={users}
            />
        </div>
    );
}

function MessageItem({ msg, users, currentUserId, isParent = false }: { msg: any; users: any; currentUserId: any; isParent?: boolean }) {
    const sender = (() => {
        if (msg.user && users[msg.user]) {
            const u = users[msg.user];
            return { name: u.real_name || u.name, avatar: u.profile?.image_24 };
        }
        return { name: msg.username || "Bot", avatar: msg.icons?.image_48 };
    })();

    const isMe = currentUserId && msg.user === currentUserId;

    return (
        <div className={`flex gap-3 ${isParent ? '' : 'text-sm'}`}>
            <div className="shrink-0">
                {sender.avatar ? (
                    <img src={sender.avatar} alt="" className="w-8 h-8 rounded bg-gray-200" />
                ) : (
                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                        {sender.name?.[0]}
                    </div>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{sender.name}</span>
                    <span className="text-[10px] text-zinc-400">{format(new Date(Number(msg.ts) * 1000), 'h:mm a')}</span>
                </div>
                <p className="text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap break-words">{msg.text}</p>
            </div>
        </div>
    )
}
