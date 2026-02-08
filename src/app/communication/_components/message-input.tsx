"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Video, Paperclip, Send, X, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { AudioRecorder } from './audio-recorder';
// import { VideoRecorder } from './video-recorder';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

interface MessageInputProps {
    onSendMessage: (text: string, file?: File | null) => Promise<void>;
    onUploadFile?: (file: File) => Promise<void>; // Keep for compatibility if needed elsewhere
    disabled?: boolean;
    channelName?: string;
    className?: string;
    users?: Record<string, any>; // Keep to avoid breaking other components
}

export function MessageInput({ onSendMessage, disabled, channelName, className }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        // Insert emoji at cursor or end
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newMessage = message.substring(0, start) + emojiData.emoji + message.substring(end);
            setMessage(newMessage);
            // Wait for render then restore focus and position
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + emojiData.emoji.length, start + emojiData.emoji.length);
            }, 0);
        } else {
            setMessage(prev => prev + emojiData.emoji);
        }
        setIsPickerOpen(false);
    };

    const [isRecordingAudio, setIsRecordingAudio] = useState(false);
    const [isRecordingVideo, setIsRecordingVideo] = useState(false);
    const [recordedMedia, setRecordedMedia] = useState<Blob | null>(null);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [message]);

    const handleSend = async () => {
        if ((!message.trim() && !attachedFile) || disabled) return;

        await onSendMessage(message, attachedFile);

        setMessage('');
        setAttachedFile(null);

        // Reset height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleAudioSend = async (blob: Blob) => {
        const file = new File([blob], `voice_message_${Date.now()}.webm`, { type: 'audio/webm' });
        await onSendMessage('', file);
        setIsRecordingAudio(false);
    };

    const handleVideoSend = async (blob: Blob) => {
        const file = new File([blob], `video_message_${Date.now()}.webm`, { type: 'video/webm' });
        await onSendMessage('', file);
        setIsRecordingVideo(false);
    };

    if (isRecordingAudio) {
        return (
            <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
                <div className="border border-red-200 dark:border-red-900/30 rounded-xl overflow-hidden bg-red-50/50 dark:bg-red-900/10 p-4 text-center text-sm text-zinc-500">
                    Audio Recording placeholder (AudioRecorder missing)
                    <Button variant="ghost" size="sm" onClick={() => setIsRecordingAudio(false)} className="ml-4">Cancel</Button>
                    {/* <AudioRecorder
                        onSend={handleAudioSend}
                        onCancel={() => setIsRecordingAudio(false)}
                    /> */}
                </div>
            </div>
        );
    }

    if (isRecordingVideo) {
        return (
            <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900 p-4 text-center text-sm text-zinc-500">
                    Video Recording placeholder (VideoRecorder missing)
                    <Button variant="ghost" size="sm" onClick={() => setIsRecordingVideo(false)} className="ml-4">Cancel</Button>
                    {/* <VideoRecorder
                        onSend={handleVideoSend}
                        onCancel={() => setIsRecordingVideo(false)}
                    /> */}
                </div>
            </div>
        );
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setAttachedFile(e.target.files[0]);
        }
    };

    return (
        <div className="">
            <div
                className={cn(
                    "relative flex flex-col overflow-hidden transition-all duration-200",
                    "bg-[#1D1E21] border border-white/5",
                    className
                )}
                style={{
                    borderRadius: '12px',
                    boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                    backdropFilter: 'blur(10px)'
                }}
            >
                {/* File Attachment Preview */}
                {attachedFile && (
                    <div className="px-4 pt-4">
                        <div
                            className="flex flex-col items-start gap-2 p-4 w-[308px] h-[264px] rounded-lg overflow-hidden relative"
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <button
                                onClick={() => setAttachedFile(null)}
                                className="absolute top-2 right-2 z-10 p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>

                            <div className="flex-1 w-full overflow-hidden rounded-md bg-black/20 flex items-center justify-center">
                                {attachedFile.type.startsWith('image/') ? (
                                    <img
                                        src={URL.createObjectURL(attachedFile)}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-zinc-500">
                                        <Paperclip className="w-8 h-8" />
                                        <span className="text-[10px] uppercase font-bold tracking-widest">Preview Not Available</span>
                                    </div>
                                )}
                            </div>

                            <div className="w-full flex flex-col gap-0.5 mt-1 overflow-hidden">
                                <div className="text-[14px] font-medium text-white truncate w-full">
                                    {attachedFile.name}
                                </div>
                                <div className="text-[12px] text-[#888] font-normal uppercase tracking-tight">
                                    {attachedFile.type || 'Unknown'} • {Math.round(attachedFile.size / 1024)} KB
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Message ${channelName || 'channel'}...`}
                    rows={1}
                    disabled={disabled}
                    className="w-full bg-transparent border-0 focus:ring-0 resize-none p-4 text-sm min-h-[44px] max-h-[200px] outline-none text-zinc-200 placeholder-zinc-500"
                    style={{ overflow: 'hidden' }}
                />

                {/* Toolbar */}
                <div className="flex items-center justify-between px-2 pb-2 bg-transparent text-zinc-500">
                    <div className="flex items-center gap-1">
                        {/* Attachments */}
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-white/10 rounded-full text-zinc-400"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Paperclip className="w-4 h-4" />
                        </Button>

                        {/* Audio Trigger */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8 hover:bg-white/10 rounded-full text-zinc-400", isRecordingAudio && "text-red-500")}
                            onClick={() => setIsRecordingAudio(true)}
                        >
                            <Mic className="w-4 h-4" />
                        </Button>

                        <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-white/10 rounded-full text-zinc-400"
                                >
                                    <Smile className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent side="top" align="start" className="p-0 border-none bg-transparent shadow-none w-auto">
                                <EmojiPicker
                                    theme={Theme.DARK}
                                    onEmojiClick={handleEmojiClick}
                                    searchDisabled={false}
                                    skinTonesDisabled
                                    height={350}
                                    width="100%"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleSend}
                            disabled={!message.trim() && !attachedFile && !recordedMedia}
                            size="icon"
                            className={cn(
                                "h-8 w-8 rounded-full transition-all duration-200",
                                (message.trim() || attachedFile || recordedMedia)
                                    ? "bg-white text-black hover:bg-zinc-200"
                                    : "bg-transparent text-zinc-600 cursor-not-allowed"
                            )}
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </Button>
                    </div>
                </div>
            </div>
            {/* <div className="text-[10px] text-zinc-400 text-center mt-2">
                <strong>Shift + Enter</strong> for new line
            </div> */}
        </div>
    );
}
