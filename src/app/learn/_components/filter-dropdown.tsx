"use client"

import * as React from "react"
import Button from "@/components/core/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import ChevronDown from "@/components/svg/chevron-down"

interface FilterDropdownProps {
    contentType: string
    onContentTypeChange: (type: string) => void
    marketType: string
    onMarketTypeChange: (market: string) => void
}

const contentTypes = ["ALL", "ARTICLE", "VIDEO"]
const marketTypes = ["ALL", "GLOBAL", "USA"]

export function FilterDropdown({
    contentType,
    onContentTypeChange,
    marketType,
    onMarketTypeChange,
}: FilterDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    const renderRadioItem = (
        label: string,
        isSelected: boolean,
        onClick: () => void
    ) => (
        <div
            key={label}
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
                "text-sm transition-colors uppercase",
                isSelected ? "text-text-highest" : "text-text-high group-hover:text-text-highest"
            )}>
                {label}
            </span>
        </div>
    )

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button className="h-10 w-fit justify-between gap-2">
                    Filter
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[212px] p-4 border-0 z-50 flex flex-col gap-4"
                align="end"
                sideOffset={8}
                style={{
                    borderRadius: '12px',
                    background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
                    boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <div>
                    <p className="text-sm text-(--Primary-600,#888) font-normal leading-[18px] mb-3">
                        Filter by content type
                    </p>
                    <div className="flex flex-col gap-2">
                        {contentTypes.map(type =>
                            renderRadioItem(type, contentType === type, () => {
                                onContentTypeChange(type)
                                // setIsOpen(false) // Optionally keep open for multiple filters
                            })
                        )}
                    </div>
                </div>

                <div>
                    <p className="text-sm text-(--Primary-600,#888) font-normal leading-[18px] mb-3">
                        Filter by Market
                    </p>
                    <div className="flex flex-col gap-2">
                        {marketTypes.map(market =>
                            renderRadioItem(market, marketType === market, () => {
                                onMarketTypeChange(market)
                                // setIsOpen(false)
                            })
                        )}
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
