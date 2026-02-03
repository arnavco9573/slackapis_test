import React from "react";

export default function LogoutNewSvg({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={className}
        >
            <path
                d="M9.66667 0.579179C9.28583 0.527012 8.89628 0.5 8.5 0.5C4.08172 0.5 0.5 3.85786 0.5 8C0.5 12.1421 4.08172 15.5 8.5 15.5C8.89628 15.5 9.28583 15.473 9.66667 15.4208"
                stroke="currentColor"
                strokeLinecap="round"
            />
            <path
                d="M15.5003 8.00033L7.16699 8.00033M15.5003 8.00033C15.5003 7.4168 13.8384 6.3266 13.417 5.91699M15.5003 8.00033C15.5003 8.58385 13.8384 9.67405 13.417 10.0837"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
