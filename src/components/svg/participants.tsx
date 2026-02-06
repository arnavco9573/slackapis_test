import React from 'react'

export default function ParticipantsSvg({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            className={className}
        >
            <path
                d="M5.72656 6.79375C5.66406 6.7875 5.58906 6.7875 5.52031 6.79375C4.03281 6.74375 2.85156 5.525 2.85156 4.025C2.85156 2.49375 4.08906 1.25 5.62656 1.25C7.15781 1.25 8.40156 2.49375 8.40156 4.025C8.39531 5.525 7.21406 6.74375 5.72656 6.79375Z"
                stroke="currentColor"
                strokeWidth="0.9375"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.2531 2.5C11.4656 2.5 12.4406 3.48125 12.4406 4.6875C12.4406 5.86875 11.5031 6.83125 10.3344 6.875C10.2844 6.86875 10.2281 6.86875 10.1719 6.875"
                stroke="currentColor"
                strokeWidth="0.9375"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M2.60313 9.1C1.09062 10.1125 1.09062 11.7625 2.60313 12.7687C4.32188 13.9187 7.14063 13.9187 8.85938 12.7687C10.3719 11.7562 10.3719 10.1063 8.85938 9.1C7.14688 7.95625 4.32813 7.95625 2.60313 9.1Z"
                stroke="currentColor"
                strokeWidth="0.9375"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M11.4609 12.5C11.9109 12.4062 12.3359 12.225 12.6859 11.9562C13.6609 11.225 13.6609 10.0187 12.6859 9.2875C12.3422 9.025 11.9234 8.85 11.4797 8.75"
                stroke="currentColor"
                strokeWidth="0.9375"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
