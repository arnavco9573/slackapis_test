'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, Download, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface MediaViewerProps {
    media: {
        url: string;
        name: string;
        type: 'image' | 'pdf' | 'video' | 'audio' | string;
    } | null;
    onClose: () => void;
}

export function MediaViewer({ media, onClose }: MediaViewerProps) {
    const [isLoading, setIsLoading] = useState(true);

    if (!media) return null;

    const isImage = media.type === 'image' || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(media.type);
    const isPDF = media.type === 'pdf' || media.url.toLowerCase().endsWith('.pdf');

    // Use our proxy for all Slack files
    const proxiedUrl = media.url.includes('slack.com')
        ? `/api/slack-file?url=${encodeURIComponent(media.url)}&name=${encodeURIComponent(media.name)}`
        : media.url;

    return (
        <Dialog open={!!media} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-black/90 flex flex-col items-center justify-center overflow-hidden"
                overlayClassName="bg-black/80 backdrop-blur-sm"
                hideClose
            >
                {/* Custom Header */}
                <div className="absolute top-0 left-0 right-0 h-14 bg-black/40 flex items-center justify-between px-6 z-50">
                    <div className="flex flex-col">
                        <span className="text-white text-sm font-medium truncate max-w-[300px]">
                            {media.name}
                        </span>
                        <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">
                            {isPDF ? 'PDF Document' : isImage ? 'Image' : 'Media'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-400 hover:text-white hover:bg-white/10"
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = proxiedUrl;
                                link.download = media.name;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                        >
                            <Download className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-400 hover:text-white hover:bg-white/10"
                            onClick={() => window.open(proxiedUrl, '_blank')}
                        >
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-400 hover:text-white hover:bg-white/10"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <div className="relative w-full h-full flex items-center justify-center p-8 md:p-14">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/20">
                            <Loader2 className="w-8 h-8 animate-spin text-white/50" />
                        </div>
                    )}

                    {isImage && (
                        <img
                            src={proxiedUrl}
                            alt={media.name}
                            className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                            onLoad={() => setIsLoading(false)}
                            onError={() => setIsLoading(false)}
                        />
                    )}

                    {isPDF && (
                        <div className="w-full h-[85vh] max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden border border-white/10 flex flex-col">
                            <iframe
                                src={`${proxiedUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                                className="w-full h-full flex-1"
                                onLoad={() => setIsLoading(false)}
                            />
                        </div>
                    )}

                    {!isImage && !isPDF && (
                        <div className="text-white flex flex-col items-center gap-4">
                            <p>This media type cannot be previewed in the app yet.</p>
                            <Button onClick={() => window.open(proxiedUrl, '_blank')}>
                                Open in New Tab
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
