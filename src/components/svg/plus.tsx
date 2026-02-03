import { cn } from '@/lib/utils';
import React from 'react';

export default function PlusSvg({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            className={cn(className)}
        >
            <path
                d="M7.16797 0.5V13.8333"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M0.5 7.1665H13.8333"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
