import React from 'react'

export default function EditorImage({ size = 18, className }: { size?: number | string, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 18 18" fill="none" className={className}>
            <path d="M15.9685 12.4915L13.6629 7.10693C12.8821 5.28014 11.4457 5.20648 10.4808 6.94488L9.0886 9.45671C8.38146 10.731 7.06293 10.8415 6.14954 9.69979L5.98748 9.49354C5.03726 8.30023 3.69664 8.44755 3.01159 9.81028L1.74463 12.3516C0.853333 14.1194 2.1424 16.204 4.1165 16.204H13.5156C15.4308 16.204 16.7198 14.252 15.9685 12.4915Z" stroke="currentColor" strokeWidth="1.32589" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.1356 5.8923C6.35605 5.8923 7.34542 4.90293 7.34542 3.68248C7.34542 2.46203 6.35605 1.47266 5.1356 1.47266C3.91515 1.47266 2.92578 2.46203 2.92578 3.68248C2.92578 4.90293 3.91515 5.8923 5.1356 5.8923Z" stroke="currentColor" strokeWidth="1.32589" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
