
import React from 'react';
import { cn } from '@/lib/utils';

export default function DotsPattern({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={cn(className)}
        >
            <circle cx="22.5" cy="22.5" r="1.5" fill="currentColor" />
            <circle cx="22.5" cy="17.5" r="1.5" fill="currentColor" />
            <circle cx="22.5" cy="12.5" r="1.5" fill="currentColor" />
            <circle cx="17.5" cy="22.5" r="1.5" fill="currentColor" />
            <circle cx="17.5" cy="17.5" r="1.5" fill="currentColor" />
            <circle cx="12.5" cy="22.5" r="1.5" fill="currentColor" />
        </svg>
    );
}
