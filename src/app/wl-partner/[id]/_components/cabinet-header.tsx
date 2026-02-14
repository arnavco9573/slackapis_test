"use client"

import * as React from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { ChevronDown, Search } from "lucide-react"
import Button from "@/components/core/button"

const CATEGORIES = [
    'All',
    'Third Party Audits',
    'Investor Portal Documents',
    'Company Incorporation',
    'Legal Documents',
]

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
                <Button className="px-6 h-[40px] rounded-full">
                    <span className="text-sm font-normal text-white">{selectedCategory}</span>
                    <ChevronDown className={cn("w-4 h-4 text-neutral-400 transition-transform ml-2", isOpen && "rotate-180")} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[220px] p-2 border-0 z-30 flex flex-col gap-1"
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
                            "px-4 py-2 text-sm text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer rounded-lg transition-colors outline-none",
                            selectedCategory === cat && "text-white bg-white/5"
                        )}
                    >
                        {cat}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

interface CabinetHeaderProps {
    onSearch: (query: string) => void
    selectedCategory: string
    onCategoryChange: (category: string) => void
}

const CabinetHeader = ({
    onSearch,
    selectedCategory,
    onCategoryChange
}: CabinetHeaderProps) => {
    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-4">
                    <h2
                        style={{
                            color: "var(--Primary-White, #FFF)",
                            fontSize: "20px",
                            fontStyle: "normal",
                            fontWeight: 500,
                            lineHeight: "24px"
                        }}
                    >
                        Document Cabinet
                    </h2>
                    <CategoryDropdown
                        selectedCategory={selectedCategory}
                        onCategoryChange={onCategoryChange}
                    />
                </div>

                <div
                    className="relative flex items-center px-4 h-[40px] w-[300px]"
                    style={{
                        borderRadius: "90px",
                        border: "0.5px solid var(--System-GR-Neutral-5-01, rgba(255, 255, 255, 0.05))",
                        background: "var(--Neutral-Neutrals-03, rgba(255, 255, 255, 0.03))"
                    }}
                >
                    <Search className="w-4 h-4 text-neutral-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-neutral-500"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default CabinetHeader
