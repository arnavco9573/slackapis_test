'use client'

import React, { useState, useMemo } from 'react'
import { format, addDays, subDays, addMonths, subMonths, isSameDay, isSameMonth, parseISO, getHours, getMinutes, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import { ChevronLeft, ChevronRight, Search, ChevronDown } from 'lucide-react'
import ViewSelector from './ViewSelector'

// Types
type ViewType = 'Daily' | 'Weekly' | 'Monthly'

interface TeamMember {
    id: string
    name: string
    workspace_email: string
    color: string | null
}

interface CalendarEvent {
    id: string
    title: string
    start: Date
    end: Date
    source: 'google' | 'platform'
    color: string
    memberId?: string
    status?: string
}

interface CalendarViewProps {
    teamMembers: TeamMember[]
    selectedMemberIds: string[]
    events: CalendarEvent[]
    highlightedSlots?: any[]
    onSlotClick?: (date: string) => void
    onReconnect?: () => void
    isSessionExpired?: boolean
}

export default function CalendarView({
    teamMembers,
    selectedMemberIds,
    events,
    highlightedSlots = [],
    onSlotClick,
    onReconnect,
    isSessionExpired
}: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [view, setView] = useState<ViewType>('Weekly')

    // Auto-navigate to highlighted slot
    React.useEffect(() => {
        if (highlightedSlots && highlightedSlots.length > 0) {
            const firstSlot = highlightedSlots[0]
            if (firstSlot.requested_start_time) {
                setCurrentDate(new Date(firstSlot.requested_start_time))
            }
        }
    }, [highlightedSlots])

    // Generate days based on view
    const displayDays = useMemo(() => {
        if (view === 'Daily') return [currentDate]
        if (view === 'Weekly') return Array.from({ length: 7 }).map((_, i) => addDays(currentDate, i))
        // Monthly: get all days in the month grid (including padding from prev/next month)
        const monthStart = startOfMonth(currentDate)
        const monthEnd = endOfMonth(currentDate)
        const calendarStart = startOfWeek(monthStart)
        const calendarEnd = endOfWeek(monthEnd)
        return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    }, [currentDate, view])

    // Time slots (1 AM to 11 PM)
    const hours = Array.from({ length: 23 }).map((_, i) => 1 + i) // 1 to 23

    // Navigation handlers
    const handlePrev = () => {
        if (view === 'Monthly') {
            setCurrentDate(subMonths(currentDate, 1))
        } else {
            // Both Daily and Weekly move by day
            setCurrentDate(subDays(currentDate, 1))
        }
    }

    const handleNext = () => {
        if (view === 'Monthly') {
            setCurrentDate(addMonths(currentDate, 1))
        } else {
            // Both Daily and Weekly move by day
            setCurrentDate(addDays(currentDate, 1))
        }
    }

    // Filter events by selected members
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            if (!event.memberId) return false
            return selectedMemberIds.includes(event.memberId)
        })
    }, [events, selectedMemberIds])

    const getEventsForDay = (day: Date) => {
        return filteredEvents.filter(e => isSameDay(e.start, day))
    }

    const getHighlightedSlotsForDay = (day: Date) => {
        return highlightedSlots.filter(s => isSameDay(new Date(s.requested_start_time), day))
    }

    return (
        <div className="flex flex-col h-full w-full p-4 font-sans text-gray-300 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                {/* Left: View Selector & Navigation */}
                <div className="flex items-center gap-4">
                    <ViewSelector selected={view} onSelect={setView} />

                    {/* Day/Week Navigation Arrows (for Daily & Weekly views) */}
                    {view !== 'Monthly' && (
                        <div className="flex items-center gap-1">
                            <button onClick={handlePrev} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors border border-transparent hover:border-[#333]">
                                <ChevronLeft size={18} />
                            </button>
                            <button onClick={handleNext} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors border border-transparent hover:border-[#333]">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* Session Expired Warning */}
                    {isSessionExpired && onReconnect && (
                        <button
                            onClick={onReconnect}
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/50 rounded-full text-red-500 text-xs font-medium hover:bg-red-500/20 transition-colors animate-pulse"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            Reconnect Google Calendar
                        </button>
                    )}
                </div>

                {/* Center: Search */}
                <div className="relative w-[400px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-[#1C1C1C] border border-transparent rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#333] transition-all"
                    />
                </div>

                {/* Right: Month Display with Navigation (for Monthly view) */}
                {view === 'Monthly' ? (
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrev} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                            <ChevronLeft size={20} className="text-white" />
                        </button>
                        <div className="px-4 py-2 bg-[#1C1C1C] border border-[#333] rounded-full text-white text-sm font-medium min-w-[140px] text-center">
                            {format(currentDate, 'MMMM yyyy')}
                        </div>
                        <button onClick={handleNext} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                            <ChevronRight size={20} className="text-white" />
                        </button>
                    </div>
                ) : (
                    <div className="px-4 py-2 bg-[#1C1C1C] border border-[#333] rounded-full text-white text-sm font-medium min-w-[140px] text-center">
                        {format(currentDate, 'MMMM yyyy')}
                    </div>
                )}
            </div>

            {/* Calendar Container */}
            {view === 'Monthly' ? (
                <MonthlyView
                    displayDays={displayDays}
                    currentDate={currentDate}
                    getEventsForDay={getEventsForDay}
                />
            ) : (
                <TimeGridView
                    displayDays={displayDays}
                    hours={hours}
                    getEventsForDay={getEventsForDay}
                    view={view}
                    highlightedSlots={highlightedSlots}
                    getHighlightedSlotsForDay={getHighlightedSlotsForDay}
                    onSlotClick={onSlotClick}
                />
            )}
        </div>
    )
}

// Helper to convert hex to rgba
const hexToRgba = (hex: string, alpha: number) => {
    let r = 0, g = 0, b = 0;
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    }
    return `rgba(${r},${g},${b},${alpha})`;
}

// Time Grid View (Daily & Weekly)
function TimeGridView({ displayDays, hours, getEventsForDay, view, highlightedSlots, getHighlightedSlotsForDay, onSlotClick }: any) {
    return (
        <div className="flex-1 overflow-hidden bg-neutral-01 section-border rounded-xl flex flex-col relative w-full">
            {/* Days Header (Sticky) */}
            <div className={`grid ${view === 'Daily' ? 'grid-cols-[60px_1fr]' : 'grid-cols-[60px_1fr]'} border-b border-[#222] bg-neutral-01 z-20`}>
                <div className="py-4 border-r border-[#222] flex flex-col items-center justify-end pb-2">
                    <span className="text-[10px] text-(--Primary-600) font-medium mt-auto">GMT+5:30</span>
                </div>
                <div className={`grid ${view === 'Daily' ? 'grid-cols-1' : 'grid-cols-7'}`}>
                    {displayDays.map((day: Date, i: number) => {
                        const isToday = isSameDay(day, new Date())
                        return (
                            <div key={i} className="py-4 flex flex-col items-center justify-center border-r border-[#222] last:border-r-0 relative">
                                <span className="text-[11px] font-medium text-gray-400 uppercase mb-1">{format(day, 'EEE')}</span>
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full text-xl font-normal transition-colors ${isToday ? 'bg-[#8888883D] text-white' : 'text-gray-300'}`}>
                                    {format(day, 'd')}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Scrollable Grid Area */}
            <div className="flex-1 overflow-y-auto w-full relative" style={{ scrollbarWidth: "none" }}>
                <div className={`grid ${view === 'Daily' ? 'grid-cols-[60px_1fr]' : 'grid-cols-[60px_1fr]'} min-h-[920px] pt-6 bg-neutral-01`}>
                    {/* Time Slots Sidebar */}
                    <div className="border-r border-[#222]">
                        {hours.map((hour: number) => (
                            <div key={hour} className="h-10 relative">
                                <span className="absolute -top-2 right-3 text-xs text-text-highest font-medium whitespace-nowrap">
                                    {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Main Grid */}
                    <div className={`grid ${view === 'Daily' ? 'grid-cols-1' : 'grid-cols-7'} relative`}>
                        {/* Horizontal Lines */}
                        {hours.map((hour: number) => (
                            <div key={hour} className="absolute w-full border-t border-[#222]" style={{ top: `${(hour - 1) * 2.5}rem`, height: '2.5rem' }} />
                        ))}

                        {/* Vertical Lines */}
                        {displayDays.map((_: any, i: number) => (
                            <div key={i} className="absolute h-full border-r border-[#222] pointer-events-none" style={{ left: `${(i + 1) * (100 / displayDays.length)}%` }} />
                        ))}

                        {/* Current Time Indicator */}
                        {(() => {
                            const now = new Date()
                            const currentHour = now.getHours()
                            const currentMinute = now.getMinutes()

                            if (currentHour < 1 || currentHour > 23) return null

                            const topPosition = ((currentHour - 1) * 2.5) + (currentMinute / 60 * 2.5)

                            return (
                                <div
                                    className="absolute w-full pointer-events-none z-30"
                                    style={{ top: `${topPosition}rem` }}
                                >
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
                                        <div className="flex-1 h-[2px] bg-red-500" />
                                    </div>
                                </div>
                            )
                        })()}

                        {/* Highlighted Slots */}
                        {highlightedSlots && displayDays.map((day: Date, dayIdx: number) => (
                            <div key={`slots-${dayIdx}`} className="relative h-full" style={{ gridColumn: dayIdx + 1, gridRow: '1 / span 1' }}>
                                {getHighlightedSlotsForDay(day).map((slot: any, sIdx: number) => {
                                    const start = new Date(slot.requested_start_time)
                                    const startHour = getHours(start)
                                    const startMinute = getMinutes(start)
                                    // Default duration 60 mins to match "12 PM - 1 PM" example
                                    const end = new Date(start.getTime() + 60 * 60000)
                                    // const endHour = getHours(end)
                                    // const endMinute = getMinutes(end)

                                    const topPosition = ((startHour - 1) * 2.5) + (startMinute / 60 * 2.5)
                                    const durationMinutes = 60
                                    const heightRem = (durationMinutes / 60) * 2.5

                                    return (
                                        <div
                                            key={slot.id || sIdx}
                                            className="absolute w-[95%] left-[2.5%] z-25 cursor-pointer transition-all group hover:brightness-110"
                                            style={{
                                                top: `${topPosition}rem`,
                                                height: `${heightRem}rem`,
                                                borderRadius: '3px',
                                                border: '0.7px solid var(--Neutrals-30, rgba(255, 255, 255, 0.30))',
                                                background: 'rgba(255, 255, 255, 0.06)',
                                                boxShadow: '0 0 4px 0 rgba(255, 255, 255, 0.25)'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onSlotClick?.(slot.requested_start_time)
                                            }}
                                        >
                                            <div className="h-full w-full p-2 flex flex-col justify-between">
                                                <span className="text-white text-xs font-normal">Check availability</span>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-white text-[10px] font-mono">
                                                        {format(start, 'h a')} - {format(end, 'h a')}
                                                    </span>
                                                    <ChevronDown size={14} className="text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}

                        {/* Events */}
                        {displayDays.map((day: Date, dayIdx: number) => (
                            <div key={dayIdx} className="relative h-full" style={{ gridColumn: dayIdx + 1, gridRow: '1 / span 1' }}>
                                {getEventsForDay(day).map((evt: any, eIdx: number) => {
                                    const startHour = getHours(evt.start)
                                    const startMinute = getMinutes(evt.start)
                                    const endHour = getHours(evt.end)
                                    const endMinute = getMinutes(evt.end)

                                    const topPosition = ((startHour - 1) * 2.5) + (startMinute / 60 * 2.5)
                                    const durationMinutes = (endHour - startHour) * 60 + (endMinute - startMinute)
                                    const heightRem = (durationMinutes / 60) * 2.5

                                    return (
                                        <div
                                            key={evt.id + eIdx}
                                            className={`absolute w-full z-20 pointer-events-none`}
                                            style={{
                                                top: `${topPosition}rem`,
                                                height: `${heightRem}rem`
                                            }}
                                        >
                                            <div
                                                className={`h-full text-[10px] p-2 rounded shadow-sm ${evt.source === 'google' ? '' : 'text-white'}`}
                                                style={{
                                                    backgroundColor: evt.source === 'google' ? hexToRgba(evt.color, 0.2) : undefined,
                                                    color: evt.source === 'google' ? evt.color : undefined
                                                }}
                                            >
                                                <span className="font-bold block truncate text-xs mb-0.5">{evt.title}</span>
                                                <span className="opacity-70">{format(evt.start, 'h:mm a')} - {format(evt.end, 'h:mm a')}</span>
                                            </div>
                                        </div>
                                    )
                                }).filter(Boolean)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Monthly View (Google Calendar Style)
function MonthlyView({ displayDays, currentDate, getEventsForDay }: any) {
    // Split days into weeks
    const weeks: Date[][] = []
    for (let i = 0; i < displayDays.length; i += 7) {
        weeks.push(displayDays.slice(i, i + 7))
    }

    return (
        <div className="flex-1 overflow-hidden bg-neutral-01 section-border rounded-xl flex flex-col">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-[#222] bg-neutral-01">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-3 text-center text-xs font-medium text-gray-400 uppercase border-r border-[#222] last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid - No scroll, equal height rows */}
            <div className="flex-1 flex flex-col">
                {weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="grid grid-cols-7 border-b border-[#222] last:border-b-0 flex-1">
                        {week.map((day, dayIdx) => {
                            const isToday = isSameDay(day, new Date())
                            const isCurrentMonth = isSameMonth(day, currentDate)
                            const events = getEventsForDay(day)
                            const visibleEvents = events.slice(0, 2) // Reduced to 2 events
                            const moreCount = events.length - 2

                            return (
                                <div
                                    key={dayIdx}
                                    className={`border-r border-[#222] last:border-r-0 p-2 flex flex-col ${!isCurrentMonth ? 'bg-neutral-01' : 'bg-neutral-01'}`}
                                >
                                    {/* Day Number */}
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-sm font-medium ${isToday ? 'bg-neutral-03 text-white w-6 h-6 rounded-full flex items-center justify-center' : isCurrentMonth ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {format(day, 'd')}
                                        </span>
                                    </div>

                                    {/* Events */}
                                    <div className="space-y-1 flex-1 overflow-hidden">
                                        {visibleEvents.map((evt: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className={`text-[10px] px-2 py-1 rounded truncate ${evt.source === 'google' ? '' : 'bg-white/10 text-gray-300'}`}
                                                style={evt.source === 'google' ? {
                                                    backgroundColor: hexToRgba(evt.color, 0.2),
                                                    color: evt.color,
                                                } : undefined}
                                            >
                                                <span className="font-medium">{format(evt.start, 'h:mm a')}</span> {evt.title}
                                            </div>
                                        ))}
                                        {moreCount > 0 && (
                                            <div className="text-[10px] text-gray-500 px-2">
                                                +{moreCount} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}