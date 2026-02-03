import React from 'react';
import { cn } from '@/lib/utils';

export default function SuccessCheckSvg({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            className={cn(className)}
        >
            <path
                d="M12.9165 1.53022C11.6908 0.821173 10.2677 0.415364 8.74984 0.415364C4.14746 0.415364 0.416504 4.14632 0.416504 8.7487C0.416504 13.3511 4.14746 17.082 8.74984 17.082C13.3522 17.082 17.0832 13.3511 17.0832 8.7487C17.0832 8.17792 17.0258 7.62055 16.9165 7.08203"
                stroke="currentColor"
                strokeWidth="0.833333"
                strokeLinecap="round"
            />
            <path
                d="M5.4165 9.16797C5.4165 9.16797 6.6665 9.16797 8.33317 12.0846C8.33317 12.0846 12.9655 4.44575 17.0832 2.91797"
                stroke="currentColor"
                strokeWidth="0.833333"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
