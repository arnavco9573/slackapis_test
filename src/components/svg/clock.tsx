import React from 'react'
import { cn } from '@/lib/utils'

export default function ClockSvg({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className={cn(className)}>
            <path d="M12.8307 7.0013C12.8307 10.2213 10.2174 12.8346 6.9974 12.8346C3.7774 12.8346 1.16406 10.2213 1.16406 7.0013C1.16406 3.7813 3.7774 1.16797 6.9974 1.16797C10.2174 1.16797 12.8307 3.7813 12.8307 7.0013Z" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.16125 8.85307L7.35292 7.77391C7.03792 7.58724 6.78125 7.13807 6.78125 6.77057V4.37891" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
