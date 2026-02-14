"use client"

import React from "react"
import Button from "@/components/core/button"
import TabSelector from "@/components/core/tab-selector"
import { CategoryDropdown } from "./category-dropdown"
import ArrowSvg from "@/components/svg/arrow"

interface CertificateHeaderProps {
    showTabs: boolean
    activeTab: string
    onTabChange: (tab: string) => void
    selectedCategory: string
    onCategoryChange: (category: string) => void
    onAssignClick: () => void
}

export default function CertificateHeader({
    showTabs,
    activeTab,
    onTabChange,
    selectedCategory,
    onCategoryChange,
    onAssignClick
}: CertificateHeaderProps) {
    const tabs = [
        { id: "USA", label: "USA" },
        { id: "Global", label: "Global" }
    ]

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-6">
                        <h3
                            className="text-white"
                            style={{
                                fontSize: "20px",
                                fontWeight: 500,
                                lineHeight: "24px"
                            }}
                        >
                            Certificate
                        </h3>
                        {showTabs && (
                            <TabSelector
                                tabs={tabs}
                                activeTab={activeTab}
                                onTabChange={onTabChange}
                            />
                        )}
                    </div>

                    <div className="flex ">
                        <CategoryDropdown
                            selectedCategory={selectedCategory}
                            onCategoryChange={onCategoryChange}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">

                    <Button
                        className="flex items-center gap-2 text-sm font-normal py-2 px-4 rounded-full bg-transparent hover:bg-white/5 text-neutral-40"
                        onClick={onAssignClick}
                    >
                        Assign Certificate
                        <ArrowSvg className="size-4 -rotate-45" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
