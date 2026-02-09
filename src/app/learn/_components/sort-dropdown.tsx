"use client"

import * as React from "react"
import Button from "@/components/core/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
// import ChevronDown from "@/components/svg/chevron-down" // User might want SortSvg icon instead or alongside
import SortSvg from '@/components/svg/category' // Using the newly created SortSvg (CategorySvg renamed)

interface SortDropdownProps {
    sortOrder: string
    onSortChange: (sort: string) => void
}

const generalSortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "Recently Updated", value: "recently_updated" },
    // { label: "Read", value: "recently_read" },
]

export function SortDropdown({
    sortOrder,
    onSortChange,
}: SortDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    const renderOption = (
        option: { label: string, value: string },
        isSelected: boolean,
        onClick: () => void
    ) => (
        <div
            key={option.value}
            onClick={onClick}
            className="flex items-center gap-3 cursor-pointer group"
        >
            {/* Radio Button */}
            <div
                className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                    isSelected
                        ? "border border-[var(--Primary-500,#9C9C9C)]"
                        : "border border-[var(--Primary-700,#636363)] group-hover:border-text-high"
                )}
                style={{ borderRadius: '90px' }}
            >
                {isSelected && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <circle cx="4" cy="4" r="4" fill="white" />
                    </svg>
                )}
            </div>
            <span className={cn(
                "text-sm transition-colors",
                isSelected ? "text-text-highest" : "text-text-high group-hover:text-text-highest"
            )}>
                {option.label}
            </span>
        </div>
    )

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button className="h-10 w-fit justify-between gap-2">
                    Sort by
                    <SortSvg className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[200px] p-4 border-0 z-50"
                align="end"
                sideOffset={8}
                style={{
                    borderRadius: '12px',
                    background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
                    boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <div className="mb-0">
                    <p className="text-sm text-text-mid mb-3">General sorting</p>
                    <div className="flex flex-col gap-3">
                        {generalSortOptions.map(option =>
                            renderOption(option, sortOrder === option.value, () => {
                                onSortChange(option.value)
                                setIsOpen(false)
                            })
                        )}
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
