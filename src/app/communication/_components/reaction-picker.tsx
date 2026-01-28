import { Smile } from "lucide-react";
import { addReaction } from "@/app/actions/slack-actions";
import { useState } from "react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useQueryClient } from "@tanstack/react-query";

export function ReactionPicker({ channelId, timestamp }: { channelId: string, timestamp: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    const handleReact = async (emojiData: EmojiClickData) => {
        console.log("Emoji Data:", emojiData);
        // Clean up name: remove spaces, lowercase. ensuring it handles 'thumbs up' -> 'thumbsup' might be needed
        // But let's see what we get first.
        // Also 'unified' is like '1f600'. Slack doesn't take that as name usually.
        let emojiName = emojiData.names?.[0] || "";

        // Basic sanitization try: lowercase and replace spaces with underscore?
        // Slack often uses underscores. e.g. 'thumbs_up'
        // emoji-picker-react often returns 'thumbs up'
        emojiName = emojiName.toLowerCase().replace(/\s+/g, '_');

        console.log("Sending Emoji Name:", emojiName);

        // Optimistic update - handle Infinite Query structure
        queryClient.setQueryData(['slack-messages', channelId], (oldData: any) => {
            if (!oldData || !oldData.pages) return oldData;

            const newPages = oldData.pages.map((page: any) => ({
                ...page,
                messages: page.messages.map((msg: any) => {
                    if (msg.ts === timestamp) {
                        const reactions = msg.reactions || [];
                        const existingReaction = reactions.find((r: any) => r.name === emojiName);
                        let newReactions;
                        if (existingReaction) {
                            newReactions = reactions.map((r: any) =>
                                r.name === emojiName ? { ...r, count: r.count + 1 } : r
                            );
                        } else {
                            newReactions = [...reactions, { name: emojiName, count: 1 }];
                        }
                        return { ...msg, reactions: newReactions };
                    }
                    return msg;
                })
            }));

            return { ...oldData, pages: newPages };
        });

        setIsOpen(false);

        // Send to Slack in background
        await addReaction(undefined, channelId, timestamp, emojiName);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded text-zinc-500 hover:text-yellow-500"
                title="Add reaction"
            >
                <Smile className="w-4 h-4" />
            </button>
            {isOpen && (
                <>
                    <div className="absolute top-full right-0 mt-1 z-50">
                        <EmojiPicker
                            onEmojiClick={handleReact}
                            width={320}
                            height={400}
                            theme={Theme.AUTO}
                            searchDisabled={false}
                            skinTonesDisabled
                            previewConfig={{ showPreview: false }}
                        />
                    </div>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                </>
            )}
        </div>
    )
}
