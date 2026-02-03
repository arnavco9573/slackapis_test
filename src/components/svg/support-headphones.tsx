import { cn } from '@/lib/utils';
import React from 'react';

export default function SupportHeadphonesSvg({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="18"
            viewBox="0 0 16 18"
            fill="none"
            className={cn(className)}
        >
            <path
                d="M10.5 8.83366C10.5 7.91318 11.2462 7.16699 12.1667 7.16699C14.0076 7.16699 15.5 8.65938 15.5 10.5003C15.5 12.3413 14.0076 13.8337 12.1667 13.8337C11.2462 13.8337 10.5 13.0875 10.5 12.167V8.83366Z"
                stroke="currentColor"
            />
            <path
                d="M5.5 8.83366C5.5 7.91318 4.75381 7.16699 3.83333 7.16699C1.99238 7.16699 0.5 8.65938 0.5 10.5003C0.5 12.3413 1.99238 13.8337 3.83333 13.8337C4.75381 13.8337 5.5 13.0875 5.5 12.167V8.83366Z"
                stroke="currentColor"
            />
            <path
                d="M0.5 10.5V8C0.5 3.85786 3.85786 0.5 8 0.5C12.1421 0.5 15.5 3.85786 15.5 8V12.0385C15.5 13.7121 15.5 14.5489 15.2063 15.2014C14.8721 15.9441 14.2774 16.5387 13.5347 16.873C12.8822 17.1667 12.0454 17.1667 10.3718 17.1667H8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
