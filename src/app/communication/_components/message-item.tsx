'use client';

import { Paperclip, MessageSquare, Smile, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/app/actions/slack-actions';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { useState } from 'react';
// @ts-ignore
import emojiMap from 'emoji-name-map';
import { format } from 'date-fns';

const MediaContainer = ({ children, file, isPDF, isImage, isVideo, isAudio }: {
    children: React.ReactNode,
    file: any,
    isPDF?: boolean,
    isImage?: boolean,
    isVideo?: boolean,
    isAudio?: boolean
}) => (
    <div
        className="mt-2 flex flex-col items-start gap-2 p-4 w-[308px] h-[264px] rounded-lg overflow-hidden group/media"
        style={{
            background: 'rgba(255, 255, 255, 0.03)',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
        }}
    >
        <div className="flex-1 w-full overflow-hidden rounded-md bg-black/20 flex items-center justify-center">
            {children}
        </div>
        <div className="w-full flex flex-col gap-0.5 mt-1 overflow-hidden">
            <div className="text-[14px] font-medium text-white truncate w-full">
                {file.title || file.name}
            </div>
            <div className="text-[12px] text-[#888] font-normal uppercase tracking-tight">
                {isPDF ? 'PDF Document' : isImage ? 'Image' : isVideo ? 'Video' : isAudio ? 'Audio' : 'File'} • {file.size ? `${Math.round(file.size / 1024)} KB` : ''}
            </div>
        </div>
    </div>
);

interface MessageItemProps {
    message: Message & { id?: string; attachments?: any[]; userId?: string };
    isCompact?: boolean;
    onReply?: (message: any) => void;
    onReact?: (message: any, emoji: string) => void;
    showReplyCount?: boolean;
    currentUserId?: string | null;
    isActive?: boolean;
    onMediaClick?: (url: string, name: string, type: string) => void;
}

export function MessageItem({ message, isCompact, onReply, onReact, showReplyCount = true, currentUserId, isActive, onMediaClick }: MessageItemProps) {
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    // Parse Time
    const date = new Date(parseFloat(message.ts) * 1000);
    const timeStr = format(date, 'h:mm a');

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        if (onReact) {
            // Slack needs the name (shortcode) like "thumbsup", not the unicode "👍"
            const emojiName = emojiData.names[0] || emojiData.emoji;
            onReact(message, emojiName);
            setIsPickerOpen(false);
        }
    };

    return (
        <div
            id={`message-${message.ts}`}
            className={cn(
                "group flex items-start gap-[10px] self-stretch py-[8px] pl-[20px] pr-[36px] transition-colors relative",
                isActive ? "bg-white/5" : "hover:bg-white/5",
                !isCompact && "mt-2"
            )}
        >

            {/* Hover Actions (floating top right) */}
            <div className="absolute right-4 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-xs overflow-hidden z-10">
                {onReact && (
                    <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-none transform transition-transform active:scale-95 text-zinc-500">
                                <Smile className="w-3.5 h-3.5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-none shadow-xl" align="end" side="top">
                            <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                theme={Theme.AUTO}
                                lazyLoadEmojis={true}
                                width={300}
                                height={400}
                            />
                        </PopoverContent>
                    </Popover>
                )}

                {onReply && (
                    <Button onClick={() => onReply(message)} variant="ghost" size="icon" className="h-7 w-7 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-none text-zinc-500">
                        <MessageSquare className="w-3.5 h-3.5" />
                    </Button>
                )}
            </div>

            {/* Avatar Column */}
            <div className="w-[40px] shrink-0">
                {!isCompact ? (
                    message.avatar ? (
                        <img src={message.avatar} alt={message.user} className="w-[40px] h-[40px] rounded shadow-sm object-cover" />
                    ) : (
                        <div className="w-[40px] h-[40px] rounded bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
                            {message.user?.substring(0, 2) || "??"}
                        </div>
                    )
                ) : (
                    <div className="w-[40px] text-right text-[10px] text-zinc-400 pt-1 opacity-0 group-hover:opacity-100 font-mono">
                        {format(date, 'HH:mm')}
                    </div>
                )}
            </div>

            {/* Content Column */}
            <div className="flex-1 min-w-0 overflow-hidden">
                {!isCompact && (
                    <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="font-medium text-white text-[16px] leading-[18px]">
                            {message.user}
                            {message.user === currentUserId && " (You)"}
                        </span>
                        <span className="text-[12px] text-[#888] font-normal leading-[16px]">{timeStr}</span>
                    </div>
                )}

                <div className="text-[12px] text-white font-normal leading-[16px] max-w-full">
                    {/* Text Rendering */}
                    {(() => {
                        const text = message.text || '';
                        // Simple linkifier for <url|text> or just <url>
                        const linkRegex = /<([^|]+)\|([^>]+)>|<([^>]+)>/g;
                        const parts = [];
                        let lastIndex = 0;
                        let match;
                        while ((match = linkRegex.exec(text)) !== null) {
                            if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));

                            const url = match[1] || match[3];
                            const label = match[2] || match[3];

                            if (url?.startsWith('@') || url?.startsWith('#!')) {
                                // User toggle or special channel
                                parts.push(<span key={match.index} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1 rounded font-medium text-xs">@{label}</span>);
                            } else {
                                parts.push(<a key={match.index} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{label}</a>);
                            }

                            lastIndex = linkRegex.lastIndex;
                        }
                        if (lastIndex < text.length) parts.push(text.substring(lastIndex));
                        return <div className="whitespace-pre-wrap wrap-break-word">{parts.length > 0 ? parts : text}</div>;
                    })()}
                </div>

                {/* Attachments */}
                {message.attachments?.map((att: any, index: number) => (
                    <div key={index} className="mt-2 flex border rounded-md overflow-hidden bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 max-w-md">
                        <div className="w-1 shrink-0 bg-blue-500" style={{ backgroundColor: att.color }}></div>
                        <div className="p-3">
                            {att.title && <a href={att.title_link || "#"} className="font-semibold text-blue-600 hover:underline block truncate">{att.title}</a>}
                            {att.text && <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{att.text}</div>}
                            <div className="flex items-center gap-1 mt-1 text-xs text-zinc-500">
                                {att.footer_icon && <img src={att.footer_icon} alt="" className="w-3 h-3" />}
                                <span>{att.footer}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Files */}
                {message.files?.map((file: any) => {
                    const isAudio = file.mimetype?.startsWith('audio/') || file.filetype === 'webm' || file.name.endsWith('.webm') || file.name.endsWith('.mp3') || file.name.endsWith('.wav');
                    const isVideo = file.mimetype?.startsWith('video/') || file.filetype === 'mp4' || file.name.endsWith('.mp4');
                    const isImage = file.mimetype?.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(file.filetype);
                    const isPDF = file.mimetype === 'application/pdf' || file.filetype === 'pdf' || file.name.endsWith('.pdf');

                    const thumbUrl = file.thumb_360 || file.thumb_480 || file.thumb_720 || file.thumb_1024;


                    if (isAudio) {
                        return (
                            <MediaContainer key={file.id} file={file} isAudio={isAudio}>
                                <audio controls src={`/api/slack-file?url=${encodeURIComponent(file.url_private)}&name=${encodeURIComponent(file.name)}`} className="w-full px-2" />
                            </MediaContainer>
                        );
                    }

                    if (isVideo) {
                        return (
                            <MediaContainer key={file.id} file={file} isVideo={isVideo}>
                                <video controls src={`/api/slack-file?url=${encodeURIComponent(file.url_private)}&name=${encodeURIComponent(file.name)}`} className="w-full h-full object-cover" />
                            </MediaContainer>
                        );
                    }

                    if (isImage) {
                        return (
                            <MediaContainer key={file.id} file={file} isImage={isImage}>
                                <div
                                    className="w-full h-full block cursor-pointer"
                                    onClick={(e) => {
                                        if (onMediaClick) {
                                            e.preventDefault();
                                            onMediaClick(file.url_private || file.permalink, file.name, 'image');
                                        }
                                    }}
                                >
                                    <img
                                        src={thumbUrl ? `/api/slack-file?url=${encodeURIComponent(thumbUrl)}&name=${encodeURIComponent(file.name)}` : `/api/slack-file?url=${encodeURIComponent(file.url_private)}&name=${encodeURIComponent(file.name)}`}
                                        alt={file.name}
                                        className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </MediaContainer>
                        );
                    }

                    if (isPDF) {
                        const pdfThumb = file.thumb_pdf || file.thumb_360 || file.thumb_480;
                        return (
                            <MediaContainer key={file.id} file={file} isPDF={isPDF}>
                                <div
                                    className="w-full h-full cursor-pointer flex items-center justify-center bg-white"
                                    onClick={(e) => {
                                        if (onMediaClick) {
                                            e.preventDefault();
                                            onMediaClick(file.url_private || file.permalink, file.name, 'pdf');
                                        } else {
                                            window.open(file.url_private || file.permalink || file.permalink_public, "_blank");
                                        }
                                    }}
                                >
                                    {pdfThumb ? (
                                        <img
                                            src={`/api/slack-file?url=${encodeURIComponent(pdfThumb)}&name=${encodeURIComponent(file.name)}`}
                                            alt={`${file.name} preview`}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center text-red-600">
                                            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                                                <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </MediaContainer>
                        );
                    }

                    return (
                        <div key={file.id} className="mt-2 text-sm text-blue-600 text-left">
                            <a href={file.url_private} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                                <Paperclip className="w-3 h-3" /> {file.name}
                            </a>
                        </div>
                    );
                })}

                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                        {message.reactions.map((reaction, i) => {
                            // @ts-ignore
                            const emojiChar = (emojiMap && emojiMap.get) ? emojiMap.get(reaction.name) || reaction.name : reaction.name;
                            return (
                                <button
                                    key={i}
                                    onClick={() => onReact && onReact(message, reaction.name)}
                                    className="inline-flex items-center gap-1 px-2 py-1 transition-colors text-xs text-white"
                                    style={{
                                        borderRadius: '12px',
                                        background: 'rgba(255, 255, 255, 0.01)',
                                        boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    <span className="text-[14px] font-medium opacity-70">{reaction.count}</span>
                                    <span className="text-[16px]">{emojiChar}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Thread Inline Info */}
                {showReplyCount && (message.reply_count || 0) > 0 && onReply && (
                    <div className="mt-1">
                        <div
                            className="inline-flex items-center gap-2 cursor-pointer group/thread"
                            onClick={() => onReply(message)}
                        >
                            <span className="text-[#469ABB] text-[12px] font-medium group-hover/thread:underline text-left">
                                {message.reply_count} reply
                            </span>
                            <span className="text-[#888] text-[12px] text-left">
                                Last reply {(() => {
                                    if (!message.latest_reply) return '';
                                    const diff = (Date.now() / 1000) - parseFloat(message.latest_reply);
                                    if (diff < 60) return 'now';
                                    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
                                    if (diff < 8400) return `${Math.floor(diff / 3600)}h ago`;
                                    return 'days ago';
                                })()}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
