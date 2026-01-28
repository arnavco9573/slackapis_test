"use client";

import { Hash, Lock, Plus } from "lucide-react";
import { CreateChannelModal } from "./create-channel-modal";
import { useState } from "react";

interface Channel {
    id: string;
    name: string;
    is_private?: boolean;
    num_members?: number;
}

interface ChannelSidebarProps {
    channels: Channel[];
    selectedChannelId: string | null;
    onSelectChannel: (channelId: string) => void;
    isLoading: boolean;
    onRefresh: () => void;
    unreadChannelIds?: Set<string>;
    users?: Record<string, any>;
    dms?: any[];
    currentUserId?: string | null;
}

export function ChannelSidebar({ channels, selectedChannelId, onSelectChannel, isLoading, onRefresh, unreadChannelIds, users, dms, currentUserId }: ChannelSidebarProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="w-64 p-4 bg-neutral-03 space-y-4">
                <div className="h-6 w-32 bg-neutral-05 rounded animate-pulse" />
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-8 bg-neutral-05 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-[260px] bg-card flex flex-col h-full font-sans antialiased">
            <div className="h-12 px-4 flex items-center justify-between border-neutral-05">
                <h2 className="font-bold text-text-highest text-sm truncate">Workspace</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="h-6 w-6 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 px-2 space-y-px">
                <div className="px-2 mb-2">
                    <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Channels</h3>
                </div>
                {channels.map((channel) => {
                    const isUnread = unreadChannelIds?.has(channel.id);
                    return (
                        <button
                            key={channel.id}
                            onClick={() => onSelectChannel(channel.id)}
                            className={`w-full text-left px-2 py-1.5 rounded-md text-[14px] flex items-center gap-2 transition-all duration-200 group relative ${selectedChannelId === channel.id
                                ? "bg-neutral-05 text-text-highest font-medium"
                                : `text-text-highest hover:bg-neutral-05 ${isUnread ? "font-semibold" : ""}`
                                }`}
                        >
                            {channel.is_private ? (
                                <Lock className={`w-3.5 h-3.5 opacity-60 ${isUnread ? "text-text-highest opacity-100" : ""}`} />
                            ) : (
                                <Hash className={`w-3.5 h-3.5 opacity-60 ${isUnread ? "text-text-highest opacity-100" : ""}`} />
                            )}
                            <span className="truncate flex-1">{channel.name.replace('wl-', '')}</span>

                            {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-red-500 absolute right-2 top-1/2 -translate-y-1/2 shadow-sm animate-in fade-in zoom-in"></span>
                            )}
                        </button>
                    );
                })}



                <div className="px-2 mt-6 mb-2">
                    <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Direct Messages</h3>
                </div>
                {dms?.map((dm) => {
                    const otherUserId = dm.user; // For IMs, 'user' is the other person
                    // If it's a multi-person IM (mpim), 'user' might be null, but let's handle 1:1 first.
                    const otherUser = users?.[otherUserId];
                    let name = otherUser?.real_name || otherUser?.name || "Unknown User";
                    const isUnread = unreadChannelIds?.has(dm.id);

                    if (otherUserId === currentUserId) {
                        name += " (You)";
                    }

                    return (
                        <button
                            key={dm.id}
                            onClick={() => onSelectChannel(dm.id)}
                            className={`w-full text-left px-2 py-1.5 rounded-md text-[14px] flex items-center gap-2 transition-all duration-200 group relative ${selectedChannelId === dm.id
                                ? "bg-neutral-05 text-text-highest font-medium"
                                : `text-text-highest hover:bg-neutral-05 ${isUnread ? "font-semibold" : ""}`
                                }`}
                        >
                            {/* Avatar or Status Icon */}
                            <span className="relative flex shrink-0 overflow-hidden rounded-full w-3.5 h-3.5">
                                {otherUser?.profile?.image_24 ? (
                                    <img className="aspect-square h-full w-full" src={otherUser.profile.image_24} alt={name} />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                    </div>
                                )}
                            </span>

                            <span className="truncate flex-1">{name}</span>

                            {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-red-500 absolute right-2 top-1/2 -translate-y-1/2 shadow-sm animate-in fade-in zoom-in"></span>
                            )}
                        </button>
                    );
                })}
                {(!dms || dms.length === 0) && (
                    <div className="text-center py-2 text-xs text-gray-400">
                        No DMs found.
                    </div>
                )}
            </div>

            <CreateChannelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={onRefresh}
                users={users}
            />
        </div>
    );
}
