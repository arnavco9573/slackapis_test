"use client"

import * as React from "react"
import Button from "@/components/core/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import FilterSvg from "@/components/svg/filter"

interface WLSortDropdownProps {
    sortOrder: string
    onSortChange: (sort: string) => void
}

const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "Recently Updated", value: "recently_updated" },
]

export function WLSortDropdown({
    sortOrder,
    onSortChange,
}: WLSortDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    const renderOption = (
        option: { label: string, value: string },
        isSelected: boolean,
        onClick: () => void
    ) => (
        <div
            key={option.value}
            onClick={onClick}
            className="flex items-center gap-3 cursor-pointer group py-1"
        >
            <div
                className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center transition-all border",
                    isSelected
                        ? "border-(--Primary-500,#9C9C9C)"
                        : "border-(--Primary-700,#636363) group-hover:border-text-high"
                )}
                style={{ borderRadius: '90px' }}
            >
                {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
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

                    <FilterSvg className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[200px] p-4 border-0 z-50 flex flex-col gap-4"
                align="end"
                side="bottom"
                sideOffset={8}
                style={{
                    borderRadius: '12px',
                    background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
                    boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <div>
                    <p className="text-sm text-(--Primary-600,#888) mb-3 uppercase">General sorting</p>
                    <div className="flex flex-col gap-2">
                        {sortOptions.map(option =>
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
