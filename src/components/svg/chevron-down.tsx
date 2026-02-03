import React from "react";
import { cn } from "@/lib/utils";

const ChevronDown = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="7"
            viewBox="0 0 13 7"
            fill="none"
            className={cn(className)}
        >
            <path
                d="M0.5 0.5L5.79289 5.79289C6.12623 6.12623 6.29289 6.29289 6.5 6.29289C6.70711 6.29289 6.87377 6.12623 7.20711 5.79289L12.5 0.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default ChevronDown;
