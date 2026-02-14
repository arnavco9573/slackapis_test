"use client"
import * as React from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import Button from "@/components/core/button"

const CATEGORIES = [
    'All',
    'AUM',
    'Performance Fees',
    'Management Fees',
    'Investors',
];

interface CategoryDropdownProps {
    selectedCategory: string
    onCategoryChange: (category: string) => void
}

export function CategoryDropdown({
    selectedCategory,
    onCategoryChange,
}: CategoryDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button className="px-6"
                >
                    <span className="text-sm font-normal">{selectedCategory}</span>
                    <ChevronDown className={cn("w-4 h-4 text-neutral-40 transition-transform", isOpen && "rotate-180")} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[220px] p-2 border-0 z-30 flex flex-col gap-4"
                align="start"
                sideOffset={8}
                style={{
                    borderRadius: '12px',
                    background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
                    boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                    backdropFilter: 'blur(10px)'
                }}
            >
                {CATEGORIES.map((cat) => (
                    <DropdownMenuItem
                        key={cat}
                        onClick={() => {
                            onCategoryChange(cat)
                            setIsOpen(false)
                        }}
                        className={cn(
                            "px-4 py-1 text-sm text-text-high hover:text-white hover:bg-white/5 cursor-pointer rounded-full transition-colors outline-none",
                            selectedCategory === cat && "text-white rounded-full bg-white/5"
                        )}
                    >
                        {cat}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
