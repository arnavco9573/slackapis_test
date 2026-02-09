import React from 'react'

export default function EditMiniSvg({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={className}
        >
            <path
                d="M10.5 1.75C10.7321 1.51794 11.0469 1.3877 11.3751 1.3877C11.7032 1.3877 12.018 1.51794 12.2501 1.75C12.4822 1.98206 12.6124 2.29685 12.6124 2.6251C12.6124 2.95335 12.4822 3.26814 12.2501 3.5002L4.3751 11.3752L1.7501 12.2502L2.6251 9.6252L10.5 1.75Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
