import React from "react";
import { cn } from "@/lib/utils";

const SortByIconSvg = ({ className }: { className?: string }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={cn("text-current", className)}>
            <path d="M2.5 5.83203H17.5" stroke="currentColor" strokeLinecap="round" />
            <path d="M5 10H15" stroke="currentColor" strokeLinecap="round" />
            <path d="M8.33594 14.168H11.6693" stroke="currentColor" strokeLinecap="round" />
        </svg>
    );
};

export default SortByIconSvg;
