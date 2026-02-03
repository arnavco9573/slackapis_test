'use client'

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type ViewType = 'Daily' | 'Weekly' | 'Monthly'

interface ViewSelectorProps {
    selected: ViewType
    onSelect: (view: ViewType) => void
}

export default function ViewSelector({ selected, onSelect }: ViewSelectorProps) {
    const [open, setOpen] = useState(false)
    const views: ViewType[] = ['Daily', 'Weekly', 'Monthly']

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] border border-[#333] rounded-full text-white text-sm font-medium hover:border-gray-500 transition-colors">
                    {selected}
                    <ChevronDown size={14} className="text-gray-500" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="p-2 w-[140px] border-0"
                style={{
                    borderRadius: '8.384px',
                    background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
                    boxShadow: '4.192px 55.89px 55.89px 0 rgba(255, 255, 255, 0.01) inset, 0 -0.699px 0.699px 0 rgba(255, 255, 255, 0.10) inset, 0 0.699px 0.699px 0 rgba(255, 255, 255, 0.10) inset',
                    backdropFilter: 'blur(6.986301422119141px)',
                }}
            >
                <div className="flex flex-col gap-1">
                    {views.map(view => {
                        const isSelected = selected === view
                        return (
                            <button
                                key={view}
                                onClick={() => {
                                    onSelect(view)
                                    setOpen(false)
                                }}
                                className={cn(
                                    "w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between",
                                    isSelected
                                        ? "bg-white text-black font-medium"
                                        : "text-gray-300 hover:bg-white/10"
                                )}
                            >
                                <span>{view}</span>
                                {isSelected && <Check size={14} />}
                            </button>
                        )
                    })}
                </div>
            </PopoverContent>
        </Popover>
    )
}
