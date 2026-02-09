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
import ChevronDown from "@/components/svg/chevron-down"

interface Category {
    documentId: string
    name: string
    slug: string
}

interface CategoryDropdownProps {
    categories: Category[]
    selectedCategoryName: string
    selectedCategorySlug: string
    onSelectCategory: (slug: string) => void
}

export function CategoryDropdown({
    categories,
    selectedCategoryName,
    selectedCategorySlug,
    onSelectCategory,
}: CategoryDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    const handleSelect = (slug: string) => {
        onSelectCategory(slug)
        setIsOpen(false)
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    className="w-fit justify-between gap-2"
                >
                    {selectedCategoryName}
                    <ChevronDown className="size-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-fit p-2 border-0 z-39"
                align="start"
                sideOffset={8}
                style={{
                    borderRadius: '12px',
                    background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
                    boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <DropdownMenuItem
                    onClick={() => handleSelect('all')}
                    className={cn(
                        "cursor-pointer px-4 py-2.5 mb-1 text-sm text-text-mid outline-none transition-all",
                        "focus:text-text-high focus:rounded-[500px] focus:border-[0.5px] focus:border-[#636363] focus:[background:linear-gradient(0deg,rgba(255,255,255,0.10)_-0.21%,rgba(255,255,255,0.00)_105.1%)]",
                        "hover:text-text-high hover:rounded-[500px] hover:[background:linear-gradient(0deg,rgba(255,255,255,0.10)_-0.21%,rgba(255,255,255,0.00)_105.1%)]",
                        selectedCategorySlug === 'all' && "text-text-high"
                    )}
                    style={selectedCategorySlug === 'all' ? {
                        borderRadius: '500px',
                        border: '0.5px solid var(--Primary-700, #636363)',
                        background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.10) -0.21%, rgba(255, 255, 255, 0.00) 105.1%)'
                    } : {}}
                >
                    All
                </DropdownMenuItem>

                {categories.map((category) => (
                    <DropdownMenuItem
                        key={category.documentId}
                        onClick={() => handleSelect(category.slug)}
                        className={cn(
                            "cursor-pointer px-4 py-2.5 mb-1 text-sm text-text-highest outline-none transition-all",
                            "focus:text-text-high focus:rounded-[500px] focus:border-[0.5px] focus:border-[#636363] focus:[background:linear-gradient(0deg,rgba(255,255,255,0.10)_-0.21%,rgba(255,255,255,0.00)_105.1%)]",
                            "hover:text-text-high hover:rounded-[500px] hover:[background:linear-gradient(0deg,rgba(255,255,255,0.10)_-0.21%,rgba(255,255,255,0.00)_105.1%)]",
                            selectedCategorySlug === category.slug && "text-text-high"
                        )}
                        style={selectedCategorySlug === category.slug ? {
                            borderRadius: '500px',
                            border: '0.5px solid var(--Primary-700, #636363)',
                            background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.10) -0.21%, rgba(255, 255, 255, 0.00) 105.1%)'
                        } : {}}
                    >
                        {category.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
