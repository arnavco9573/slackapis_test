'use client';

import * as React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChevronDown from "@/components/svg/chevron-down";
import { cn } from "@/lib/utils";

interface StatusSelectProps {
    status: string;
    onStatusChange?: (status: string) => void;
    className?: string;
}

const statusOptions = [
    { label: 'To-Do', value: 'todo' },
    { label: 'Completed', value: 'completed' },
];

export default function StatusSelect({ status, onStatusChange, className }: StatusSelectProps) {
    const currentStatus = statusOptions.find(s => s.value === status) || statusOptions[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "flex items-center gap-12 px-4 py-4 text-sm font-medium transition-all focus:outline-none",
                        className
                    )}
                    style={{
                        borderRadius: "8px",
                        border: "0.5px solid var(--System-GR-Neutral-5-01, rgba(255, 255, 255, 0.05))",
                        background: "var(--Neutral-Neutrals-03, rgba(255, 255, 255, 0.03))",
                        color: status === 'completed' ? "var(--system-positive)" : "#C39C5F"
                    }}
                >
                    {currentStatus.label}
                    <ChevronDown className="size-3 opacity-70 text-white" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-40 z-30 section-border p-1 border border-(--Primary-700)"
                align="end"
                sideOffset={8}
                style={{
                    borderRadius: '12px',
                    background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
                    boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                    backdropFilter: 'blur(10px)',
                }}
            >
                {statusOptions.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => onStatusChange?.(option.value)}
                        className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer",
                            status === option.value ? "bg-neutral-03 hover:bg-neutral-05" : "hover:bg-neutral-05"
                        )}
                        style={{
                            color: option.value === 'completed' ? "var(--system-positive)" : "#C39C5F"
                        }}
                    >
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
