"use client"

import * as React from "react"
import Button from "@/components/core/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import CustomCalendar from "@/components/core/custom-calendar"
import FilterSvg from "@/components/svg/filter"
import GradientSeparator from "@/components/core/gradient-separator"

export default function CabinetFilterDropdown() {
    const [date, setDate] = React.useState<Date | null>(null)

    const categories = [
        "Third Party Audit",
        "Company Incorporation",
        "Legal Documents",
        "Investor Portal Document"
    ]

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="w-fit justify-between gap-2 rounded-full border px-6! text-white">
                    Filter
                    <FilterSvg className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[420px] p-6 border-none z-50 bg-neutral-01 backdrop-blur-2xl flex flex-col gap-6"
                align="end"
                sideOffset={8}
                style={{
                    borderRadius: '16px',
                }}
            >
                <div>
                    <h3 className="text-white text-[16px] font-medium leading-[24px] mb-4">Filter</h3>

                    <div className="flex flex-col gap-6">
                        {/* Market Type */}
                        <div>
                            <p className="text-white/40 text-[14px] font-normal mb-4">Market Type</p>
                            <RadioGroup defaultValue="global" className="flex items-center gap-8">
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="global" id="global" className="border-white/20 data-[state=checked]:border-white text-white!" />
                                    <Label htmlFor="global" className="text-white text-sm font-normal">Global Market</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="usa" id="usa" className="border-white/20 data-[state=checked]:border-white text-white!" />
                                    <Label htmlFor="usa" className="text-white text-sm font-normal">USA Market</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="dual" id="dual" className="border-white/20 data-[state=checked]:border-white text-white!" />
                                    <Label htmlFor="dual" className="text-white text-sm font-normal">Dual Market</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Category */}
                        <div>
                            <p className="text-white/40 text-[14px] font-normal mb-4">Category</p>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                {categories.map((cat) => (
                                    <div key={cat} className="flex items-center gap-2">
                                        <Checkbox id={cat} className="border-white/20 rounded-[4px] data-[state=checked]:bg-transparent! data-[state=checked]:text-white!" />
                                        <Label htmlFor={cat} className="text-white text-sm font-normal">{cat}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <GradientSeparator />

                        {/* Date Filter */}
                        <div>
                            <p className="text-white/40 text-[14px]  font-normal mb-4">Filter by date</p>
                            <CustomCalendar
                                selected={date}
                                onSelect={(d) => setDate(d)}
                                className="w-full bg-transparent border-none p-4 backdrop-blur-none shadow-none"
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
