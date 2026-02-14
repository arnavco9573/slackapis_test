import React from 'react';
import { cn } from '@/lib/utils';

export default function DragHandleSvg({ className }: { className?: string }) {
    return (
        <svg
            width="12"
            height="18"
            viewBox="0 0 12 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(className)}
        >
            <circle cx="4" cy="4" r="1.5" fill="currentColor" />
            <circle cx="4" cy="9" r="1.5" fill="currentColor" />
            <circle cx="4" cy="14" r="1.5" fill="currentColor" />
            <circle cx="8" cy="4" r="1.5" fill="currentColor" />
            <circle cx="8" cy="9" r="1.5" fill="currentColor" />
            <circle cx="8" cy="14" r="1.5" fill="currentColor" />
        </svg>
    );
}
