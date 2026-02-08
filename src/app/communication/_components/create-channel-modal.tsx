"use client";

import { useState } from "react";
import { X, Lock, Hash, Search, Check } from "lucide-react";
import { createChannel } from "@/app/actions/slack-actions";
import InputField from "@/components/core/input-field";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import SuccessCheckSvg from '@/components/svg/success-check';
import Button from "@/components/core/button";

export function CreateChannelModal({ isOpen, onClose, onCreated, users }: { isOpen: boolean; onClose: () => void; onCreated: () => void, users?: Record<string, any> }) {
    const [name, setName] = useState("");
    const [isPrivate, setIsPrivate] = useState(true); // Default to Private as per image
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isTypeOpen, setIsTypeOpen] = useState(false);

    const handleCreate = async () => {
        if (!name) return;
        setIsCreating(true);
        setError("");

        // Slack channel names: lowercase, no spaces, max 80 chars
        const safeName = name.toLowerCase().replace(/\s+/g, "-").slice(0, 80);

        try {
            const res = await createChannel(undefined, safeName, isPrivate, selectedUserIds);
            if (res.success) {
                onCreated();
                onClose();
                setName("");
                setSelectedUserIds([]);
                setIsPrivate(true);
            } else {
                const errData = res.error as any;
                const slackError = errData?.data?.error || errData?.message || "Unknown error";
                setError(slackError === 'name_taken' ? "Channel name is taken." : `Failed: ${slackError}`);
            }
        } catch (e) {
            setError("Unexpected error.");
        } finally {
            setIsCreating(false);
        }
    };

    const toggleUser = (userId: string) => {
        if (selectedUserIds.includes(userId)) {
            setSelectedUserIds(prev => prev.filter(id => id !== userId));
        } else {
            setSelectedUserIds(prev => [...prev, userId]);
        }
    };

    const userList = Object.values(users || {})
        .filter(u => !u.is_bot && !u.deleted && u.id !== "USLACKBOT")
        .filter(u => {
            if (!searchTerm) return true;
            const fullName = (u.real_name || u.name || "").toLowerCase();
            return fullName.includes(searchTerm.toLowerCase());
        });

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                hideClose
                overlayClassName="bg-neutral-03 backdrop-blur-2xl z-999"
                className="w-full max-w-md p-6 m-4 flex flex-col gap-6 border-none text-white z-999 shadow-none ring-0 focus:ring-0 outline-none focus:outline-none"
                style={{
                    borderRadius: '12px',
                    background: 'var(--Neutral-Neutrals-03, rgba(255, 255, 255, 0.03))',
                    boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                    backdropFilter: 'blur(40px)'
                }}
            >
                <DialogTitle className="sr-only">Create New Channel</DialogTitle>
                <DialogDescription className="sr-only">Fill in the details to create a new Slack channel.</DialogDescription>

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h3 className="text-[18px] font-medium text-white">Create New Channel</h3>
                    <Button
                        onClick={onClose}
                        className="w-8 h-8 p-0 border-none! bg-transparent! bg-none! text-white!"
                    >
                        <X className="w-5 h-5 text-zinc-400" />
                    </Button>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Channel Name */}
                    <div className="flex flex-col gap-2">
                        <InputField
                            id="channel-name"
                            label="Channel Name"
                            name="channel-name"
                            type="text"
                            placeholder="# e.g. trade-operations"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            wrapperClassName="w-full"
                            inputClassName="h-[58px] justify-center"
                        />
                    </div>

                    {/* Channel Type Dropdown */}
                    <div className="flex flex-col gap-2">
                        <Popover open={isTypeOpen} onOpenChange={setIsTypeOpen}>
                            <PopoverTrigger asChild className="w-full">
                                <button
                                    className="relative flex flex-col items-start gap-[2px] self-stretch rounded-xl px-4 py-1.5 w-full cursor-pointer h-auto bg-white/5 border border-transparent hover:border-white/10 transition-all text-left"
                                    style={{
                                        background: 'var(--Neutral-Neutrals-03, rgba(255, 255, 255, 0.03))',
                                        boxShadow: '0 0 0 1px rgba(255,255,255,0.05) inset'
                                    }}
                                >
                                    <span className="text-[12px] leading-[16px] font-normal capitalize text-zinc-400 z-10">
                                        Channel Type
                                    </span>
                                    <div className="flex items-center justify-between w-full z-10">
                                        <div className="flex items-center gap-2 text-white h-7">
                                            {isPrivate ? <Lock className="w-4 h-4 text-zinc-400" /> : <Hash className="w-4 h-4 text-zinc-400" />}
                                            <span className="text-[16px]">{isPrivate ? 'Private' : 'Public'}</span>
                                        </div>
                                        <div className={`transition-transform duration-200 ${isTypeOpen ? 'rotate-180' : ''}`}>
                                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1.5L6 6.5L11 1.5" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-(--radix-popover-trigger-width) p-1 bg-[#1D1E21] border border-white/10 rounded-xl z-1001" sideOffset={8}>
                                <div className="flex flex-col p-1">
                                    <button
                                        onClick={() => { setIsPrivate(true); setIsTypeOpen(false); }}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white transition-colors",
                                            isPrivate ? "bg-white/10" : "hover:bg-white/5"
                                        )}
                                    >
                                        <Lock className="w-4 h-4 text-zinc-400" />
                                        <div className="flex flex-col items-start">
                                            <span className="font-medium">Private</span>
                                            <span className="text-xs text-zinc-500">Only invited people</span>
                                        </div>
                                        {isPrivate && <Check className="w-4 h-4 ml-auto text-white" />}
                                    </button>
                                    <button
                                        onClick={() => { setIsPrivate(false); setIsTypeOpen(false); }}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white transition-colors",
                                            !isPrivate ? "bg-white/10" : "hover:bg-white/5"
                                        )}
                                    >
                                        <Hash className="w-4 h-4 text-zinc-400" />
                                        <div className="flex flex-col items-start">
                                            <span className="font-medium">Public</span>
                                            <span className="text-xs text-zinc-500">Anyone can join</span>
                                        </div>
                                        {!isPrivate && <Check className="w-4 h-4 ml-auto text-white" />}
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Members Selection (Always visible now) */}
                    <div className="flex flex-col gap-2">
                        <span className="text-[14px] text-zinc-400">Add Members</span>
                        <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                            <div className="p-3 border-b border-white/5">
                                <div className="flex items-center gap-2 px-3 py-2 bg-black/20 rounded-lg">
                                    <Search className="w-4 h-4 text-zinc-500" />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="bg-transparent border-none outline-none text-sm text-white placeholder:text-zinc-600 w-full"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                                {userList.length === 0 ? (
                                    <p className="p-4 text-center text-sm text-zinc-500">No users found.</p>
                                ) : (
                                    userList.map((u: any) => (
                                        <div
                                            key={u.id}
                                            className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer group transition-colors"
                                            onClick={() => toggleUser(u.id)}
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <img src={u.profile?.image_24 || u.profile?.image_original} alt="" className="w-8 h-8 rounded-full bg-zinc-800" />
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-sm font-medium text-white truncate">{u.real_name || u.name}</span>
                                                    <span className="text-xs text-zinc-500 truncate">{u.profile?.email || 'No email'}</span>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedUserIds.includes(u.id) ? 'bg-blue-600 border-blue-600' : 'border-zinc-700 bg-transparent'}`}>
                                                {selectedUserIds.includes(u.id) && <Check className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                {/* Footer Buttons */}
                <div className="flex items-center justify-between gap-4 pt-2">
                    <Button
                        onClick={onClose}
                        className="flex-1 px-6 text-base bg-none! border-none! bg-transparent! text-white!"
                    >
                        Discard
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={!name || isCreating}
                        className="flex-1 px-6 text-base"
                    >
                        <span>{isCreating ? "Creating..." : "Create"}</span>
                        {!isCreating && <SuccessCheckSvg className="w-5 h-5" />}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
