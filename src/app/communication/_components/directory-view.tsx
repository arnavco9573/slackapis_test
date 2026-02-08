'use client';

import { useState, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Channel } from './channel-sidebar';
import DirectoryAllAccountsSvg from '@/components/svg/directory-all-accounts';
import DirectoryCommonChannelsSvg from '@/components/svg/directory-common-channels';
import DirectoryPrivateChannelsSvg from '@/components/svg/directory-private-channels';
import DirectoryWLPartnersSvg from '@/components/svg/directory-wl-partners';
import DirectoryAdminSvg from '@/components/svg/directory-admin';
import SortByIconSvg from '@/components/svg/sort-by-icon';
import SearchSvg from '@/components/svg/search';
import ArrowSvg from '@/components/svg/arrow';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Button from '@/components/core/button'; // Fixed import path

interface DirectoryViewProps {
    allChannels: (Channel & { num_members?: number; description?: string; is_member?: boolean })[];
    users: Record<string, any>;
    onChannelSelect: (channelId: string) => void;
    directoryRoles: { partners: string[]; admins: string[]; adminSlackIds?: string[] };
}

type DirectoryTab = 'all' | 'public' | 'private' | 'partner' | 'admin';

export function DirectoryView({ allChannels, users, onChannelSelect, directoryRoles }: DirectoryViewProps) {
    const [activeTab, setActiveTab] = useState<DirectoryTab>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'a-z' | 'z-a' | 'newest' | 'oldest'>('a-z');

    // Filter and Sort Logic
    const filteredChannels = useMemo(() => {
        let filtered = allChannels.filter(c => {
            // Tab Filtering
            if (activeTab === 'all') return c.type === 'dm'; // "All Accounts" -> Users (DMs)
            if (activeTab === 'public') return c.type === 'public'; // "Common Channels"
            if (activeTab === 'private') return c.type === 'private'; // "Private Channels"

            if (activeTab === 'partner') {
                if (c.type !== 'dm') return false;

                const user = users[c.userId || ''];
                if (!user || user.is_bot || user.id === 'USLACKBOT') return false; // Skip bots silently

                const userEmail = user.profile?.email;
                if (!userEmail) {
                    console.log("DEBUG: Partner Check - No email for HUMAN user:", c.userId, user.real_name);
                    return false;
                }

                const isPartner = directoryRoles.partners.includes(userEmail);
                if (isPartner) console.log("DEBUG: Partner Match Found for:", userEmail);
                return isPartner;
            }

            if (activeTab === 'admin') {
                if (c.type !== 'dm') return false;

                const user = users[c.userId || ''];
                if (!user || user.is_bot || user.id === 'USLACKBOT') return false; // Skip bots

                // Check 1: Match by Slack User ID (Preferred)
                if (directoryRoles.adminSlackIds?.includes(user.id)) {
                    console.log("DEBUG: Admin Match by ID Found for:", user.real_name, user.id);
                    return true;
                }

                // Check 2: Match by Email (Fallback)
                const userEmail = user.profile?.email;
                if (userEmail) {
                    const isAdmin = directoryRoles.admins.includes(userEmail);
                    if (isAdmin) console.log("DEBUG: Admin Match by Email Found for:", userEmail);
                    return isAdmin;
                }

                return false;
            }

            return true;
        });

        // Search Filtering
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(c =>
                (c.name || '').toLowerCase().includes(query) ||
                (users[c.userId || '']?.real_name || '').toLowerCase().includes(query)
            );
        }

        // Sorting
        return filtered.sort((a, b) => {
            const nameA = (a.name || users[a.userId || '']?.real_name || '').toLowerCase();
            const nameB = (b.name || users[b.userId || '']?.real_name || '').toLowerCase();

            if (sortBy === 'a-z') return nameA.localeCompare(nameB);
            if (sortBy === 'z-a') return nameB.localeCompare(nameA);
            // Newest/Oldest - we don't have dates in Channel type yet, so fallback to name or id
            return 0;
        });
    }, [allChannels, users, activeTab, searchQuery, sortBy]);

    const tabs = [
        { id: 'all', label: 'All Accounts', icon: DirectoryAllAccountsSvg },
        { id: 'public', label: 'Common Channels', icon: DirectoryCommonChannelsSvg },
        { id: 'private', label: 'Private Channels', icon: DirectoryPrivateChannelsSvg },
        { id: 'partner', label: 'WL Partners', icon: DirectoryWLPartnersSvg },
        { id: 'admin', label: 'Admin', icon: DirectoryAdminSvg },
    ];

    return (
        <div className="flex flex-col h-full bg-[#14161B] w-full" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            {/* Top Bar */}
            <div
                className="shrink-0 flex flex-col justify-between items-start"
                style={{
                    height: '116px',
                    padding: '16px 36px',
                    borderBottom: '1px solid #1A1B1E',
                    background: '#1A1B1E',
                    alignSelf: 'stretch'
                }}
            >
                <h2 className="text-white text-[16px] font-medium leading-[18px]">Directories</h2>

                <div className="flex items-center gap-2">
                    {tabs.map(tab => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;
                        return (
                            <Button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as DirectoryTab)}
                                className={cn(
                                    "h-[32px] px-4 gap-2 text-xs font-medium rounded-full transition-all duration-200",
                                    !isActive && "bg-none! bg-transparent! border-transparent! hover:bg-transparent! text-zinc-400 hover:text-white shadow-none!"
                                )}
                            >
                                <Icon className={cn("size-5", isActive ? "text-white" : "text-current")} />
                                <span className={cn("text-base font-medium", isActive ? "text-white" : "text-zinc-400")}>{tab.label}</span>
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Sub Header: Search and Sort */}
            <div className="px-[36px] py-6 flex items-center justify-between bg-[#14161B] gap-4">
                {/* Search Bar */}
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchSvg className="h-4 w-4 text-zinc-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-[90px] focus:outline-none focus:ring-1 focus:ring-zinc-600"
                    />
                </div>

                {/* Sort By */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className="flex items-center gap-2 px-4 py-2">
                            <span>Sort By</span>
                            <SortByIconSvg className="w-4 h-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        align="end"
                        className="w-[200px] p-4 text-white border border-white/10"
                        style={{
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.01)',
                            boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <h4 style={{ color: '#888', fontSize: '14px', marginBottom: '12px' }}>General Sorting</h4>
                        <RadioGroup value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                            <div className="flex items-center space-x-2 mb-2">
                                <RadioGroupItem value="a-z" id="a-z" className="border-zinc-600 text-white" />
                                <Label htmlFor="a-z" className="text-sm font-normal text-zinc-300">A to Z</Label>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                                <RadioGroupItem value="z-a" id="z-a" className="border-zinc-600 text-white" />
                                <Label htmlFor="z-a" className="text-sm font-normal text-zinc-300">Z to A</Label>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                                <RadioGroupItem value="newest" id="newest" className="border-zinc-600 text-white" />
                                <Label htmlFor="newest" className="text-sm font-normal text-zinc-300">Newest to oldest</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="oldest" id="oldest" className="border-zinc-600 text-white" />
                                <Label htmlFor="oldest" className="text-sm font-normal text-zinc-300">Oldest to newest</Label>
                            </div>
                        </RadioGroup>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-[36px] pb-8 active:outline-none focus:outline-none custom-scrollbar">
                {activeTab === 'public' || activeTab === 'private' ? (
                    /* LIST VIEW for Channels */
                    <div className="flex flex-col border border-white/5 rounded-xl bg-[#1D1E21] overflow-hidden">
                        {filteredChannels.map((channel, index) => (
                            <div
                                key={channel.id}
                                className={cn(
                                    "flex flex-col p-4 gap-2 hover:bg-white/5 transition-colors cursor-pointer group",
                                    index !== filteredChannels.length - 1 && "border-b border-white/5"
                                )}
                                onClick={() => onChannelSelect(channel.id)}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-zinc-500">
                                        {channel.type === 'private' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="9" y2="9" /><line x1="4" x2="20" y1="15" y2="15" /><line x1="10" x2="8" y1="3" y2="21" /><line x1="16" x2="14" y1="3" y2="21" /></svg>
                                        )}
                                    </span>
                                    <span className="text-white font-medium text-[15px]">{channel.name.replace('wl-', '')}</span>
                                </div>

                                <div className="flex items-center gap-2 text-[13px] text-zinc-500">
                                    {channel.is_member && (
                                        <div className="flex items-center gap-1 text-[#007a5a]">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                            <span className="font-medium">Joined</span>
                                        </div>
                                    )}

                                    {channel.is_member && <span className="text-zinc-700">•</span>}

                                    <span>{channel.num_members || 0} members</span>

                                    {channel.description && (
                                        <>
                                            <span className="text-zinc-700">•</span>
                                            <span className="truncate max-w-[400px]">{channel.description}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* GRID VIEW for Users / Partners */
                    <div className="grid grid-cols-[repeat(auto-fill,224px)] gap-6">
                        {filteredChannels.map(channel => {
                            const channelName = channel.name.replace('wl-', '');
                            // Simply avatar logic with hi-res fallback
                            const profile = users[channel.userId || '']?.profile;
                            const avatar = channel.avatar || profile?.image_512 || profile?.image_192 || profile?.image_48;

                            return (
                                <div
                                    key={channel.id}
                                    className="flex flex-col items-start p-4 gap-6 rounded-xl border border-white/5 bg-[#1D1E21]"
                                    style={{
                                        width: '224px',
                                        height: '240px',
                                        borderRadius: '12px',
                                        background: '#1D1E21',
                                    }}
                                >
                                    {/* Image Area */}
                                    <div className="w-full h-[156px] rounded-lg bg-zinc-800 overflow-hidden flex items-center justify-center">
                                        {avatar ? (
                                            <img src={avatar} alt={channelName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-zinc-500 text-xl font-medium">
                                                {channelName.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between w-full mt-auto">
                                        <span className="text-white text-[14px] font-medium truncate max-w-[120px]" title={channelName}>
                                            {channelName} <span className="text-[10px] text-zinc-500"></span>
                                        </span>

                                        <Button
                                            onClick={() => onChannelSelect(channel.id)}
                                            className="rounded-full px-2 py-1 w-8 h-8 pointer-events-auto cursor-pointer"
                                        >
                                            <ArrowSvg className="text-white size-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
