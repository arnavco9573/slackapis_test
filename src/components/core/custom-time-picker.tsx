'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface CustomTimePickerProps {
    selected: number | null
    onSelect: (hour: number) => void
    availableHours: number[]
    className?: string
}

export default function CustomTimePicker({ selected, onSelect, availableHours, className }: CustomTimePickerProps) {

    const formatHour = (h: number) => {
        return `${h > 12 ? h - 12 : h} ${h >= 12 ? 'PM' : 'AM'}`
    }

    return (
        <div
            className={cn("p-2 w-[140px] max-h-[200px] overflow-y-auto flex flex-col gap-1", className)}
            style={{
                borderRadius: '8.384px',
                background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
                boxShadow: '4.192px 55.89px 55.89px 0 rgba(255, 255, 255, 0.01) inset, 0 -0.699px 0.699px 0 rgba(255, 255, 255, 0.10) inset, 0 0.699px 0.699px 0 rgba(255, 255, 255, 0.10) inset',
                backdropFilter: 'blur(6.986301422119141px)',
            }}
        >
            {availableHours.map(hour => {
                const isSelected = selected === hour
                return (
                    <button
                        key={hour}
                        onClick={() => onSelect(hour)}
                        className={cn(
                            "w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between",
                            isSelected
                                ? "bg-white text-black font-medium"
                                : "text-gray-300 hover:bg-white/10"
                        )}
                    >
                        <span>{formatHour(hour)}</span>
                        {isSelected && <Check size={14} />}
                    </button>
                )
            })}
        </div>
    )
}
