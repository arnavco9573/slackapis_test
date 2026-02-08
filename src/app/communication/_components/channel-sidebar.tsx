'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Hash, MessageSquare, Loader2, Slack, Lock } from 'lucide-react';
import { disconnectSlack } from '@/app/actions/slack-auth';
import ThreadSvg from '@/components/svg/thread';
import DirectorySvg from '@/components/svg/directory';
import EditPencilSvg from '@/components/svg/edit-pencil';

// Define the Channel type here or import it if it becomes shared
export type Channel = {
    id: string;
    name: string;
    type: 'partner' | 'public' | 'dm' | 'private';
    avatar?: string;
    userId?: string;
};

interface CommunicationSidebarProps {
    channelsData?: any; // Type accurately if possible, or use 'any' for now to match rapid refactor
    channelsLoading: boolean;
    allChannels: Channel[];
    selectedChannel: string | null;
    setSelectedChannel: (id: string) => void;
    unreadStatus?: Record<string, string | undefined> | Set<string>;
    lastReadTimestamps: Record<string, string>;
    slackAuthUrl?: string; // Optional if handled elsewhere
    activeView?: 'chat' | 'threads' | 'directory';
    setActiveView?: (view: 'chat' | 'threads' | 'directory') => void;
    users?: Record<string, any>;
    onOpenCreateChannel?: () => void;
}

export function ChannelSidebar({
    channelsData,
    channelsLoading,
    allChannels,
    selectedChannel,
    setSelectedChannel,
    unreadStatus,
    lastReadTimestamps,
    slackAuthUrl,
    activeView = 'chat',
    setActiveView,
    users,
    onOpenCreateChannel
}: CommunicationSidebarProps) {
    const isSlackConnected = !!channelsData?.isSlackConnected || !!channelsData?.currentSlackUserId;

    return (
        <div
            className="w-[288px] bg-[#1A1B1E] flex flex-col h-full"
            style={{
                boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                backdropFilter: 'blur(10px)'
            }}
        >
            {/* Header Section */}
            <div className="pt-6 pb-4 px-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-medium text-[18px] leading-[20px] text-white">Communication</h2>
                    <div onClick={onOpenCreateChannel}>
                        <EditPencilSvg className="text-white w-4 h-4 cursor-pointer hover:opacity-80" />
                    </div>
                </div>

                {/* Gradient Line */}
                <div
                    className="h-px w-full"
                    style={{
                        background: 'linear-gradient(90deg, #1A1B1E 0%, #3F4042 50.25%, #1A1B1E 100%), #FFF'
                    }}
                />
            </div>

            {/* Top Navigation Items */}
            <div className="px-4 flex flex-col gap-1 mb-6">
                <button
                    onClick={() => setActiveView?.('threads')}
                    className={cn(
                        "flex items-center gap-3 px-2 py-2 rounded-md transition-colors text-sm font-medium",
                        activeView === 'threads'
                            ? "bg-white/10 text-white"
                            : "text-white hover:bg-white/5"
                    )}
                >
                    <ThreadSvg className="text-white size-3.5" />
                    <span>Thread</span>
                </button>
                <button
                    onClick={() => setActiveView?.('directory')}
                    className={cn(
                        "flex items-center gap-3 px-2 py-2 rounded-md transition-colors text-sm font-medium",
                        activeView === 'directory'
                            ? "bg-white/10 text-white"
                            : "text-white hover:bg-white/5"
                    )}
                >
                    <DirectorySvg className="text-white w-3.5 h-3.5" />
                    <span>Directory</span>
                </button>
            </div>

            <ScrollArea className="flex-1 min-h-0 px-4">
                {/* Channels Section */}
                <div className="mb-6">
                    <div className="px-2 mb-2 flex items-center justify-between group">
                        <h3 className="text-[14px] font-normal leading-[18px] text-[#888]">Channels</h3>
                    </div>

                    {!isSlackConnected && !channelsLoading && slackAuthUrl && (
                        <div className="px-2 mb-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/40"
                                onClick={() => window.location.href = slackAuthUrl}
                            >
                                <Slack className="w-3.5 h-3.5" />
                                Connect Slack
                            </Button>
                        </div>
                    )}

                    <div className="space-y-px">
                        {channelsLoading ? (
                            <div className="pl-4 py-2"><Loader2 className="w-3 h-3 animate-spin text-zinc-400" /></div>
                        ) : allChannels.filter(c => c.type !== 'dm').map((channel) => {
                            const hasUnread = (() => {
                                if (activeView === 'chat' && channel.id === selectedChannel) return false;

                                if (unreadStatus instanceof Set) {
                                    return unreadStatus.has(channel.id);
                                }

                                // Record fallback
                                const latestTs = unreadStatus?.[channel.id];
                                if (!latestTs) return false;
                                const lastRead = lastReadTimestamps[channel.id] || '0';
                                return parseFloat(latestTs as string) > parseFloat(lastRead);
                            })();

                            return (
                                <button
                                    key={channel.id}
                                    onClick={() => {
                                        setSelectedChannel(channel.id);
                                        setActiveView?.('chat');
                                    }}
                                    className={cn(
                                        "w-full text-left px-2 py-2 rounded-md text-[14px] flex items-center justify-between transition-all duration-200 group",
                                        activeView === 'chat' && selectedChannel === channel.id
                                            ? "bg-white/10 text-white font-medium"
                                            : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                                    )}
                                >
                                    <div className="flex items-center gap-1 truncate">
                                        <span className="opacity-60 shrink-0">
                                            {channel.type === 'private' ? <Lock className="w-3.5 h-3.5" /> : <Hash className="w-3.5 h-3.5" />}
                                        </span>
                                        <span className="truncate">{channel.name.replace('wl-', '')}</span>
                                    </div>
                                    {hasUnread && (
                                        <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 mr-1 animate-pulse" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Direct Messages Section */}
                {allChannels.some(c => c.type === 'dm') && (
                    <div className="mb-6">
                        <div className="px-2 mb-2 flex items-center justify-between group">
                            <h3 className="text-[14px] font-normal leading-[18px] text-[#888]">Direct Messages</h3>
                        </div>
                        <div className="space-y-px">
                            {allChannels.filter(c => c.type === 'dm').map((channel) => {
                                const hasUnread = (() => {
                                    if (activeView === 'chat' && channel.id === selectedChannel) return false;

                                    if (unreadStatus instanceof Set) {
                                        return unreadStatus.has(channel.id);
                                    }

                                    const latestTs = unreadStatus?.[channel.id];
                                    if (!latestTs) return false;
                                    const lastRead = lastReadTimestamps[channel.id] || '0';
                                    return parseFloat(latestTs as string) > parseFloat(lastRead);
                                })();

                                return (
                                    <button
                                        key={channel.id}
                                        onClick={() => {
                                            setSelectedChannel(channel.id);
                                            setActiveView?.('chat');
                                        }}
                                        className={cn(
                                            "w-full text-left px-2 py-2 rounded-md text-[14px] flex items-center justify-between transition-all duration-200 group",
                                            activeView === 'chat' && selectedChannel === channel.id
                                                ? "bg-white/10 text-white font-medium"
                                                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 truncate">
                                            <span className="opacity-60 shrink-0">
                                                {channel.avatar ? (
                                                    <img src={channel.avatar} alt="" className="w-4 h-4 rounded-sm" />
                                                ) : (
                                                    <MessageSquare className="w-4 h-4" />
                                                )}
                                            </span>
                                            <span className="truncate">{channel.name}{channel.userId === channelsData?.currentSlackUserId ? " (You)" : ""}</span>
                                        </div>
                                        {hasUnread && (
                                            <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 mr-1 animate-pulse" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </ScrollArea>

            {/* Bottom Controls / Disconnect */}
            {isSlackConnected && (
                <div className="p-4 border-t border-white/5">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs h-8 text-neutral-400 hover:text-white hover:bg-white/5 justify-start px-2 cursor-pointer"
                        onClick={async () => {
                            await disconnectSlack();
                            window.location.href = window.location.pathname;
                        }}
                    >
                        <Slack className="w-3.5 h-3.5 mr-2" />
                        <span className="truncate">Disconnect Slack</span>
                    </Button>
                </div>
            )}
        </div>
    );
}
