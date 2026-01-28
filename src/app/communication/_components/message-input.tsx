"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, Send, Bold, Italic, Strikethrough, Link2, List, Mic, Video, Plus, Smile, AtSign, Type, X, Check, FileText, Image as ImageIcon, Hash } from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";

export interface MessageInputProps {
    onSendMessage: (text: string) => Promise<void>;
    onUploadFile: (file: File) => Promise<void>;
    disabled?: boolean;
    users?: Record<string, any>;
}

export function MessageInput({ onSendMessage, onUploadFile, disabled, users = {} }: MessageInputProps) {
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);

    // Recording State
    const [isRecordingAudio, setIsRecordingAudio] = useState(false);
    const [isRecordingVideo, setIsRecordingVideo] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    // UI Toggles
    const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
    const [showFormatting, setShowFormatting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showMentionPicker, setShowMentionPicker] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const videoPreviewRef = useRef<HTMLVideoElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Audio Recording
    const startAudioRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            startRecording(stream, "audio");
            setIsRecordingAudio(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please check permissions.");
        }
    };

    // Video Recording
    const startVideoRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setMediaStream(stream);
            setIsRecordingVideo(true);
            startRecording(stream, "video");
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please check permissions.");
        }
    };

    const startRecording = (stream: MediaStream, type: "audio" | "video") => {
        const mimeType = type === "audio" ? "audio/webm" : "video/webm";
        const recorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = recorder;
        chunksRef.current = [];
        setMediaStream(stream);
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        recorder.onstop = () => stopTimer();
        recorder.start();
        startTimer();
    };

    const startTimer = () => {
        setRecordingTime(0);
        timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }
    };

    const cancelRecording = () => {
        stopRecording();
        setIsRecordingAudio(false);
        setIsRecordingVideo(false);
        chunksRef.current = [];
        setRecordingTime(0);
    };

    const sendRecording = async () => {
        stopRecording();
        await new Promise(resolve => setTimeout(resolve, 200));
        const type = isRecordingAudio ? "audio/webm" : "video/webm";
        const blob = new Blob(chunksRef.current, { type });
        const ext = "webm";
        const fileName = `recording-${Date.now()}.${ext}`;
        const file = new File([blob], fileName, { type });
        setIsRecordingAudio(false);
        setIsRecordingVideo(false);
        // Direct upload for recordings
        setIsSending(true);
        try {
            await onUploadFile(file);
        } finally {
            setIsSending(false);
        }
    };

    const handleSend = async () => {
        if ((!message.trim() && !attachedFile) || isSending) return;
        setIsSending(true);
        try {
            if (message.trim()) {
                await onSendMessage(message);
            }
            if (attachedFile) {
                await onUploadFile(attachedFile);
            }

            setMessage("");
            setAttachedFile(null);
            setShowFormatting(false); // Reset UI states on send
            setShowEmojiPicker(false);
            setShowMentionPicker(false);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
        // Basic mention trigger detection
        if (e.key === "@") {
            setShowMentionPicker(true);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setAttachedFile(e.target.files[0]);
        }
        // Reset input value so same file can be selected again if needed
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const applyFormat = (format: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = message.substring(start, end);
        let newText = message;

        switch (format) {
            case "bold": newText = message.substring(0, start) + `*${selectedText}*` + message.substring(end); break;
            case "italic": newText = message.substring(0, start) + `_${selectedText}_` + message.substring(end); break;
            case "strike": newText = message.substring(0, start) + `~${selectedText}~` + message.substring(end); break;
            case "link": newText = message.substring(0, start) + `<${selectedText || 'url'}|text>` + message.substring(end); break;
            case "list": newText = message.substring(0, start) + `\n- ${selectedText}` + message.substring(end); break;
        }

        setMessage(newText);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + 1, end + 1);
        }, 0);
    };

    const insertEmoji = (emojiData: EmojiClickData) => {
        setMessage(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
        textareaRef.current?.focus();
    };

    const insertMention = (userId: string) => {
        setMessage(prev => prev + `<@${userId}> `);
        setShowMentionPicker(false);
        textareaRef.current?.focus();
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Effect for video preview
    useEffect(() => {
        if (videoPreviewRef.current && mediaStream) {
            videoPreviewRef.current.srcObject = mediaStream;
        }
    }, [mediaStream, isRecordingVideo]);

    const renderRecordingUI = () => (
        <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-in fade-in slide-in-from-bottom-2">
            <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
            <span className="font-mono font-medium text-red-600 dark:text-red-400">{formatTime(recordingTime)}</span>
            <div className="flex-1" />
            {isRecordingVideo && (
                <div className="relative w-32 h-24 bg-black rounded-lg overflow-hidden border border-gray-600">
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <video ref={videoPreviewRef} autoPlay muted className="w-full h-full object-cover" />
                </div>
            )}
            <button onClick={cancelRecording} className="p-2 hover:bg-red-100 dark:hover:bg-red-800 rounded-full text-red-600 dark:text-red-400 transition-colors"><X className="w-5 h-5" /></button>
            <button onClick={sendRecording} className="p-2 bg-green-600 hover:bg-green-700 rounded-full text-white transition-colors shadow-sm"><Check className="w-5 h-5" /></button>
        </div>
    );

    return (
        <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 relative font-sans antialiased">
            {/* Popovers Layer */}
            {isPlusMenuOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsPlusMenuOpen(false)}></div>
                    <div className="absolute left-4 bottom-16 z-20 w-64 bg-zinc-900 text-zinc-100 rounded-xl shadow-2xl border border-zinc-700 overflow-hidden text-sm flex flex-col py-1 animate-in fade-in slide-in-from-bottom-2">
                        <div className="px-4 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Shortcuts</div>
                        <button className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-800 transition-colors text-left"><FileText className="w-4 h-4 text-zinc-400" /><span>Text snippet</span></button>
                        <button className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-800 transition-colors text-left" onClick={() => { fileInputRef.current?.click(); setIsPlusMenuOpen(false); }}>
                            <ImageIcon className="w-4 h-4 text-zinc-400" /><span>Upload from computer</span>
                        </button>
                    </div>
                </>
            )}

            {showEmojiPicker && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowEmojiPicker(false)}></div>
                    <div className="absolute left-20 bottom-16 z-20 shadow-xl border dark:border-zinc-700 rounded-lg overflow-hidden animate-in fade-in zoom-in-95">
                        <EmojiPicker
                            onEmojiClick={insertEmoji}
                            theme={Theme.AUTO}
                            width={320}
                            height={400}
                        />
                    </div>
                </>
            )}

            {showMentionPicker && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMentionPicker(false)}></div>
                    <div className="absolute left-32 bottom-16 z-20 w-60 max-h-60 overflow-y-auto bg-white dark:bg-zinc-800 rounded-lg shadow-xl border dark:border-zinc-700 animate-in fade-in zoom-in-95">
                        <div className="px-3 py-2 text-xs font-semibold text-zinc-500 border-b dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 sticky top-0 z-10">People</div>
                        {Object.values(users).length > 0 ? Object.values(users).map((u: any) => (
                            <button key={u.id} onClick={() => insertMention(u.id)} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors text-left">
                                <div className="w-6 h-6 rounded bg-blue-100 dark:bg-zinc-600 flex items-center justify-center text-xs font-bold shrink-0">
                                    {u.profile?.image_24 ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={u.profile.image_24} alt="" className="w-6 h-6 rounded" />
                                    ) : (
                                        u.name?.[0]?.toUpperCase()
                                    )}
                                </div>
                                <div className="flex flex-col overflow-hidden min-w-0">
                                    <span className="text-sm font-medium truncate text-zinc-900 dark:text-zinc-100">{u.real_name || u.name}</span>
                                    <span className="text-xs text-zinc-500 truncate">@{u.name}</span>
                                </div>
                            </button>
                        )) : (
                            <div className="px-3 py-4 text-center text-sm text-zinc-400">No users found</div>
                        )}
                    </div>
                </>
            )}

            <div className={`relative border rounded-xl overflow-hidden transition-all duration-200 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-within:ring-1 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-600 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 ${isRecordingAudio || isRecordingVideo ? 'border-red-300 dark:border-red-900' : ''}`}>

                {/* File Attachment Preview */}
                {attachedFile && (
                    <div className="flex items-center gap-2 p-2 mx-2 mt-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700 w-fit animate-in fade-in slide-in-from-bottom-2">
                        <span className="text-xs truncate max-w-[200px] text-zinc-900 dark:text-zinc-100">{attachedFile.name}</span>
                        <button onClick={() => setAttachedFile(null)} className="text-zinc-500 hover:text-red-500 transition-colors">
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                )}

                {/* Content Area */}
                <div className="relative">
                    {(isRecordingAudio || isRecordingVideo) ? (
                        <div className="p-4">{renderRecordingUI()}</div>
                    ) : (
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Message..."
                            rows={1}
                            className="w-full bg-transparent border-0 focus:ring-0 resize-none p-3 text-sm min-h-[44px] max-h-[200px] outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
                            style={{ overflow: 'hidden' }}
                            disabled={disabled || isSending}
                        />
                    )}
                </div>

                {/* Toolbar */}
                {!isRecordingAudio && !isRecordingVideo && (
                    <div className="flex items-center justify-between p-2 bg-transparent text-zinc-500 dark:text-zinc-400">
                        <div className="flex items-center gap-1">
                            {/* Formatting Toolbar */}
                            {showFormatting && (
                                <div className="absolute bottom-full left-0 mb-2 ml-2 flex items-center gap-1 p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg animate-in slide-in-from-bottom-2 z-10">
                                    <ToolbarBtn icon={<Bold className="w-4 h-4" />} label="Bold" onClick={() => applyFormat('bold')} />
                                    <ToolbarBtn icon={<Italic className="w-4 h-4" />} label="Italic" onClick={() => applyFormat('italic')} />
                                    <ToolbarBtn icon={<Strikethrough className="w-4 h-4" />} label="Strikethrough" onClick={() => applyFormat('strike')} />
                                    <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />
                                    <ToolbarBtn icon={<Link2 className="w-4 h-4" />} label="Link" onClick={() => applyFormat('link')} />
                                    <ToolbarBtn icon={<List className="w-4 h-4" />} label="List" onClick={() => applyFormat('list')} />
                                </div>
                            )}

                            {/* Attachments */}
                            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                            <Button
                                icon={<Paperclip className="w-4 h-4" />}
                                onClick={() => fileInputRef.current?.click()}
                                className="hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full w-8 h-8"
                            />

                            {/* Audio Trigger */}
                            <Button
                                icon={<Mic className="w-4 h-4" />}
                                onClick={startAudioRecording}
                                className="hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full w-8 h-8"
                            />

                            {/* Video Trigger */}
                            <Button
                                icon={<Video className="w-4 h-4" />}
                                onClick={startVideoRecording}
                                className="hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full w-8 h-8"
                            />

                            <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />

                            <Button
                                icon={<Type className="w-4 h-4" />}
                                onClick={() => setShowFormatting(!showFormatting)}
                                active={showFormatting}
                                className="hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full w-8 h-8"
                            />
                            <Button
                                icon={<Smile className="w-4 h-4" />}
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full w-8 h-8"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleSend}
                                disabled={(!message.trim() && !attachedFile) || disabled || isSending}
                                className={`h-8 w-8 flex items-center justify-center rounded-full transition-all duration-200 ${(message.trim() || attachedFile) ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'}`}
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="text-[10px] text-zinc-400 text-center mt-2">
                <strong>Shift + Enter</strong> for new line
            </div>
        </div>
    );
}

function ToolbarBtn({ icon, label, onClick }: { icon: React.ReactNode, label?: string, onClick?: () => void }) {
    return <button onClick={onClick} className="p-1 rounded text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors" title={label}>{icon}</button>;
}

function Button({ icon, onClick, className, active }: { icon: React.ReactNode, onClick?: () => void, className?: string, active?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center transition-colors ${active ? 'bg-zinc-200 dark:bg-zinc-700 text-blue-600 dark:text-blue-400' : ''} ${className}`}
        >
            {icon}
        </button>
    );
}
