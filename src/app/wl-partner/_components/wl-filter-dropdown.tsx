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
import SortSvg from "@/components/svg/category"
import GradientSeparator from "@/components/core/gradient-separator"
import { SelectInput } from "@/components/core/select-input"

interface WLFilterDropdownProps {
    filters: any
    onFilterChange: (filters: any) => void
}

export function WLFilterDropdown({
    filters,
    onFilterChange,
}: WLFilterDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [localFilters, setLocalFilters] = React.useState(filters)

    React.useEffect(() => {
        setLocalFilters(filters)
    }, [filters])

    const marketTypes = [
        { label: "Global Market", value: "global" },
        { label: "USA Market", value: "usa" },
        { label: "Dual Market", value: "dual" },
    ]

    const progressOptions = [
        { label: "0-25%", value: "0-25" },
        { label: "26-50%", value: "26-50" },
        { label: "51-75%", value: "51-75" },
        { label: "76-99%", value: "76-99" },
        { label: "100%", value: "100" },
    ]

    const approvalStates = [
        { label: "Approved", value: "approved" },
        { label: "In- Progress", value: "in-progress" },
    ]

    const months = [
        { label: "January", value: "1" },
        { label: "February", value: "2" },
        // ... add more if needed
    ]

    const years = [
        { label: "2026", value: "2026" },
        { label: "2025", value: "2025" },
    ]

    const countries = [
        { label: "USA", value: "usa" },
        { label: "UK", value: "uk" },
    ]

    const renderRadioItem = (
        label: string,
        value: string,
        isSelected: boolean,
        onClick: () => void
    ) => (
        <div
            key={value}
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
                {label}
            </span>
        </div>
    )

    const renderCheckboxItem = (
        label: string,
        value: string,
        isSelected: boolean,
        onClick: () => void
    ) => (
        <div
            key={value}
            onClick={onClick}
            className="flex items-center gap-2 cursor-pointer group py-1 min-w-[80px]"
        >
            <div
                className={cn(
                    "w-[16px] h-[16px] flex items-center justify-center transition-all border",
                    isSelected ? "border-(--Primary-500,#9C9C9C)" : "border-(--Primary-700,#636363)"
                )}
                style={{
                    borderRadius: '2.286px',
                    border: '0.286px solid var(--Primary-700, #636363)',
                    background: 'linear-gradient(0deg, var(--Neutrals-10, rgba(255, 255, 255, 0.10)) -0.21%, var(--Neutrals-01, rgba(255, 255, 255, 0.01)) 105.1%)'
                }}
            >
                {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </div>
            <span className={cn(
                "text-sm transition-colors",
                isSelected ? "text-text-highest" : "text-text-high group-hover:text-text-highest"
            )}>
                {label}
            </span>
        </div>
    )

    const handleApply = () => {
        onFilterChange(localFilters)
        setIsOpen(false)
    }

    const handleRemove = () => {
        const resetFilters = {
            marketType: "",
            progress: [],
            approvalStatus: "",
            onboardingMonth: "",
            onboardingYear: "",
            country: "",
        }
        setLocalFilters(resetFilters)
        onFilterChange(resetFilters)
        setIsOpen(false)
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button className="h-10 w-fit justify-between gap-2">
                    Filter
                    <SortSvg className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[360px] p-6 border-0 z-30 flex flex-col gap-6"
                align="end"
                side="bottom"
                sideOffset={8}
                style={{
                    borderRadius: '12px',
                    background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
                    boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                    backdropFilter: 'blur(40px)'
                }}
            >
                <div>
                    <h3 className="text-(--Primary-White,#FFF) text-base font-medium leading-5 mb-4 text-left">Filter</h3>

                    {/* Market Type */}
                    <div className="mb-6">
                        <p className="text-sm text-(--Primary-600,#888) mb-3 text-left">Filter By Market Type</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            {marketTypes.map(market =>
                                renderRadioItem(market.label, market.value, localFilters.marketType === market.value, () => {
                                    setLocalFilters({ ...localFilters, marketType: market.value })
                                })
                            )}
                        </div>
                    </div>

                    {/* Onboarding Progress */}
                    <div className="mb-6">
                        <p className="text-sm text-(--Primary-600,#888) mb-3 text-left">Filter By Onboarding Progress</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {progressOptions.map(option =>
                                renderCheckboxItem(option.label, option.value, localFilters.progress?.includes(option.value), () => {
                                    const newProgress = localFilters.progress?.includes(option.value)
                                        ? localFilters.progress.filter((p: string) => p !== option.value)
                                        : [...(localFilters.progress || []), option.value]
                                    setLocalFilters({ ...localFilters, progress: newProgress })
                                })
                            )}
                        </div>
                    </div>

                    {/* Approval */}
                    <div className="mb-6">
                        <p className="text-sm text-(--Primary-600,#888) mb-3 text-left">Filter By Approval</p>
                        <div className="flex gap-4">
                            {approvalStates.map(state => (
                                <div
                                    key={state.value}
                                    onClick={() => setLocalFilters({ ...localFilters, approvalStatus: state.value })}
                                    className={cn(
                                        "px-4 py-2 cursor-pointer flex items-center justify-center gap-2 flex-1",
                                        localFilters.approvalStatus === state.value ? "text-[#00A3FF]" : "text-text-high"
                                    )}
                                    style={{
                                        borderRadius: '4px',
                                        border: '0.5px solid rgba(255, 255, 255, 0.10)',
                                        background: 'var(--Neutral-Neutrals-03, rgba(255, 255, 255, 0.03))'
                                    }}
                                >
                                    <div className={cn(
                                        "w-[14px] h-[14px] border border-(--Primary-700,#636363) transition-colors",
                                        localFilters.approvalStatus === state.value && "bg-[#00A3FF] border-[#00A3FF]"
                                    )} style={{ borderRadius: '2px' }} />
                                    <span className="text-sm">{state.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Onboarding Month */}
                    <div className="mb-6">
                        <p className="text-sm text-(--Primary-600,#888) mb-3 text-left">Filter By Onboarding Month</p>
                        <div className="flex gap-4">
                            <SelectInput
                                value={localFilters.onboardingMonth}
                                onChange={(val) => setLocalFilters({ ...localFilters, onboardingMonth: val })}
                                options={months}
                                placeholder="January"
                                className="flex-1"
                                triggerClassName="!h-10 !rounded-[4px]"
                            />
                            <SelectInput
                                value={localFilters.onboardingYear}
                                onChange={(val) => setLocalFilters({ ...localFilters, onboardingYear: val })}
                                options={years}
                                placeholder="2026"
                                className="flex-1"
                                triggerClassName="!h-10 !rounded-[4px]"
                            />
                        </div>
                    </div>

                    {/* Country */}
                    <div className="mb-4">
                        <p className="text-sm text-(--Primary-600,#888) mb-3 text-left">Filter Country</p>
                        <SelectInput
                            value={localFilters.country}
                            onChange={(val) => setLocalFilters({ ...localFilters, country: val })}
                            options={countries}
                            placeholder="USA"
                            triggerClassName="!h-10 !rounded-[4px]"
                        />
                    </div>

                    <GradientSeparator />

                    {/* Actions */}
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleRemove}
                            className="flex-1 flex items-center justify-center text-text-high text-sm font-medium hover:text-text-highest transition-colors"
                        >
                            Remove
                        </button>
                        <Button
                            onClick={handleApply}
                            className="flex-1 rounded-full"
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
