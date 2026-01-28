"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { MessageSquare, Paperclip } from "lucide-react";
import { ReactionPicker } from "./reaction-picker";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// @ts-ignore
import emojiMap from 'emoji-name-map';
import Image from "next/image";

interface ChatWindowProps {
    messages: any[];
    isLoading: boolean;
    users: Record<string, any>;
    currentUserId: string | null;
    onReply: (msg: any) => void;
    channelId: string;
    hasMore?: boolean;
    onLoadMore?: () => void;
    isFetchingMore?: boolean;
    highlightMessageId?: string | null;
}

function getProxyUrl(url?: string, name?: string) {
    if (!url) return '';
    return `/api/slack-file?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name || 'file')}`;
}

function getImageProxyUrl(url?: string) {
    if (!url) return '';
    return `/api/slack-image?url=${encodeURIComponent(url)}`;
}

export function ChatWindow({ messages, isLoading, users, currentUserId, onReply, channelId, hasMore, onLoadMore, isFetchingMore, highlightMessageId }: ChatWindowProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
    const newestMessageRef = useRef<string | null>(null);
    const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // UI States for smooth loading
    const [isReady, setIsReady] = useState(false);

    // Track if we've already scrolled to a deep-linked message
    const hasScrolledToMessage = useRef(false);

    // Reset scroll tracking when channel changes
    useEffect(() => {
        hasScrolledToMessage.current = false;
    }, [channelId]);

    // 1. INITIAL SCROLL LOGIC (Runs once or when channel changes)
    useLayoutEffect(() => {
        if (!messages.length) {
            if (!isLoading) setIsReady(true);
            return;
        }

        // ❌ DO NOT show UI yet if we are deep-linking
        if (highlightMessageId) return;

        // Normal channel open → jump to bottom
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
        newestMessageRef.current = messages[0]?.ts;

        requestAnimationFrame(() => setIsReady(true));
    }, [channelId, isLoading, highlightMessageId]);


    // 2. NEW MESSAGE AUTO-SCROLL (Runs when new messages arrive)
    useEffect(() => {
        if (!isReady || highlightMessageId || messages.length === 0) return;

        const newestMessage = messages[0];
        // Only scroll if the newest message timestamp changed (avoid scrolling on reaction updates)
        if (newestMessage?.ts !== newestMessageRef.current) {
            const container = containerRef.current;
            const isNearBottom = container ? (container.scrollHeight - container.scrollTop - container.clientHeight < 150) : true;

            if (isNearBottom) {
                // Smooth scroll for new messages
                bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }
            newestMessageRef.current = newestMessage?.ts;
        }
    }, [messages, highlightMessageId, isReady]);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 3. HIGHLIGHT MESSAGE LOGIC (Deep Linking)
    useEffect(() => {
        if (!highlightMessageId || !messages.length || hasScrolledToMessage.current) return;

        const elementId = `message-${highlightMessageId}`;

        const raf = requestAnimationFrame(() => {
            const el = document.getElementById(elementId);
            if (!el) return;

            // 1️⃣ Scroll first
            el.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            // 2️⃣ Wait for scroll to settle, THEN highlight
            setTimeout(() => {
                el.classList.add(
                    "bg-blue-50",
                    "dark:bg-blue-900/20",
                    "transition-colors"
                );

                setTimeout(() => {
                    el.classList.remove(
                        "bg-blue-50",
                        "dark:bg-blue-900/20"
                    );
                }, 2000);

                hasScrolledToMessage.current = true;
                setIsReady(true); // ✅ show UI only now

                // Clean URL
                const current = new URLSearchParams(Array.from(searchParams.entries()));
                current.delete("messageId");
                router.replace(`${pathname}?${current.toString()}`, { scroll: false });

            }, 350); // ← this delay is the magic
        });

        return () => cancelAnimationFrame(raf);
    }, [highlightMessageId, messages]);


    const formatMessageText = (text: string) => {
        if (!text) return null;
        const parts = text.split(/(<@[A-Z0-9]+>|<[^>]+>)/g);
        return (
            <span className="whitespace-pre-wrap break-words">
                {parts.map((part, index) => {
                    const userMatch = part.match(/^<@([A-Z0-9]+)>$/);
                    if (userMatch) {
                        const userId = userMatch[1];
                        const user = users[userId];
                        return <span key={index} className="text-blue-500 font-medium">@{user?.real_name || user?.name || userId}</span>;
                    }
                    const linkMatch = part.match(/^<([^|]+)(?:\|(.+))?>$/);
                    if (linkMatch) {
                        const url = linkMatch[1];
                        const label = linkMatch[2] || url;
                        return <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{label}</a>;
                    }
                    return part;
                })}
            </span>
        );
    };

    const getSender = (msg: any) => {
        if (msg.user && users[msg.user]) {
            const user = users[msg.user];
            return { name: user?.real_name || user?.name || "Unknown", avatar: user?.profile?.image_48 || null };
        }
        if (msg.bot_id || msg.subtype === "bot_message") {
            return { name: msg.username || msg.bot_profile?.name || "Bot", avatar: msg.bot_profile?.icons?.image_48 || null };
        }
        return { name: "Unknown", avatar: null };
    };

    if (isLoading && !isReady) {
        return (
            <div className="flex-1 flex items-center justify-center bg-neutral-05">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-400 dark:text-gray-500">
                <p>No messages yet.</p>
                <p className="text-sm">Start the conversation!</p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`flex-1 overflow-y-auto px-4 py-2 space-y-1 bg-white dark:bg-zinc-950 text-sm scroll-smooth transition-opacity duration-200 ${isReady ? 'opacity-100' : 'opacity-0'}`}
        >
            {hasMore && (
                <div className="flex justify-center py-2">
                    <button
                        onClick={() => onLoadMore?.()}
                        disabled={isFetchingMore}
                        className="text-xs text-blue-500 hover:text-blue-600 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isFetchingMore ? "Loading..." : "Load Previous Messages"}
                    </button>
                </div>
            )}

            {messages.slice().reverse().map((msg, i) => {
                const isCurrentUser = currentUserId && msg.user === currentUserId;
                const isMasterAdmin = msg.username === "Master Admin";
                const isMe = isMasterAdmin;

                const sender = (isCurrentUser || (!msg.bot_id && !msg.subtype))
                    ? (() => {
                        const u = users[msg.user];
                        return { name: u?.real_name || u?.name || "Unknown", avatar: u?.profile?.image_48 };
                    })()
                    : getSender(msg);

                if (msg.subtype === "channel_join") {
                    const joinedUser = users[msg.user];
                    const displayName = joinedUser?.real_name || joinedUser?.name || msg.user;
                    return (
                        <div key={msg.ts} className="flex justify-center my-4 relative">
                            <span className="bg-white dark:bg-zinc-950 px-2 text-[11px] text-zinc-400">
                                <span className="font-bold">@{displayName}</span> joined
                            </span>
                        </div>
                    );
                }

                const showActions = hoveredMessage === msg.ts;

                return (
                    <div
                        key={msg.ts}
                        id={`message-${msg.ts}`}
                        ref={(el) => { messageRefs.current[msg.ts] = el; }}
                        onMouseEnter={() => setHoveredMessage(msg.ts)}
                        onMouseLeave={() => setHoveredMessage(null)}
                        className={`group flex gap-3 py-2 -mx-4 px-4 transition-all duration-300 rounded-md relative hover:bg-neutral-05`}
                    >
                        {/* Hover Actions */}
                        {showActions && (
                            <div className="absolute right-4 top-[-12px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm flex items-center p-1 z-10">
                                <ReactionPicker channelId={channelId} timestamp={msg.ts} />
                                <button
                                    onClick={() => onReply(msg)}
                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded text-zinc-500 hover:text-blue-600"
                                    title="Reply in thread"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <div className="w-9 shrink-0">
                            {!isMe && (
                                <div className="w-9 h-9 shrink-0">
                                    {sender.avatar ? (
                                        <img src={sender.avatar} alt={sender.name} className="w-9 h-9 rounded object-cover shadow-sm bg-gray-200" />
                                    ) : (
                                        <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
                                            {sender.name[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            )}
                            {isMe && (
                                <div className="w-9 h-9 shrink-0">
                                    <div className="w-9 h-9 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">MA</div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-0.5">
                                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-[15px]">
                                    {isMasterAdmin ? "Master Admin" : (isCurrentUser ? `${sender.name} (You)` : sender.name)}
                                </span>
                                <span className="text-[11px] text-zinc-400 font-medium">
                                    {format(new Date(Number(msg.ts) * 1000), 'h:mm a')}
                                </span>
                            </div>

                            <div className="text-[15px] text-zinc-800 dark:text-zinc-300 leading-relaxed">
                                {msg.text && (
                                    <div className="whitespace-pre-wrap break-words">{formatMessageText(msg.text)}</div>
                                )}
                                {msg.files?.map((file: any) => {
                                    const isAudio = file.mimetype?.startsWith('audio/') || file.filetype === 'webm' || file.name.endsWith('.webm') || file.name.endsWith('.mp3') || file.name.endsWith('.wav');
                                    const isVideo = file.mimetype?.startsWith('video/') || file.filetype === 'mp4' || file.name.endsWith('.mp4');
                                    const isImage = file.mimetype?.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(file.filetype);
                                    const isPDF = file.mimetype === 'application/pdf' || file.filetype === 'pdf' || file.name.endsWith('.pdf');

                                    const publicUrl = file.permalink || file.permalink_public || file.url_private;
                                    const thumbUrl = file.thumb_360 || file.thumb_480 || file.thumb_720 || file.thumb_1024;

                                    if (isAudio) {
                                        return (
                                            <div key={file.id} className="mt-2 text-sm max-w-xs">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Paperclip className="w-3 h-3 text-zinc-400" />
                                                    <span className="text-zinc-500 truncate text-xs">{file.name}</span>
                                                </div>
                                                <audio controls src={getProxyUrl(file.url_private, file.name)} className="w-full h-8" />
                                            </div>
                                        );
                                    }

                                    if (isVideo) {
                                        return (
                                            <div key={file.id} className="mt-2 text-sm max-w-sm">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Paperclip className="w-3 h-3 text-zinc-400" />
                                                    <span className="text-zinc-500 truncate text-xs">{file.name}</span>
                                                </div>
                                                <video controls src={getProxyUrl(file.url_private, file.name)} className="w-full rounded-md bg-black max-h-[200px]" />
                                            </div>
                                        );
                                    }

                                    if (isImage) {
                                        const imageUrl = thumbUrl || file.url_private;

                                        return (
                                            <div key={file.id} className="mt-2 max-w-md">
                                                <img
                                                    src={getImageProxyUrl(imageUrl)}
                                                    alt={file.name}
                                                    className="rounded-md border border-zinc-200 dark:border-zinc-700
                   max-h-[300px] object-contain bg-zinc-50 dark:bg-zinc-900"
                                                />

                                                <div className="flex items-center gap-1 mt-1 text-xs text-zinc-500">
                                                    <Paperclip className="w-3 h-3" />
                                                    <span className="truncate">{file.name}</span>
                                                </div>
                                            </div>
                                        );
                                    }

                                    if (isPDF) {
                                        const hasPreview = !!file.thumb_pdf;
                                        // Use proxy URL for opening the file so it downloads/opens correctly with auth
                                        const fileProxyUrl = getProxyUrl(file.url_private, file.name);

                                        return (
                                            <div key={file.id} className="mt-2 max-w-md rounded-lg overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
                                                {hasPreview && (
                                                    <div className="cursor-pointer bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700" onClick={() => window.open(fileProxyUrl, "_blank")}>
                                                        <img
                                                            src={getImageProxyUrl(file.thumb_pdf)}
                                                            alt={`${file.name} preview`}
                                                            className="w-full h-auto object-contain bg-white dark:bg-black"
                                                            style={{ maxHeight: '200px' }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-3 p-3">
                                                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded flex items-center justify-center shrink-0 text-red-600 dark:text-red-400">
                                                        {/* Simple PDF File Icon */}
                                                        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                            <polyline points="14 2 14 8 20 8" />
                                                            <line x1="16" y1="13" x2="8" y2="13" />
                                                            <line x1="16" y1="17" x2="8" y2="17" />
                                                            <polyline points="10 9 9 9 8 9" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        {/* Force click to use proxy */}
                                                        <a href={fileProxyUrl} target="_blank" rel="noreferrer" className="font-medium text-sm truncate text-zinc-900 dark:text-zinc-100 hover:text-blue-600 hover:underline block">
                                                            {file.title || file.name}
                                                        </a>
                                                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                                            PDF Document • {file.size ? `${Math.round(file.size / 1024)} KB` : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Fallback for other file types
                                    return (
                                        <div key={file.id} className="mt-2 text-sm text-blue-600">
                                            <a href={file.url_private} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                                                <Paperclip className="w-3 h-3" /> {file.name}
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Reactions */}
                            {msg.reactions && msg.reactions.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {msg.reactions.map((r: any) => {
                                        const emojiChar = emojiMap.get(r.name) || r.name;
                                        return (
                                            <div key={r.name} className="flex items-center gap-1 bg-neutral-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full border border-transparent hover:border-zinc-300 cursor-default">
                                                <span className="text-sm">{emojiChar}</span>
                                                <span className="text-xs font-medium text-zinc-500">{r.count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Thread Reply Count */}
                            {msg.reply_count && (
                                <div className="flex items-center gap-2 mt-1 cursor-pointer group/thread" onClick={() => onReply(msg)}>
                                    <span className="text-xs text-blue-600 font-medium group-hover/thread:underline">{msg.reply_count} replies</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>
    );
}