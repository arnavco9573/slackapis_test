'use client'

import React, { useState } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isBefore, isAfter, startOfDay } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomCalendarProps {
    selected: Date | null
    onSelect: (date: Date) => void
    minDate?: Date
    maxDate?: Date
    className?: string
}

export default function CustomCalendar({ selected, onSelect, minDate, maxDate, className }: CustomCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-4 px-2">
                <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ChevronLeft size={16} className="text-gray-300" />
                </button>
                <div className="text-white font-medium text-sm">
                    {format(currentMonth, 'MMMM yyyy')}
                </div>
                <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ChevronRight size={16} className="text-gray-300" />
                </button>
            </div>
        )
    }

    const renderDays = () => {
        const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        return (
            <div className="grid grid-cols-7 mb-2">
                {days.map(day => (
                    <div key={day} className="text-center text-xs text-gray-500 font-medium py-1">
                        {day}
                    </div>
                ))}
            </div>
        )
    }

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth)
        const monthEnd = endOfMonth(monthStart)
        const startDate = startOfWeek(monthStart)
        const endDate = endOfWeek(monthEnd)

        const rows = []
        let days = []
        let day = startDate
        let formattedDate = ''

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd')
                const cloneDay = day

                // Disable check
                const isDisabled = (minDate && isBefore(day, startOfDay(minDate))) ||
                    (maxDate && isAfter(day, startOfDay(maxDate)))

                const isSelected = selected && isSameDay(day, selected)
                const isCurrentMonth = isSameMonth(day, monthStart)

                days.push(
                    <div
                        key={day.toString()}
                        className="p-1"
                    >
                        <button
                            onClick={() => !isDisabled && onSelect(cloneDay)}
                            disabled={isDisabled || !isCurrentMonth} // Also disable if not in current month for cleaner look, or just style differently
                            className={cn(
                                "w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all relative",
                                !isCurrentMonth ? "text-gray-700 opacity-0 pointer-events-none" : "text-gray-300",
                                isCurrentMonth && !isDisabled && "hover:bg-white/10",
                                isSelected && "bg-white text-black font-bold hover:bg-white hover:text-black",
                                isDisabled && "text-gray-700 cursor-not-allowed hover:bg-transparent"
                            )}
                        >
                            {formattedDate}
                            {/* Today dot indicator if needed */}
                        </button>
                    </div>
                )
                day = addDays(day, 1)
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            )
            days = []
        }
        return <div>{rows}</div>
    }

    return (
        <div
            className={cn("p-4 w-[280px]", className)}
            style={{
                borderRadius: '8.384px',
                background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
                boxShadow: '4.192px 55.89px 55.89px 0 rgba(255, 255, 255, 0.01) inset, 0 -0.699px 0.699px 0 rgba(255, 255, 255, 0.10) inset, 0 0.699px 0.699px 0 rgba(255, 255, 255, 0.10) inset',
                backdropFilter: 'blur(6.986301422119141px)',
            }}
        >
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    )
}
