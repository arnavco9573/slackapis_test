'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Video, FileText, X, ChevronDown, ChevronUp, ArrowRight, Mail } from 'lucide-react'
import { format } from 'date-fns'
import Button from '@/components/core/button'
import PageLoader from '@/components/svg/page-loading'
import EllipseBlurSvg from '@/components/svg/ellipse-blur'
import ChipFilled from '@/components/core/chip-filled'
import ChipBordered from '@/components/core/chip-bordered'
import EditPencilSvg from '@/components/svg/edit-pencil'
import InputField from '@/components/core/input-field'
import SearchSvg from '@/components/svg/search'
import UserSvg from '@/components/svg/user'
import CalendarSvg from '@/components/svg/calendar'
import ClockSvg from '@/components/svg/clock'
import { useCancelBooking } from '../hooks/useCancelBooking'
import { toast } from 'sonner'
import CancellationModal from './CancellationModal'
import { motion, AnimatePresence } from 'framer-motion' // Changed from 'motion/react' to 'framer-motion' as 'motion/react' is not a standard import
import { cn } from '@/lib/utils'
import ArrowSvg from '@/components/svg/arrow'
import Image from 'next/image'

interface BookingSidebarProps {
    bookings: any[]
    onSelectBooking: (id: string) => void
    selectedRequestId: string | null
    onEditBooking?: (slotTime: string) => void
}

type Tab = 'Request' | 'Scheduled' | 'Concluded' | 'Rejected'

export default function BookingSidebar({ bookings, onSelectBooking, selectedRequestId, onEditBooking }: BookingSidebarProps) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<Tab>('Request')
    const [search, setSearch] = useState('')
    const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking()

    // Cancel Modal State
    const [cancelModalOpen, setCancelModalOpen] = useState(false)
    const [itemToCancel, setItemToCancel] = useState<{ id: string, type: 'Request' | 'Scheduled' } | null>(null)

    const handleOpenCancelModal = (id: string, type: 'Request' | 'Scheduled') => {
        setItemToCancel({ id, type })
        setCancelModalOpen(true)
    }

    const handleConfirmCancel = (message: string, shouldSendEmail: boolean) => {
        if (!itemToCancel) return

        cancelBooking({ requestGroupId: itemToCancel.id, reason: message, shouldSendEmail }, {
            onSuccess: () => {
                toast.success("Request cancelled successfully")
                setCancelModalOpen(false)
                setItemToCancel(null)
            },
            onError: (err) => toast.error("Failed to cancel: " + err.message)
        })
    }

    // Group bookings by request_group_id
    const groupedBookings = useMemo(() => {
        const groups: Record<string, any[]> = {}
        bookings.forEach(b => {
            const key = b.request_group_id || b.id // Fallback to ID if no group
            if (!groups[key]) groups[key] = []
            groups[key].push(b)
        })
        return Object.values(groups).sort((a, b) => {
            // Sort groups by created_at of first item (descending)
            const dateA = new Date(a[0].created_at || a[0].requested_start_time).getTime()
            const dateB = new Date(b[0].created_at || b[0].requested_start_time).getTime()
            return dateB - dateA
        })
    }, [bookings])

    const filteredGroups = useMemo(() => {
        return groupedBookings.filter(group => {
            const status = getGroupStatus(group)

            // Tab Filtering
            let matchesTab = false
            if (activeTab === 'Request') matchesTab = status === 'requested'
            if (activeTab === 'Scheduled') matchesTab = status === 'scheduled'
            if (activeTab === 'Concluded') matchesTab = status === 'concluded'
            if (activeTab === 'Rejected') matchesTab = status === 'rejected'

            if (!matchesTab) return false

            // Search Filtering
            if (!search) return true

            const primary = group[0]
            const query = search.toLowerCase()
            const title = (primary.title || "").toLowerCase()
            const businessName = (primary.wl_partners?.business_name || "").toLowerCase()
            const clientName = (primary.wl_partners?.name || "").toLowerCase()

            return title.includes(query) || businessName.includes(query) || clientName.includes(query)
        })
    }, [groupedBookings, activeTab, search])

    return (
        <div className="w-[400px] shrink-0 bg-card flex flex-col p-4 h-full mt-4">
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-normal text-white mb-2 ">Call Request</h1>
                </div>

                <div className="flex items-center gap-6 text-sm font-medium overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-10 -my-6 px-2">
                    {['Request', 'Scheduled', 'Concluded', 'Rejected'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as Tab)}
                            className={`relative pb-3 transition-colors whitespace-nowrap gap-3 ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <span className="relative z-10">{tab}</span>
                            {activeTab === tab && (
                                <>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
                                        <EllipseBlurSvg className="text-white w-[100px] h-[100px]" />
                                    </div>
                                    <div
                                        className="absolute bottom-0 left-0 right-0 h-px z-10"
                                        style={{
                                            background: 'radial-gradient(244.18% 29.69% at 50% 50%, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)'
                                        }}
                                    />
                                </>
                            )}
                        </button>
                    ))}
                </div>

                <div className="mb-2">
                    <InputField
                        id="booking-search"
                        name="search"
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e: any) => setSearch(e.target.value)}
                        startAdornment={<SearchSvg className="text-gray-500 size-5" />}
                        inputClassName="h-10 text-sm pl-10 justify-center"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-1 space-y-3 custom-scrollbar -mx-2 px-2 pb-10">
                {filteredGroups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                        <p className="text-gray-400 text-sm">
                            {activeTab === 'Request' && 'No call requests found.'}
                            {activeTab === 'Scheduled' && 'No scheduled calls found.'}
                            {activeTab === 'Concluded' && 'No concluded calls found.'}
                            {activeTab === 'Rejected' && 'No rejected calls found.'}
                        </p>
                    </div>
                ) : (
                    filteredGroups.map((group) => {
                        const groupId = group[0].request_group_id || group[0].id
                        return (
                            <BookingCard
                                key={groupId}
                                group={group}
                                type={activeTab}
                                isSelected={selectedRequestId === groupId}
                                onClick={() => onSelectBooking(groupId)}
                                router={router}
                                onCancel={() => handleOpenCancelModal(groupId, getGroupStatus(group) === 'scheduled' ? 'Scheduled' : 'Request')}
                                isCancelling={isCancelling && itemToCancel?.id === groupId}
                                onEdit={onEditBooking}
                            />
                        )
                    })
                )}

                <CancellationModal
                    isOpen={cancelModalOpen}
                    onOpenChange={setCancelModalOpen}
                    onConfirm={handleConfirmCancel}
                    isLoading={isCancelling}
                    isScheduled={itemToCancel?.type === 'Scheduled'}
                />
            </div>
        </div >
    )
}

// Helper to determine group status
function getGroupStatus(group: any[]) {
    // If any slot is scheduled, the whole request is scheduled
    if (group.some(b => b.status === 'scheduled')) return 'scheduled'
    // If any is concluded, concluded
    if (group.some(b => b.status === 'concluded')) return 'concluded'
    // If all are rejected, rejected
    if (group.every(b => b.status === 'rejected')) return 'rejected'
    // Default to requested
    return 'requested'
}

function BookingCard({ group, type, isSelected, onClick, router, onCancel, isCancelling, onEdit }: {
    group: any[],
    type: Tab,
    isSelected: boolean,
    onClick: () => void,
    router: any,
    onCancel?: () => void,
    isCancelling?: boolean,
    onEdit?: (time: string) => void
}) {
    // Info from first item
    const primary = group[0]
    const title = primary.title || "Onboarding Orientation"
    const description = primary.description || "Sign the official service agreement to formalize your partnership. This agreement outlines service scope, responsibilities, and compliance requirements and is required before activation."
    const createdDate = primary.created_at ? new Date(primary.created_at) : new Date(primary.requested_start_time)

    // Partner Info
    const partnerName = primary.wl_partners?.first_name + " " + primary.wl_partners?.last_name || "Client"
    const partnerBusiness = primary.wl_partners?.business_name || "Company"

    // Rejection details
    const rejectedBy = primary.rejected_by // 'master' or 'wl' (or null for old data)
    const isRejectedByAdmin = rejectedBy === 'master'
    const rejectionReason = primary.rejection_reason || primary.cancellation_reason

    // Assigned Member (if any - for 'Rejected by Admin' scenario where it might have been scheduled before)
    // Find if any slot in the group has an assigned team member
    const assignedMember = group.find(b => b.team_members)?.team_members

    // Sort slots by priority or time
    const sortedSlots = [...group].sort((a, b) => (a.priority_level || 99) - (b.priority_level || 99))

    // Group slots by Day
    const slotsByDay = useMemo(() => {
        const days: Record<string, any[]> = {}
        sortedSlots.forEach(slot => {
            const d = new Date(slot.requested_start_time)
            const key = format(d, 'd MMM yyyy, EEE')
            if (!days[key]) days[key] = []
            days[key].push(slot)
        })
        return days
    }, [sortedSlots])

    const getPriorityLabel = (p: number) => {
        const map = ['First', 'Second', 'Third', 'Fourth', 'Fifth']
        return map[p - 1] ? `${map[p - 1]}:` : `Slot ${p}:`
    }

    const [isEditLoading, setIsEditLoading] = useState(false)

    // Controlled expansion based on selection
    const isExpanded = isSelected

    // Badge Logic
    const renderBadge = () => {
        if (type === 'Rejected') {
            if (isRejectedByAdmin) {
                return (
                    <ChipBordered className='text-negative!'>
                        Rejected By Admin
                    </ChipBordered>
                )
            } else {
                return (
                    <ChipBordered className='text-negative!'>
                        Rejected By WL
                    </ChipBordered>
                )
            }
        }
        if (type === 'Scheduled') {
            return (
                <ChipBordered className='text-[#469ABB]!'>
                    Scheduled
                </ChipBordered>
            )
        }
        if (type === 'Concluded') {
            return (
                <ChipBordered className='text-system-positive!'>
                    Concluded
                </ChipBordered>
            )
        }
        // Default Request Badge
        return (
            <ChipFilled className='text-[#888]'>
                {format(createdDate, 'd MMM yyyy')}
            </ChipFilled>
        )
    }

    return (
        <div
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onClick()
            }}
            className={cn(
                "flex flex-col gap-3 bg-neutral-05 p-4 rounded-[8px] transition-colors cursor-pointer group hover:border-[#333] relative overflow-hidden",
                isSelected && "border border-[#333]"
            )}
        >
            {/* Header: Date Pill or Status Badge */}
            <div className="flex items-center justify-between">
                {renderBadge()}
                {(type === 'Rejected' || type === 'Scheduled' || type === 'Concluded') && (
                    <span className="text-xs text-text-low">{format(createdDate, 'd MMM yyyy')}</span>
                )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-normal text-white leading-tight">
                {title}
            </h3>

            {/* Partner Info Row */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                    <ChipFilled className='text-xs '>
                        <span className="text-[#888] mr-1 text-xs">WL:</span>
                        <span className='text-text-highest'>{partnerName}</span>
                    </ChipFilled>
                    <ChipFilled className='text-xs'>
                        <span className="text-[#888] mr-1 text-xs">Company:</span>
                        <span className='text-text-highest'>{partnerBusiness}</span>
                    </ChipFilled>
                </div>

                <div className="text-gray-500 transition-transform duration-200">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
            </div>

            {/* Join Meet Link for Scheduled Interactions */}
            {type === 'Scheduled' && primary.meet_link && isExpanded && (
                <div className="mt-2 text-white">
                    <Button
                        onClick={(e: any) => {
                            e.stopPropagation()
                            window.open(primary.meet_link, '_blank')
                        }}
                        className="inline-flex h-[30px] items-center gap-2 pl-4 pr-3 py-2 rounded-full text-sm text-white"
                    >
                        Join meet <ArrowSvg />
                    </Button>
                    {/* Copy Link Button could be added here if needed, but keeping it simple as per request */}
                </div>
            )}

            {isExpanded && (type === 'Rejected' || type === 'Concluded') && (
                <div
                    className="h-px w-full mt-1"
                    style={{
                        background: 'linear-gradient(90deg, #1A1B1E 0%, #3F4042 50.25%, #1A1B1E 100%), #FFF'
                    }}
                />
            )}


            {/* Collapsible Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: 0 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-col gap-4 pt-3">
                            {/* Meet Link Display Text (like in screenshot) */}
                            {type === 'Scheduled' && primary.meet_link && (
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="truncate text-xs text-text-mid">{primary.meet_link}</span>
                                    {/* Simple copy icon visual placeholder or functionality */}
                                    <div
                                        className="cursor-pointer hover:text-white"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            navigator.clipboard.writeText(primary.meet_link)
                                            toast.success("Link copied")
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <span className="text-gray-400 text-sm">Call Description</span>
                                <span className="text-gray-300 text-xs leading-relaxed">{description}</span>
                            </div>

                            {/* Handling Rejection View vs Standard View vs Scheduled View */}
                            {(type === 'Scheduled' || (type === 'Rejected' && isRejectedByAdmin && assignedMember)) ? (
                                // Scheduled View / Admin Rejection View (Assigned Member)
                                <>
                                    {assignedMember && (
                                        <div className="flex flex-col gap-1 relative">
                                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                <UserSvg className="text-[#888]" /> Assigned to:
                                            </div>
                                            <div className="flex items-center gap-2 pl-6">
                                                {assignedMember.avatar_url ? (
                                                    <Image src={assignedMember.avatar_url} alt={assignedMember.name} className="w-5 h-5 rounded-full"
                                                        width={20}
                                                        height={20} />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-[10px] text-white">
                                                        {assignedMember.name?.charAt(0)}
                                                    </div>
                                                )}
                                                <span className="text-white text-sm">{assignedMember.name}</span>
                                            </div>
                                            {/* Mail icon for scheduled view - purely visual based on screenshot? or functional? */}
                                            {type === 'Scheduled' && assignedMember.email && (
                                                <a
                                                    href={`mailto:${assignedMember.email}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="absolute right-0 top-1 text-gray-500 hover:text-white transition-colors"
                                                >
                                                    <Mail size={16} />
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <CalendarSvg className="text-[#888]" /> Date
                                        </div>
                                        <div className="pl-6 text-white text-sm">
                                            {format(new Date(primary.requested_start_time), 'd MMM yyyy')}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <ClockSvg className="text-[#888]" /> Time
                                        </div>
                                        <div className="pl-6 text-white text-sm">
                                            {format(new Date(primary.requested_start_time), 'h a')} - {format(new Date(new Date(primary.requested_start_time).getTime() + 60 * 60000), 'h a')}
                                        </div>
                                    </div>

                                    {/* Reason Box (only for rejected) */}
                                    {type === 'Rejected' && rejectionReason?.length > 0 && (
                                        <div className="flex flex-col gap-2 mt-2">
                                            <span className="text-gray-400 text-sm">Reason</span>
                                            <div
                                                className="p-4 rounded-lg text-sm text-gray-300"
                                                style={{
                                                    borderRadius: '8px',
                                                    border: '0.5px solid rgba(255, 255, 255, 0.05)',
                                                    background: 'rgba(255, 255, 255, 0.03)'
                                                }}
                                            >
                                                {rejectionReason}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                // WL Rejection or Standard Request View (Slots)
                                <>
                                    {/* Preferred Slots */}
                                    <div className="">
                                        {type === 'Rejected' && <span className="text-gray-400 text-sm mb-2 block">Preferred Slots</span>}

                                        {Object.entries(slotsByDay).map(([day, slots]) => (
                                            <div key={day} className='flex flex-col mt-3 first:mt-0'>
                                                <h4 className="text-xs text-(--Primary-600) mb-2 font-medium">{day}</h4>
                                                <div className="flex flex-col gap-2">
                                                    {slots.map((slot: any) => (
                                                        <div key={slot.id} className="flex items-center justify-between text-xs rounded-lg">
                                                            <span className="text-gray-300">
                                                                {slot.priority_level ? getPriorityLabel(slot.priority_level) : 'Time:'}
                                                            </span>
                                                            <span className="text-white bg-neutral-03 border border-[#FFFFFF1A] px-3 py-1.5 rounded-lg w-[80px] text-center inline-block shadow-sm font-mono">
                                                                {format(new Date(slot.requested_start_time), 'h:mm a')}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Reason Section for WL or Admin-Request Rejection */}
                                    {type === 'Rejected' && rejectionReason && (
                                        <div className="flex flex-col gap-2 mt-2">
                                            <span className="text-gray-400 text-sm">Reason</span>
                                            <div
                                                className="p-4 rounded-lg text-sm text-gray-300"
                                                style={{
                                                    borderRadius: '8px',
                                                    border: '0.5px solid rgba(255, 255, 255, 0.05)',
                                                    background: 'rgba(255, 255, 255, 0.03)'
                                                }}
                                            >
                                                {rejectionReason}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Actions Footer */}
                            <div className="flex gap-2 pt-2">
                                {type === 'Scheduled' && (
                                    <div className='flex flex-row gap-2 w-full'>
                                        <Button
                                            className="flex-1 text-sm h-[30px] px-4 py-1.5 rounded-full"
                                            disabled={isCancelling}
                                            onClick={(e: any) => {
                                                e.stopPropagation()
                                                onCancel?.()
                                            }}
                                        >
                                            {isCancelling ? <PageLoader size={14} /> : <span className="flex items-center gap-2">Cancel <X size={14} /></span>}
                                        </Button>
                                        <Button
                                            className="flex-1 text-sm h-[30px] px-4 py-1.5 rounded-full"
                                            disabled={isEditLoading}
                                            onClick={(e: any) => {
                                                e.stopPropagation()
                                                onEdit?.(primary.requested_start_time)
                                            }}
                                        >
                                            <span className="flex items-center gap-2">Edit <EditPencilSvg className="w-3.5 h-3.5" /></span>
                                        </Button>
                                    </div>
                                )}
                                {type === 'Concluded' && (
                                    <button className="flex-1 bg-[#222] text-gray-300 text-xs py-2 rounded-lg border border-[#333] flex items-center justify-center gap-2 hover:bg-[#2a2a2a] transition-colors">
                                        <FileText size={14} /> View Summary
                                    </button>
                                )}
                                {type === 'Request' && (
                                    <div className='flex flex-col gap-2 w-full'>
                                        <Button
                                            className="w-full h-[30px]"
                                            disabled={isCancelling}
                                            onClick={(e: any) => {
                                                e.stopPropagation()
                                                onCancel?.()
                                            }}
                                        >
                                            {isCancelling ? <PageLoader size={14} /> : <span className="flex items-center justify-center gap-2">Reject <X size={16} /></span>}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
