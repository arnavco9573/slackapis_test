import React from 'react';
import { cn } from '@/lib/utils';

export default function ThreeDotsVerticalSvg({ className }: { className?: string }) {
    return (
        <svg
            width="4"
            height="16"
            viewBox="0 0 4 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(className)}
        >
            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
            <circle cx="2" cy="8" r="1.5" fill="currentColor" />
            <circle cx="2" cy="14" r="1.5" fill="currentColor" />
        </svg>
    );
}
