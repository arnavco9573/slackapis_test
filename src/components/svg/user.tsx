import React from 'react'
import { cn } from '@/lib/utils'

export default function UserSvg({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={cn(className)}>
            <path d="M8.10573 7.24536C8.03906 7.2387 7.95906 7.2387 7.88573 7.24536C6.29906 7.19203 5.03906 5.89203 5.03906 4.29203C5.03906 2.6587 6.35906 1.33203 7.99906 1.33203C9.6324 1.33203 10.9591 2.6587 10.9591 4.29203C10.9524 5.89203 9.6924 7.19203 8.10573 7.24536Z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.7725 9.70797C3.15917 10.788 3.15917 12.548 4.7725 13.6213C6.60583 14.848 9.6125 14.848 11.4458 13.6213C13.0592 12.5413 13.0592 10.7813 11.4458 9.70797C9.61917 8.48797 6.6125 8.48797 4.7725 9.70797Z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
