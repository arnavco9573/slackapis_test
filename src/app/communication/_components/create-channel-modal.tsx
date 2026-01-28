"use client";

import { useState } from "react";
import { Plus, X, Lock } from "lucide-react";
import { createChannel } from "@/app/actions/slack-actions";

export function CreateChannelModal({ isOpen, onClose, onCreated, users }: { isOpen: boolean; onClose: () => void; onCreated: () => void, users?: Record<string, any> }) {
    const [name, setName] = useState("");
    const [isPrivate, setIsPrivate] = useState(true); // Default to Private
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

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
                // Extract useful error message
                const errData = res.error as any;
                const slackError = errData?.data?.error || errData?.message || "Unknown error";

                if (slackError === 'missing_scope') {
                    setError("Missing Scope: Add 'groups:write' to your Slack App Bot/User Scopes.");
                } else if (slackError === 'name_taken') {
                    setError("Channel name is already taken.");
                } else if (slackError === 'restricted_action') {
                    setError("Action restricted: You might not have permission to create private channels.");
                } else {
                    setError(`Failed: ${slackError}`);
                }
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

    const userList = Object.values(users || {}).filter(u => !u.is_bot && !u.deleted && u.id !== "USLACKBOT");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6 m-4 border dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold dark:text-gray-100">Create New Channel</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Channel Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. wl-partner-apple"
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Lowercase, no spaces. Will be formatted automatically.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isPrivate"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                        <label htmlFor="isPrivate" className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            Make Private <Lock className="w-3 h-3 text-gray-400" />
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Add Members
                        </label>
                        <div className="max-h-40 overflow-y-auto border rounded-lg dark:border-gray-700 divide-y dark:divide-gray-800">
                            {userList.length === 0 ? (
                                <p className="p-3 text-sm text-gray-500">No users found.</p>
                            ) : (
                                userList.map((u: any) => (
                                    <label key={u.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedUserIds.includes(u.id)}
                                            onChange={() => toggleUser(u.id)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                        />
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <img src={u.profile?.image_24} alt="" className="w-6 h-6 rounded-full bg-gray-200" />
                                            <span className="text-sm truncate dark:text-gray-200">
                                                {u.real_name || u.name}
                                            </span>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={!name || isCreating}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isCreating ? "Creating..." : "Create Channel"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
