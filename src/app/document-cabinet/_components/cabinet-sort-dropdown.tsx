"use client"

import * as React from "react"
import Button from "@/components/core/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import SortSvg from '@/components/svg/category'

interface CabinetSortDropdownProps {
    sortOrder: string
    onSortChange: (sort: string) => void
}

const sortOptions = [
    { label: "A to Z", value: "a_to_z" },
    { label: "Z to A", value: "z_to_a" },
    { label: "Newest To Oldest", value: "newest_to_oldest" },
    { label: "Oldest To Newest", value: "oldest_to_newest" },
]

export default function CabinetSortDropdown({
    sortOrder,
    onSortChange,
}: CabinetSortDropdownProps) {
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
            <div
                className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                    isSelected
                        ? "border border-(--Primary-500,#9C9C9C)"
                        : "border border-(--Primary-700,#636363) group-hover:border-text-high"
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
                isSelected ? "text-white" : "text-white/60 group-hover:text-white"
            )}>
                {option.label}
            </span>
        </div>
    )

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button className="w-fit justify-between gap-2 rounded-full border px-6! text-white ">
                    Sort by
                    <SortSvg className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[200px] p-6 border-none z-50 bg-neutral-01 backdrop-blur-2xl"
                align="end"
                sideOffset={8}
                style={{
                    borderRadius: '16px',
                }}
            >
                <div className="flex flex-col gap-5">
                    {sortOptions.map(option =>
                        renderOption(option, sortOrder === option.value, () => {
                            onSortChange(option.value)
                            setIsOpen(false)
                        })
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
