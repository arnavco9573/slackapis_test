import { useState, useEffect } from 'react'
import { format, isSameHour, addHours } from 'date-fns'
import { X } from 'lucide-react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import Button from '@/components/core/button'
import ArrowSvg from '@/components/svg/arrow'

// Custom SVGs from request
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

type Event = {
    id: string
    summary: string
    start: { dateTime?: string; date?: string }
    end: { dateTime?: string; date?: string }
}

type TeamSchedule = {
    email: string
    id?: string
    name: string
    events: Event[]
    color: string
    profile_picture?: string
}

type AssignmentModalProps = {
    isOpen: boolean
    onClose: () => void
    slotTime: string | null
    teamMembers: TeamSchedule[]
    onAssign: (memberId: string, memberName: string) => void
    isAssigning: boolean
    prioritySlots?: any[]
    onSlotSelect?: (time: string) => void
    isLoading?: boolean
    isEditMode?: boolean
    initialSelectedMember?: TeamSchedule | null
    timezone?: string
}

export default function AssignmentModal({
    isOpen,
    onClose,
    slotTime,
    teamMembers,
    onAssign,
    isAssigning,
    prioritySlots = [],
    onSlotSelect,
    isLoading = false,
    isEditMode = false,
    initialSelectedMember = null,
    timezone = 'UTC'
}: AssignmentModalProps) {
    const [confirmingMember, setConfirmingMember] = useState<TeamSchedule | null>(null)

    useEffect(() => {
        if (isOpen && initialSelectedMember) {
            // Find the matching member in teamMembers to get full data (including events)
            const searchId = initialSelectedMember.id
            const searchEmail = (initialSelectedMember as any).workspace_email || initialSelectedMember.email

            const fullMember = teamMembers.find(m =>
                (searchId && m.id === searchId) ||
                (searchEmail && (m.email === searchEmail || (m as any).workspace_email === searchEmail))
            )

            if (fullMember) {
                setConfirmingMember(fullMember)
            } else {
                setConfirmingMember(initialSelectedMember)
            }
        } else if (!isOpen) {
            setConfirmingMember(null)
        }
    }, [isOpen, initialSelectedMember, teamMembers])

    if (!isOpen || !slotTime) return null

    // Timezone-aware formatting helper
    const formatInTZ = (date: Date | string, formatStr: string) => {
        const d = typeof date === 'string' ? new Date(date) : date
        return new Intl.DateTimeFormat('en-GB', {
            timeZone: timezone,
            hour: formatStr.includes('h') ? '2-digit' : undefined,
            minute: formatStr.includes('m') ? '2-digit' : undefined,
            day: formatStr.includes('d') ? '2-digit' : undefined,
            month: formatStr.includes('MMM') ? 'short' : (formatStr.includes('MM') ? '2-digit' : undefined),
            year: formatStr.includes('yyyy') ? 'numeric' : undefined,
            weekday: formatStr.includes('EEE') ? 'short' : (formatStr.includes('EEEE') ? 'long' : undefined),
            hour12: true
        }).format(d)
    }

    const getTZParts = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date
        const parts = new Intl.DateTimeFormat('en-GB', {
            timeZone: timezone,
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        }).formatToParts(d)
        const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0')
        const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0')
        return { hour, minute }
    }

    const slotDate = new Date(slotTime)

    // Check Availability Logic
    const isMemberAvailable = (member: TeamSchedule) => {
        // Check if ANY event overlaps with the slot hour
        const hasConflict = member.events.some(event => {
            if (!event.start.dateTime) return false
            const eventStart = new Date(event.start.dateTime)

            const evtDay = formatInTZ(eventStart, 'd MMM yyyy')
            const slotDay = formatInTZ(slotDate, 'd MMM yyyy')
            const { hour: evtHour } = getTZParts(eventStart)
            const { hour: slotHour } = getTZParts(slotDate)

            return evtDay === slotDay && evtHour === slotHour
        })
        return !hasConflict
    }

    // Sort: Available first, then unavailable
    const sortedMembers = [...teamMembers].sort((a, b) => {
        const aAvail = isMemberAvailable(a)
        const bAvail = isMemberAvailable(b)
        if (aAvail && !bAvail) return -1
        if (!aAvail && bAvail) return 1
        return 0
    })

    // Sort priority slots by priority_level
    const sortedSlots = [...prioritySlots].sort((a, b) => (a.priority_level || 99) - (b.priority_level || 99))

    const getPriorityLabel = (p: number) => {
        const map = ['First Priority', 'Second Priority', 'Third Priority', 'Fourth Priority', 'Fifth Priority']
        return map[p - 1] || `Priority ${p}`
    }

    const handleBack = () => {
        setConfirmingMember(null)
    }

    const handleConfirmAssign = () => {
        if (confirmingMember) {
            onAssign(confirmingMember.id || confirmingMember.email, confirmingMember.name)
        }
    }

    const handleInitialSelect = (member: TeamSchedule) => {
        setConfirmingMember(member)
    }

    // Reset on close
    const handleClose = () => {
        setConfirmingMember(null)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-03 backdrop-blur-2xl">
            <AnimatePresence mode="wait">
                {confirmingMember ? (
                    <motion.div
                        key="confirmation"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col relative"
                        style={{
                            display: 'flex',
                            padding: '24px',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            gap: '24px',
                            borderRadius: '12px',
                            background: '#1D1E21',
                            boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                            backdropFilter: 'blur(10px)',
                            width: '450px'
                        }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center w-full">
                            <h3 className="text-lg font-normal text-white">Assign Meeting</h3>
                            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Member Card */}
                        <div className="w-full bg-[#25262B] border border-[#333] rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="shrink-0">
                                    {confirmingMember.profile_picture ? (
                                        <Image
                                            src={confirmingMember.profile_picture}
                                            alt={confirmingMember.name}
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 overflow-hidden"
                                            style={{ backgroundColor: confirmingMember.color || '#333' }}
                                        >
                                            {confirmingMember.name[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white text-sm font-medium">{confirmingMember.name}</span>
                                    <span className="text-gray-500 text-xs">{confirmingMember.email}</span>
                                </div>
                            </div>
                            <div className="w-5 h-5 bg-[#333] rounded-[4px] flex items-center justify-center border border-[#444]">
                                <Image src="/icons/check.svg" alt="check" width={12} height={12} className="hidden" />
                                <CheckIcon />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex w-full justify-center gap-10 items-center pt-2">
                            <button
                                onClick={handleBack}
                                className="text-white text-sm px-6 py-2.5 hover:text-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <Button
                                onClick={handleConfirmAssign}
                                disabled={isAssigning}
                                className="px-6 py-2.5 h-[40px] rounded-full bg-[#333] border border-[#444] text-white hover:bg-[#444]"
                            >
                                Assign <ArrowSvg />
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-4 shrink-0 bg-[#1A1B1E] rounded-[4px]"
                        style={{
                            width: '396px',
                            padding: '16px',
                            boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.4)'
                        }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-normal text-white">Assign Meeting</h3>
                            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Priority List - Hidden in Edit Mode */}
                        {!isEditMode && (
                            <div className="flex flex-col gap-2">
                                <span className="text-xs text-text-mid font-medium">Priority List</span>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                    {sortedSlots.map((slot) => {
                                        const isSelected = slot.requested_start_time === slotTime
                                        const start = new Date(slot.requested_start_time)
                                        const end = addHours(start, 1)
                                        const label = slot.priority_level ? getPriorityLabel(slot.priority_level) : 'Slot'

                                        return (
                                            <button
                                                key={slot.id}
                                                onClick={() => onSlotSelect?.(slot.requested_start_time)}
                                                className={`flex items-center px-3 py-1.5 gap-1 shrink-0 rounded-[279px] border transition-all ${isSelected
                                                    ? 'bg-white/5 border-[#636363]'
                                                    : 'bg-transparent border-transparent hover:border-[#333]'
                                                    }`}
                                            >
                                                <span className={`text-[10px] ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {label}:
                                                </span>
                                                <span className={`text-[10px] font-medium ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                                                    {formatInTZ(start, 'h a')} - {formatInTZ(end, 'h a')}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Team Members List */}
                        <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                            {isLoading ? (
                                // Skeleton Loader
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="w-full h-[36px] flex items-center gap-3 p-3 rounded-[4px] bg-[#25262B] animate-pulse">
                                        <div className="w-5 h-5 rounded-full bg-[#333]" />
                                        <div className="h-3 w-24 bg-[#333] rounded" />
                                    </div>
                                ))
                            ) : (
                                sortedMembers.map(member => {
                                    const available = isMemberAvailable(member)
                                    return (
                                        <button
                                            key={member.email}
                                            disabled={isAssigning || !available}
                                            onClick={() => available && handleInitialSelect(member)}
                                            className="w-full h-[36px] flex items-center gap-3 p-3 rounded-[4px] transition-all group text-left"
                                            style={{
                                                background: available ? 'rgba(109, 171, 156, 0.04)' : 'rgba(255, 83, 83, 0.04)',
                                                cursor: available ? 'pointer' : 'default'
                                            }}
                                        >
                                            {/* Status Icon */}
                                            <div className="shrink-0 flex items-center justify-center w-5 h-5">
                                                {available ? <CheckIcon /> : <CrossIcon />}
                                            </div>

                                            {/* Avatar */}
                                            {member.profile_picture ? (
                                                <Image
                                                    src={member.profile_picture}
                                                    alt={member.name}
                                                    width={20}
                                                    height={20}
                                                    className="rounded-full object-cover shrink-0"
                                                />
                                            ) : (
                                                <div
                                                    className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 overflow-hidden"
                                                    style={{ backgroundColor: member.color || '#333' }}
                                                >
                                                    {member.name[0]}
                                                </div>
                                            )}

                                            {/* Name */}
                                            <span className={`text-sm font-normal ${available ? 'text-white' : 'text-gray-400'}`}>
                                                {member.name}
                                            </span>
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
