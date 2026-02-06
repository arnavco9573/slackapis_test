'use client'

import React, { useState, useMemo } from 'react'
import { format, addDays, subDays, addMonths, subMonths, isSameDay, isSameMonth, parseISO, getHours, getMinutes, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, startOfDay } from 'date-fns'
import { Toaster, toast } from 'sonner'
import { ChevronLeft, ChevronRight, Search, ChevronDown, Check, X, ExternalLink, Copy, Mail, Clock } from 'lucide-react'
import EditPencilSvg from '@/components/svg/edit-pencil'
import Trash2Svg from '@/components/svg/trash2'
import ViewSelector from './ViewSelector'
import ChipBordered from '@/components/core/chip-bordered'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Button from '@/components/core/button'
import ChipFilled from '@/components/core/chip-filled'
import ArrowSvg from '@/components/svg/arrow'
import ParticipantsSvg from '@/components/svg/participants'
import ClockSvg from '@/components/svg/clock'

// Types
type ViewType = 'Daily' | 'Weekly' | 'Monthly'

const HOUR_HEIGHT = 3.15 // 44px at 16px base font size

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
    description?: string
    location?: string
    hangoutLink?: string
    attendees?: any[]
}

interface CalendarViewProps {
    teamMembers: TeamMember[]
    selectedMemberIds: string[]
    events: CalendarEvent[]
    highlightedSlots?: any[]
    onSlotClick?: (date: string, member?: any) => void
    onEditEvent?: (event: CalendarEvent) => void
    onReconnect?: () => void
    isSessionExpired?: boolean
    timezone?: string
}

export default function CalendarView({
    teamMembers,
    selectedMemberIds,
    events,
    highlightedSlots = [],
    onSlotClick,
    onEditEvent,
    onReconnect,
    isSessionExpired,
    timezone
}: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [view, setView] = useState<ViewType>('Weekly')
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

    // Auto-navigate to highlighted slot
    React.useEffect(() => {
        if (highlightedSlots && highlightedSlots.length > 0) {
            const firstSlot = highlightedSlots[0]
            if (firstSlot.requested_start_time) {
                setCurrentDate(new Date(firstSlot.requested_start_time))
            }
        }
    }, [highlightedSlots])

    // Helper to format date in master's timezone
    const formatInTZ = (dateString: string | Date, formatStr: string) => {
        if (!dateString) return ''
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString
        if (!timezone) return format(date, formatStr)
        try {
            const options: Intl.DateTimeFormatOptions = { timeZone: timezone }
            if (formatStr === 'h:mm a' || formatStr === 'h a') {
                options.hour = 'numeric'
                if (formatStr === 'h:mm a') options.minute = 'numeric'
                options.hour12 = true
            } else if (formatStr === 'd MMM yyyy, EEE') {
                options.day = 'numeric'
                options.month = 'short'
                options.year = 'numeric'
                options.weekday = 'short'
            } else if (formatStr === 'd MMM yyyy') {
                options.day = 'numeric'
                options.month = 'short'
                options.year = 'numeric'
            } else if (formatStr === 'EEEE: d MMM, yyyy') {
                options.weekday = 'long'
                options.day = 'numeric'
                options.month = 'short'
                options.year = 'numeric'
            } else if (formatStr === 'h:mm') {
                options.hour = 'numeric'
                options.minute = 'numeric'
                options.hour12 = false
            } else if (formatStr === 'EEE') {
                options.weekday = 'short'
            } else if (formatStr === 'd') {
                options.day = 'numeric'
            }

            // Format the date
            let formatted = new Intl.DateTimeFormat('en-GB', options).format(date)

            // For 'EEEE: d MMM, yyyy' format, we need to manually add the colon after weekday
            if (formatStr === 'EEEE: d MMM, yyyy') {
                const parts = new Intl.DateTimeFormat('en-GB', {
                    timeZone: timezone,
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }).formatToParts(date)

                const weekday = parts.find(p => p.type === 'weekday')?.value || ''
                const day = parts.find(p => p.type === 'day')?.value || ''
                const month = parts.find(p => p.type === 'month')?.value || ''
                const year = parts.find(p => p.type === 'year')?.value || ''

                formatted = `${weekday}: ${day} ${month}, ${year}`
            }

            return formatted
        } catch (e) {
            return format(date, formatStr)
        }
    }

    const getTZParts = (date: Date) => {
        if (!timezone) return { hour: getHours(date), minute: getMinutes(date) }
        try {
            const parts = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                hour: 'numeric',
                minute: 'numeric',
                hourCycle: 'h23',
                hour12: false
            }).formatToParts(date)
            const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0')
            const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0')
            return { hour, minute }
        } catch (e) {
            return { hour: getHours(date), minute: getMinutes(date) }
        }
    }

    const getTZOffsetLabel = () => {
        if (!timezone) return 'GMT'
        try {
            const parts = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                timeZoneName: 'short'
            }).formatToParts(new Date())
            return parts.find(p => p.type === 'timeZoneName')?.value || 'GMT'
        } catch (e) {
            return 'GMT'
        }
    }

    // Generate days based on view
    const displayDays = useMemo(() => {
        if (view === 'Daily') {
            // If we have highlighted slots, show all and ONLY their unique dates
            if (highlightedSlots && highlightedSlots.length > 0) {
                const dates = highlightedSlots.map(s => startOfDay(new Date(s.requested_start_time)).getTime())
                const uniqueDates = Array.from(new Set(dates)).sort().map(t => new Date(t))
                return uniqueDates
            }
            // Default Daily view is just the one current date
            return [currentDate]
        }
        if (view === 'Weekly') return Array.from({ length: 7 }).map((_, i) => addDays(currentDate, i))
        // Monthly: get all days in the month grid (including padding from prev/next month)
        const monthStart = startOfMonth(currentDate)
        const monthEnd = endOfMonth(currentDate)
        const calendarStart = startOfWeek(monthStart)
        const calendarEnd = endOfWeek(monthEnd)
        return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    }, [currentDate, view, highlightedSlots])

    // Time slots (1 AM to 11 PM)
    const hours = Array.from({ length: 23 }).map((_, i) => 1 + i) // 1 to 23

    // Navigation handlers
    const handlePrevPeriod = () => {
        // Shift by 1 day even in Weekly view for a rolling window effect
        setCurrentDate(subDays(currentDate, 1))
    }

    const handleNextPeriod = () => {
        // Shift by 1 day even in Weekly view for a rolling window effect
        setCurrentDate(addDays(currentDate, 1))
    }

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
    const handleToday = () => setCurrentDate(new Date())

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
                {/* Left: Today & Period Navigation */}
                <div className="flex items-center gap-6">
                    <Button
                        onClick={handleToday}
                        className="h-[32px] px-4 rounded-full"
                        style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                    >
                        Today
                    </Button>

                    <div className="flex items-center gap-1">
                        <button
                            disabled={view === 'Monthly'}
                            onClick={handlePrevPeriod}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            disabled={view === 'Monthly'}
                            onClick={handleNextPeriod}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

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
                <div className="relative w-[342px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-(--Priamry-600)" size={14} />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full border-[0.5px] border-white/5 rounded-[90px] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-all h-[36px]"
                        style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                    />
                </div>

                {/* Right: View Selector & Month Navigation */}
                <div className="flex items-center gap-4">
                    <ViewSelector selected={view} onSelect={setView} />

                    <div className="flex items-center gap-2">
                        <button onClick={handlePrevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                            <ChevronLeft size={18} />
                        </button>

                        <div className="px-4 h-[32px] flex items-center justify-center bg-transparent border border-white/10 rounded-full text-white text-sm font-normal min-w-[120px]">
                            {format(currentDate, 'MMMM yyyy')}
                        </div>

                        <button onClick={handleNextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Container */}
            {view === 'Monthly' ? (
                <MonthlyView
                    displayDays={displayDays}
                    currentDate={currentDate}
                    getEventsForDay={getEventsForDay}
                    highlightedSlots={highlightedSlots}
                    getHighlightedSlotsForDay={getHighlightedSlotsForDay}
                    onSlotClick={onSlotClick}
                    onEventClick={setSelectedEvent}
                    formatInTZ={formatInTZ}
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
                    teamMembers={teamMembers}
                    events={events}
                    onEventClick={setSelectedEvent}
                    formatInTZ={formatInTZ}
                    getTZParts={getTZParts}
                    getTZOffsetLabel={getTZOffsetLabel}
                />
            )}

            {/* Event Details Modal */}
            {selectedEvent && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
                    onClick={() => setSelectedEvent(null)}
                >
                    <EventDetailsModal
                        event={selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                        teamMembers={teamMembers}
                        formatInTZ={formatInTZ}
                        getTZOffsetLabel={getTZOffsetLabel}
                        onEdit={() => {
                            onEditEvent?.(selectedEvent)
                            setSelectedEvent(null)
                        }}
                    />
                </div>
            )}
        </div>
    )
}

function EventDetailsModal({ event, onClose, teamMembers, formatInTZ, getTZOffsetLabel, onEdit }: any) {
    const member = teamMembers.find((m: any) => m.id === event.memberId || m.workspace_email === event.memberId)

    return (
        <div
            className="w-[540px] inset-0 bg-[#1D1E21] backdrop-blur-2xl p-6 flex flex-col gap-6 relative overflow-hidden"
            style={{
                borderRadius: '12px',
                boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset'
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Top Toolbar */}
            <div className="flex items-center justify-end gap-4 text-(--Primary-600)">
                <button
                    onClick={onEdit}
                    className="hover:text-white transition-colors"
                >
                    <EditPencilSvg className="w-4 h-4" />
                </button>
                <button className="hover:text-red-500 transition-colors">
                    <Trash2Svg className="w-4 h-4" />
                </button>
                <button onClick={onClose} className="hover:text-white transition-colors"><X size={20} /></button>
            </div>

            {/* Title */}
            <h2 className="text-[28px] font-normal text-white leading-tight">
                {event.title}
            </h2>

            {/* Date/Time Chips */}
            <div className="flex items-center gap-3">
                <ChipFilled className="px-4 py-1.5 gap-2 h-auto text-xs">
                    <span className="text-text-high">Date:</span>
                    <span className="text-[#9C9C9C]">{formatInTZ ? formatInTZ(event.start, 'EEEE: d MMM, yyyy') : format(event.start, 'EEEE: d MMM, yyyy')}</span>
                </ChipFilled>
                <ChipFilled className="px-4 py-1.5 gap-2 h-auto text-xs">
                    <span className="text-text-high">Time:</span>
                    <span className="text-[#9C9C9C] uppercase">{formatInTZ ? formatInTZ(event.start, 'h:mm a') : format(event.start, 'hh:mm a')} - {formatInTZ ? formatInTZ(event.end, 'h:mm a') : format(event.end, 'hh:mm a')} {getTZOffsetLabel ? getTZOffsetLabel() : 'GMT'}</span>
                </ChipFilled>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-3">
                <span className="text-(--Priamry-600) text-sm">Call Description</span>
                <p className="text-text-high text-sm leading-relaxed whitespace-pre-wrap">
                    {event.description || 'No description provided.'}
                </p>
            </div>

            {/* Join Meet */}
            <div className="flex flex-col gap-2">
                {event.hangoutLink && (
                    <Button
                        onClick={() => window.open(event.hangoutLink, '_blank')}
                        className="w-fit flex items-center h-[30px]"
                    >
                        Join meet <ArrowSvg />
                    </Button>
                )}
                <div className="flex items-center justify-between text-text-high text-sm">
                    <span className="truncate max-w-[400px]">{event.hangoutLink || event.location || 'No meeting link or location.'}</span>
                    {(event.hangoutLink || event.location) && (
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(event.hangoutLink || event.location || '')
                                toast.success("Link copied to clipboard")
                            }}
                            className="hover:text-white transition-colors"
                        >
                            <Copy size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Participants */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-(--Priamry-600) text-sm">
                    <div className="flex items-center gap-2 text-(--Primary-600)">
                        <ParticipantsSvg className="w-[15px] h-[15px]" />
                        <span>Participants</span>
                    </div>
                    <button className="hover:text-white transition-colors"><Mail size={16} /></button>
                </div>

                <div className="flex flex-col gap-2">
                    {/* Selected Team Member */}
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg overflow-hidden border border-white/10"
                            style={{ backgroundColor: member?.color || '#555' }}
                        >
                            {member?.name?.[0] || 'T'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-sm font-medium">{member?.name || 'Team Member'} (Organizer)</span>
                        </div>
                    </div>

                    {/* Attendees */}
                    {(event.attendees || []).filter((a: any) => a.email !== member?.workspace_email).map((attendee: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 opacity-80">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg overflow-hidden border border-white/10">
                                {attendee.displayName?.[0] || attendee.email?.[0] || '?'}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white text-sm font-medium">
                                    {attendee.displayName || attendee.email}
                                    {attendee.responseStatus === 'accepted' && ' (Accepted)'}
                                    {attendee.responseStatus === 'declined' && ' (Declined)'}
                                    {attendee.responseStatus === 'needsAction' && ' (Pending)'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-2 text-[#888]">
                <div className="flex items-center gap-2 text-sm">
                    <ClockSvg className="w-[16px] h-[16px] text-[#888]" />
                    <span className="text-[#888]">Duration</span>
                </div>
                <span className="text-text-high text-sm font-medium">
                    {Math.round((event.end.getTime() - event.start.getTime()) / 60000)} minutes
                </span>
            </div>
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

// Custom Icons from AssignmentModal
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M13.3307 4L5.9974 11.3333L2.66406 8" stroke="#6DAB9C" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const CrossIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4.22656 4.23047L11.769 11.7729M4.22656 11.7729L11.769 4.23047" stroke="#FF5353" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

function MemberStatusChip({ member, available, onSelect }: any) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation()
                if (available) onSelect(member)
            }}
            className={`flex items-center gap-1.5 px-3 h-[44px] rounded-[4px] border transition-all ${available ? 'border-[#10B981] bg-[#10B981]/10 cursor-pointer' : 'border-[#FF5353] bg-[#FF5353]/10 opacity-60 cursor-not-allowed'}`}
            disabled={!available}
        >
            <div className="shrink-0 flex items-center justify-center">
                {available ? (
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
                        <path d="M8.33333 2.5L3.75 7.08333L1.66667 5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : (
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
                        <path d="M2.5 2.5L7.5 7.5M2.5 7.5L7.5 2.5" stroke="#FF5353" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </div>
            <div
                className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0 overflow-hidden"
                style={{ backgroundColor: member.color || '#333' }}
            >
                {member.name?.[0]}
            </div>
            <span className="text-[10px] text-white/40 leading-none tracking-tighter">-</span>
        </button>
    )
}

function MemberStatusGroup({ slot, teamMembers, events, onSlotClick, topPosition, heightRem, getTZParts, formatInTZ }: any) {
    const slotDate = new Date(slot.requested_start_time)

    const isMemberAvailable = (member: TeamMember) => {
        const memberEvents = events.filter((e: any) => e.memberId === member.id || e.memberId === member.workspace_email)
        const hasConflict = memberEvents.some((event: any) => {
            const eventStart = new Date(event.start).getTime()
            const eventEnd = new Date(event.end).getTime()

            const slotStart = slotDate.getTime()
            const slotEnd = slotStart + (60 * 60 * 1000) // 1 Hour

            // Check for overlap: (StartA < EndB) && (EndA > StartB)
            return (slotStart < eventEnd) && (slotEnd > eventStart)
        })
        return !hasConflict
    }

    return (
        <div
            className="absolute w-full z-25 flex flex-wrap gap-1"
            style={{
                top: `${topPosition}rem`,
                height: `${heightRem}rem`,
            }}
        >
            {teamMembers.map((member: any) => (
                <MemberStatusChip
                    key={member.id}
                    member={member}
                    available={isMemberAvailable(member)}
                    onSelect={(m: any) => onSlotClick?.(slot.requested_start_time, false, m)}
                />
            ))}
        </div>
    )
}

// Assignee Popover Component
function AssigneeListPopover({ teamMembers, slotTime, events, onSelect, getTZParts, formatInTZ }: any) {
    const slotDate = new Date(slotTime)

    const isMemberAvailable = (member: TeamMember) => {
        const memberEvents = events.filter((e: any) => e.memberId === member.id || e.memberId === member.workspace_email)
        const hasConflict = memberEvents.some((event: any) => {
            const eventStart = new Date(event.start).getTime()
            const eventEnd = new Date(event.end).getTime()

            const slotStart = slotDate.getTime()
            const slotEnd = slotStart + (60 * 60 * 1000) // 1 Hour

            // Check for overlap: (StartA < EndB) && (EndA > StartB)
            return (slotStart < eventEnd) && (slotEnd > eventStart)
        })
        return !hasConflict
    }

    const sortedMembers = [...teamMembers].sort((a: any, b: any) => {
        const aAvail = isMemberAvailable(a)
        const bAvail = isMemberAvailable(b)
        if (aAvail && !bAvail) return -1
        if (!aAvail && bAvail) return 1
        return 0
    })

    return (
        <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
            {sortedMembers.map((member: any) => {
                const available = isMemberAvailable(member)
                return (
                    <button
                        key={member.id}
                        onClick={(e) => {
                            e.stopPropagation()
                            if (available) onSelect(member)
                        }}
                        className={`w-full h-[36px] flex items-center gap-3 p-2 rounded-[4px] transition-all group text-left ${available ? 'hover:bg-white/5 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                        style={{
                            background: available ? 'rgba(109, 171, 156, 0.04)' : 'rgba(255, 83, 83, 0.04)',
                        }}
                        disabled={!available}
                    >
                        <div className="shrink-0 flex items-center justify-center w-5 h-5">
                            {available ? <CheckIcon /> : <CrossIcon />}
                        </div>

                        <div
                            className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0 overflow-hidden"
                            style={{ backgroundColor: member.color || '#333' }}
                        >
                            {member.name?.[0]}
                        </div>

                        <span className={`text-xs font-normal ${available ? 'text-white' : 'text-gray-400'}`}>
                            {member.name}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

function HighlightedSlot({ slot, topPosition, heightRem, start, end, teamMembers, events, onSlotClick, view, formatInTZ, getTZParts }: any) {
    const [isOpen, setIsOpen] = useState(false)

    if (view === 'Daily') {
        return (
            <MemberStatusGroup
                slot={slot}
                topPosition={topPosition}
                heightRem={heightRem}
                teamMembers={teamMembers}
                events={events}
                onSlotClick={onSlotClick}
                getTZParts={getTZParts}
                formatInTZ={formatInTZ}
            />
        )
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div
                    className="absolute w-[95%] left-[2.5%] z-25 cursor-pointer transition-all group bg-white/5 border-[0.7px] border-white/30 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_100%)]"
                    style={{
                        top: `${topPosition}rem`,
                        height: `${heightRem}rem`,
                        borderRadius: '3px',
                        boxShadow: '0 0 4px 0 rgba(255, 255, 255, 0.25)'
                    }}
                >
                    <div className="h-full w-full p-2 flex flex-col justify-between">
                        <span className="text-white text-xs font-normal">Check availability</span>
                        <div className="flex items-center justify-between">
                            <span className="text-white text-[10px] font-mono">
                                {formatInTZ(start, 'h:mm a')} - {formatInTZ(end, 'h:mm a')}
                            </span>
                            <ChevronDown size={14} className="text-white" />
                        </div>
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-[260px] bg-[#1A1B1E] border border-[#333] p-0 backdrop-blur-md rounded-[4px] z-40"
                align="start"
                side="right"
                onPointerDownOutside={() => setIsOpen(false)}
            >
                <AssigneeListPopover
                    teamMembers={teamMembers}
                    slotTime={slot.requested_start_time}
                    events={events}
                    getTZParts={getTZParts}
                    formatInTZ={formatInTZ}
                    onSelect={(member: any) => {
                        setIsOpen(false)
                        onSlotClick?.(slot.requested_start_time, false, member)
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}

// Time Grid View (Daily & Weekly)
function TimeGridView({
    displayDays,
    hours,
    getEventsForDay,
    view,
    highlightedSlots,
    getHighlightedSlotsForDay,
    onSlotClick,
    teamMembers,
    events,
    onEventClick,
    formatInTZ,
    getTZParts,
    getTZOffsetLabel
}: any) {
    return (
        <div className="flex-1 overflow-hidden bg-neutral-01 section-border rounded-xl flex flex-col relative w-full">
            {/* Days Header (Sticky) */}
            <div className={`grid ${view === 'Daily' ? 'grid-cols-[80px_1fr]' : 'grid-cols-[60px_1fr]'} border-b border-[#222] bg-neutral-01 z-20`}>
                <div className="py-4 border-r border-[#222] flex flex-col pl-4 justify-center">
                    <span className="text-xs text-(--Priamry-600) font-normal whitespace-nowrap ">{getTZOffsetLabel()}</span>
                </div>
                <div className="grid" style={{ gridTemplateColumns: `repeat(${displayDays.length}, minmax(0, 1fr))` }}>
                    {displayDays.map((day: Date, i: number) => {
                        const isToday = isSameDay(day, new Date())
                        return (
                            <div key={i} className="py-6 flex flex-col items-center border-r border-[#222] last:border-r-0 relative">
                                <span className="text-[11px] font-medium text-(--Priamry-600) uppercase mb-3">{formatInTZ(day, 'EEE')}</span>
                                <div className={`w-9 h-9 flex items-center justify-center rounded-full text-lg font-medium transition-colors ${isToday ? 'bg-white/10 text-white' : 'text-gray-400'}`}>
                                    {formatInTZ(day, 'd')}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Scrollable Grid Area */}
            <div className="flex-1 overflow-y-auto w-full relative" style={{ scrollbarWidth: "none" }}>
                <div className={`grid ${view === 'Daily' ? 'grid-cols-[80px_1fr]' : 'grid-cols-[60px_1fr]'} min-h-[920px] bg-neutral-01`}>
                    {/* Time Slots Sidebar */}
                    <div className="border-r border-[#222]">
                        {hours.map((hour: number) => (
                            <div key={hour} className="h-10 relative" style={{ height: `${HOUR_HEIGHT}rem` }}>
                                <span className="absolute -top-1 right-3 text-xs text-(--Priamry-600) font-medium whitespace-nowrap uppercase">
                                    {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Main Grid */}
                    <div className="grid relative" style={{ gridTemplateColumns: `repeat(${displayDays.length}, minmax(0, 1fr))` }}>
                        {/* Horizontal Lines */}
                        {hours.map((hour: number) => (
                            <div key={hour} className="absolute w-full border-t border-[#222]" style={{ top: `${(hour - 1) * HOUR_HEIGHT}rem`, height: `${HOUR_HEIGHT}rem` }} />
                        ))}

                        {/* Vertical Lines */}
                        {displayDays.map((_: any, i: number) => (
                            <div key={i} className="absolute h-full border-r border-[#222] pointer-events-none" style={{ left: `${(i + 1) * (100 / displayDays.length)}%` }} />
                        ))}

                        {/* Current Time Indicator */}
                        {(() => {
                            const now = new Date()
                            const { hour: currentHour, minute: currentMinute } = getTZParts(now)

                            if (currentHour < 1 || currentHour > 23) return null

                            const topPosition = ((currentHour - 1) * HOUR_HEIGHT) + (currentMinute / 60 * HOUR_HEIGHT)

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
                                    const { hour: startHour, minute: startMinute } = getTZParts(start)
                                    // Default duration 60 mins to match "12 PM - 1 PM" example
                                    const end = new Date(start.getTime() + 60 * 60000)

                                    const topPosition = ((startHour - 1) * HOUR_HEIGHT) + (startMinute / 60 * HOUR_HEIGHT)
                                    const durationMinutes = 60
                                    const heightRem = (durationMinutes / 60) * HOUR_HEIGHT

                                    return (
                                        <HighlightedSlot
                                            key={slot.id || sIdx}
                                            slot={slot}
                                            topPosition={topPosition}
                                            heightRem={heightRem}
                                            start={start}
                                            end={end}
                                            teamMembers={teamMembers}
                                            events={events}
                                            onSlotClick={onSlotClick}
                                            view={view}
                                            formatInTZ={formatInTZ}
                                            getTZParts={getTZParts}
                                        />
                                    )
                                })}
                            </div>
                        ))}

                        {/* Events */}
                        {displayDays.map((day: Date, dayIdx: number) => (
                            <div key={dayIdx} className="relative h-full" style={{ gridColumn: dayIdx + 1, gridRow: '1 / span 1' }}>
                                {getEventsForDay(day).map((evt: any, eIdx: number) => {
                                    const { hour: startHour, minute: startMinute } = getTZParts(new Date(evt.start))
                                    const { hour: endHour, minute: endMinute } = getTZParts(new Date(evt.end))

                                    const topPosition = ((startHour - 1) * HOUR_HEIGHT) + (startMinute / 60 * HOUR_HEIGHT)
                                    const durationMinutes = (endHour - startHour) * 60 + (endMinute - startMinute)
                                    const heightRem = (durationMinutes / 60) * HOUR_HEIGHT

                                    const isWeekly = view === 'Weekly'
                                    return (
                                        <div
                                            key={evt.id + eIdx}
                                            className={`absolute w-full z-20 cursor-pointer ${isWeekly ? 'opacity-30' : ''}`}
                                            style={{
                                                top: `${topPosition}rem`,
                                                height: `${heightRem}rem`,
                                                padding: '1px'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onEventClick(evt)
                                            }}
                                        >
                                            <div
                                                className={`h-full px-4 py-2 flex flex-col justify-center rounded-[4px] ${isWeekly ? '' : 'border-l-4'}`}
                                                style={{
                                                    backgroundColor: hexToRgba(evt.color, 0.1),
                                                    borderLeftColor: isWeekly ? 'transparent' : evt.color,
                                                    background: isWeekly
                                                        ? hexToRgba(evt.color, 0.2)
                                                        : `linear-gradient(90deg, ${hexToRgba(evt.color, 0.15)} 0%, ${hexToRgba(evt.color, 0.05)} 100%)`
                                                }}
                                            >
                                                <span className="text-white text-xs font-semibold truncate leading-tight">{evt.title}</span>
                                                <span className="text-white/40 text-[10px] font-medium uppercase mt-0.5">
                                                    {formatInTZ(evt.start, 'h a')} - {formatInTZ(evt.end, 'h a')}
                                                </span>
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
function MonthlyView({ displayDays, currentDate, getEventsForDay, getHighlightedSlotsForDay, onSlotClick, onEventClick, formatInTZ, getTZParts }: any) {
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
            <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar" style={{ scrollbarWidth: 'none' }}> {/* Allowed scrolling for the whole calendar grid if needed, though cells are fixed */}
                {weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="grid grid-cols-7 border-b border-[#222] last:border-b-0">
                        {week.map((day, dayIdx) => {
                            const isToday = isSameDay(day, new Date())
                            const isCurrentMonth = isSameMonth(day, currentDate)
                            // Events or Highlighted Slots
                            const events = getEventsForDay(day)
                            const highlightedSlots = getHighlightedSlotsForDay ? getHighlightedSlotsForDay(day) : []
                            const hasHighlightedSlots = highlightedSlots.length > 0

                            // Adjust visible events
                            const visibleEventsCount = hasHighlightedSlots ? 1 : 100 // Show all if scrolling
                            const visibleEvents = events.slice(0, visibleEventsCount)
                            const moreCount = events.length - visibleEventsCount

                            return (
                                <div
                                    key={dayIdx}
                                    className={`border-r border-[#222] last:border-r-0 p-2 flex flex-col ${!isCurrentMonth ? 'bg-neutral-01' : 'bg-neutral-01'} ${hasHighlightedSlots ? 'cursor-pointer transition-all hover:brightness-110 relative z-10' : ''}`}
                                    style={{
                                        height: '95px', // Fixed height for ALL cells
                                        minWidth: '122px', // Fixed min-width as requested
                                        ...(hasHighlightedSlots ? {
                                            borderRadius: '3px',
                                            border: '0.7px solid var(--Neutrals-30, rgba(255, 255, 255, 0.30))',
                                            background: 'rgba(255, 255, 255, 0.06)',
                                            boxShadow: '0 0 4px 0 rgba(255, 255, 255, 0.25)'
                                        } : {})
                                    }}
                                    onClick={(e) => {
                                        if (hasHighlightedSlots) {
                                            e.stopPropagation()
                                            // Pass the first slot's time to trigger proper selection
                                            onSlotClick?.(highlightedSlots[0].requested_start_time)
                                        }
                                    }}
                                >
                                    {/* Day Number */}
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-sm font-medium ${isToday ? 'bg-neutral-03 text-white w-6 h-6 rounded-full flex items-center justify-center' : isCurrentMonth ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {formatInTZ(day, 'd')}
                                        </span>
                                    </div>

                                    {/* Content - Scrollable */}
                                    <div className="space-y-1 flex-1 overflow-y-auto custom-scrollbar flex flex-col pr-1" style={{ scrollbarWidth: 'none' }}>
                                        {hasHighlightedSlots && (
                                            <>
                                                <span className="text-white text-[10px] font-normal leading-tight mb-1 sticky top-0 bg-[#262626] z-10 block">Check availability</span>
                                                <div className="flex flex-wrap gap-1 mb-1">
                                                    {highlightedSlots.map((slot: any, idx: number) => {
                                                        const start = new Date(slot.requested_start_time)
                                                        const end = new Date(start.getTime() + 60 * 60000) // Default 1 hour
                                                        return (
                                                            <ChipBordered
                                                                key={idx}
                                                                className="text-[8px] flex items-center justify-center shrink-0 p-0"
                                                                style={{ height: '12px', width: '60px' }}
                                                            >
                                                                {formatInTZ(start, 'h:mm a')} - {formatInTZ(end, 'h:mm a')}
                                                            </ChipBordered>
                                                        )
                                                    })}
                                                </div>
                                            </>
                                        )}

                                        {/* Regular Events - Shown even if highlighted, now with opacity */}
                                        <div className={hasHighlightedSlots ? 'opacity-30' : 'opacity-30'}>
                                            {visibleEvents.map((evt: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className={`text-[10px] px-2 py-1 rounded truncate mb-1 cursor-pointer ${evt.source === 'google' ? '' : 'bg-white/10 text-gray-300'}`}
                                                    style={evt.source === 'google' ? {
                                                        backgroundColor: hexToRgba(evt.color, 0.2),
                                                        color: evt.color,
                                                    } : undefined}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onEventClick(evt)
                                                    }}
                                                >
                                                    <span className="font-medium">{format(evt.start, 'h:mm a')}</span> {evt.title}
                                                </div>
                                            ))}
                                            {moreCount > 0 && (
                                                <div className="text-[10px] text-(--Priamry-600) px-2">
                                                    +{moreCount} more
                                                </div>
                                            )}
                                        </div>
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