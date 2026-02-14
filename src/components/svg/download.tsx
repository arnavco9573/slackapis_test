import React from "react"
import { cn } from "@/lib/utils"

const DownloadSvg = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={cn(className)}
        >
            <path
                d="M7.9987 9.66667L7.9987 3M7.9987 9.66667C7.53188 9.66667 6.65972 8.33713 6.33203 8M7.9987 9.66667C8.46552 9.66667 9.33768 8.33713 9.66536 8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13.3346 11C13.3346 12.6547 12.9893 13 11.3346 13H4.66797C3.0133 13 2.66797 12.6547 2.66797 11"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default DownloadSvg
