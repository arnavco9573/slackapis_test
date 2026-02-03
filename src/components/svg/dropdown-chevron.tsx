import { cn } from "@/lib/utils";
import React from "react";

export default function DropdownChevronSvg({
    className,
}: {
    className?: string;
}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="6"
            viewBox="0 0 11 6"
            fill="none"
            className={cn("w-[11px] h-[6px]", className)}
        >
            <path
                d="M0.5 0.5L4.79289 4.79289C5.12623 5.12623 5.29289 5.29289 5.5 5.29289C5.70711 5.29289 5.87377 5.12623 6.20711 4.79289L10.5 0.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
