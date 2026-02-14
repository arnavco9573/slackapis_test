"use client"

import React from "react"
import { cn } from "@/lib/utils"
import CommunicationEntryIcon from "@/components/svg/communication-entry-icon"
import BusinessFoundationIcon from "@/components/svg/business-foundation-icon"
import InfrastructureBasicsIcon from "@/components/svg/infrastructure-basics-icon"
import OrientationIcon from "@/components/svg/orientation-icon"
import StrategySelectionIcon from "@/components/svg/strategy-selection-icon"
import PerformanceVerificationIcon from "@/components/svg/performance-verification-icon"
import BrandIdentityIcon from "@/components/svg/brand-identity-icon"
import PlatformSetupIcon from "@/components/svg/platform-setup-icon"
import CapitalDevelopmentIcon from "@/components/svg/capital-development-icon"
import OfferingDocumentsIcon from "@/components/svg/offering-documents-icon"
import InvestorReadinessIcon from "@/components/svg/investor-readiness-icon"

const StrategySteps = [
    { id: "category-1", desc: "Communication Entry", icon: CommunicationEntryIcon },
    { id: "category-2", desc: "Business Foundation", icon: BusinessFoundationIcon },
    { id: "category-3", desc: "Infrastructure Basics", icon: InfrastructureBasicsIcon },
    { id: "category-4", desc: "Orientation", icon: OrientationIcon },
    { id: "category-5", desc: "Strategy Selection", icon: StrategySelectionIcon },
    { id: "category-6", desc: "Performance Verification", icon: PerformanceVerificationIcon },
    { id: "category-7", desc: "Brand Identity", icon: BrandIdentityIcon },
    { id: "category-8", desc: "Platform setup", icon: PlatformSetupIcon },
    { id: "category-9", desc: "Capital Development", icon: CapitalDevelopmentIcon },
    { id: "category-10", desc: "Offering Documents", icon: OfferingDocumentsIcon },
    { id: "category-11", desc: "Investor Readiness", icon: InvestorReadinessIcon },
]

interface CategoryNavigationProps {
    currentCategoryId: string
    onCategoryChange: (id: string) => void
}

const CategoryNavigation = ({ currentCategoryId, onCategoryChange }: CategoryNavigationProps) => {
    return (
        <div className="w-full bg-transparent overflow-hidden">
            <div className="flex overflow-x-auto scroll-smooth p-6 no-scrollbar" style={{ scrollbarWidth: "none" }}>
                <div className="flex gap-5 2xl:gap-25 justify-between">
                    {StrategySteps.map((step) => {
                        const Icon = step.icon
                        const isActive = currentCategoryId === step.id

                        return (
                            <button
                                key={step.id}
                                className={cn(
                                    "flex flex-col justify-center items-center gap-3 cursor-pointer transition-all duration-300",
                                    isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                                )}
                                onClick={() => onCategoryChange(step.id)}
                            >
                                <div
                                    className={cn(
                                        "flex items-center justify-center h-12 w-12 rounded-[12px] transition-all duration-300",
                                        isActive
                                            ? "checklist-category-active text-white"
                                            : "checklist-category-inactive text-neutral-40"
                                    )}
                                    style={isActive ? {
                                        borderRadius: "12px",
                                        border: "0.5px solid var(--Primary-700, #636363)",
                                        background: "var(--nav, linear-gradient(0deg, rgba(255, 255, 255, 0.05) -0.21%, rgba(255, 255, 255, 0.01) 105.1%))"
                                    } : undefined}
                                >
                                    <Icon className="w-5 h-5" />
                                </div>
                                <p
                                    className={cn(
                                        "text-sm font-normal leading-tight transition-colors duration-300 text-center max-w-[120px] whitespace-nowrap",
                                        isActive ? "text-white" : "text-[#888]"
                                    )}
                                >
                                    {step.desc}
                                </p>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default CategoryNavigation
