"use client"

import React, { useState } from "react"
import Button from "@/components/core/button"
import { cn } from "@/lib/utils"
import ArrowSvg from "@/components/svg/arrow"
import TabSelector from "@/components/core/tab-selector"

interface ChecklistHeaderProps {
    showTabs?: boolean
    activeTab?: string
    onTabChange?: (tab: string) => void
}

const ChecklistHeader = ({ showTabs, activeTab, onTabChange }: ChecklistHeaderProps) => {
    const [isApproved, setIsApproved] = useState(false)

    const tabs = [
        { id: "USA", label: "USA" },
        { id: "Global", label: "Global" }
    ]

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex items-center justify-between">
                <h3 className="text-(--Primary-White,#FFF) text-[20px] font-medium leading-[24px]">
                    Operational Checklist
                </h3>

                <div className="flex items-center gap-4">
                    {/* Approve Toggle Container */}
                    <div
                        className="relative flex items-center p-1 cursor-pointer w-[150px] h-[38px]"
                        style={{
                            borderRadius: "53px",
                            background: "rgba(255, 255, 255, 0.01)",
                            boxShadow: "6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset",
                            backdropFilter: "blur(10px)"
                        }}
                        onClick={() => setIsApproved(!isApproved)}
                    >
                        {/* Sliding Toggle Button */}
                        <div
                            className={cn(
                                "h-full transition-all duration-300 ease-in-out flex items-center justify-center px-4",
                                isApproved ? "translate-x-[calc(150px-90px-8px)] w-[90px]" : "translate-x-0 w-[80px]"
                            )}
                            style={{
                                borderRadius: "500px",
                                border: "0.5px solid var(--Primary-700, #636363)",
                                background: "var(--System-GR-Neutral-10-01, linear-gradient(0deg, var(--Neutrals-10, rgba(255, 255, 255, 0.10)) -0.21%, var(--Neutrals-01, rgba(255, 255, 255, 0.01)) 105.1%))"
                            }}
                        >
                            <span className="text-[14px] font-medium text-white whitespace-nowrap">
                                {isApproved ? "Approved" : "Approve"}
                            </span>
                        </div>
                    </div>

                    <Button
                        className="flex items-center gap-2 text-sm font-normal py-2 px-4 rounded-full"
                    >
                        Operational Checklist History
                        <ArrowSvg className="size-4 -rotate-45" />
                    </Button>
                </div>
            </div>

            {showTabs && activeTab && onTabChange && (
                <TabSelector
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                    className="mt-[-10px] gap-10"
                />
            )}
        </div>
    )
}

export default ChecklistHeader
