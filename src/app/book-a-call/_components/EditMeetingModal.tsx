'use client'

import React, { useState, useMemo } from 'react'
import { X, Search, Check, Mail, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { isSameHour } from 'date-fns'
import Button from '@/components/core/button'
import ArrowSvg from '@/components/svg/arrow'
import InputField from '@/components/core/input-field'
import TextareaField from '@/components/core/textarea-field'
import { cn } from '@/lib/utils'
import PageLoader from '@/components/svg/page-loading'

interface TeamMember {
    id: string
    name: string
    workspace_email: string
    color: string | null
    profile_picture?: string
}

interface EditMeetingModalProps {
    isOpen: boolean
    onClose: () => void
    event: any // The booking/event object
    teamMembers: TeamMember[]
    teamSchedules?: any[] // Schedules for the event's day
    onSave: (data: { title: string, description: string, memberId: string }) => Promise<void>
    isSaving: boolean
    isLoadingSchedules?: boolean
    timezone?: string
}

export default function EditMeetingModal({
    isOpen,
    onClose,
    event,
    teamMembers,
    teamSchedules = [],
    onSave,
    isSaving,
    isLoadingSchedules = false,
    timezone = 'UTC'
}: EditMeetingModalProps) {
    const [title, setTitle] = useState(event?.title || '')
    const [description, setDescription] = useState(event?.description || '')
    const [selectedMemberId, setSelectedMemberId] = useState(event?.memberId || event?.assigned_team_member_id || '')
    const [showMemberList, setShowMemberList] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const selectedMember = useMemo(() =>
        teamMembers.find(m => m.id === selectedMemberId),
        [teamMembers, selectedMemberId]
    )

    const filteredMembers = useMemo(() =>
        teamMembers.filter(m =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.workspace_email.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [teamMembers, searchQuery]
    )

    if (!isOpen) return null

    const startTime = event?.start instanceof Date ? event.start : new Date(event?.start?.dateTime || event?.requested_start_time || new Date())

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

    const isMemberAvailable = (memberId: string) => {
        if (!teamSchedules.length) return true
        const schedule = teamSchedules.find(s => s.id === memberId || s.email === mIdToEmail(memberId))
        if (!schedule || !schedule.events) return true

        return !schedule.events.some((e: any) => {
            if (!e.start?.dateTime) return false
            const eventStart = new Date(e.start.dateTime)

            const evtDay = formatInTZ(eventStart, 'd MMM yyyy')
            const slotDay = formatInTZ(startTime, 'd MMM yyyy')
            const { hour: evtHour } = getTZParts(eventStart)
            const { hour: slotHour } = getTZParts(startTime)

            return evtDay === slotDay && evtHour === slotHour
        })
    }

    function mIdToEmail(id: string) {
        return teamMembers.find(m => m.id === id)?.workspace_email
    }

    const handleSave = async () => {
        await onSave({
            title,
            description,
            memberId: selectedMemberId
        })
    }

    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-neutral-03 backdrop-blur-2xl" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-[540px] bg-[#1D1E21] backdrop-blur-[10px] p-6 flex flex-col gap-6 relative"
                style={{
                    borderRadius: '12px',
                    boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-[28px] font-normal text-white leading-tight">Edit Meeting</h2>
                    <button onClick={onClose} className="text-(--Primary-600) hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Subject */}
                    <InputField
                        id="meeting-subject"
                        name="title"
                        label="Subject"
                        placeholder="Onboarding Orientation"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        inputClassName="!h-[56px] justify-center"
                    />

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                        <TextareaField
                            id="meeting-description"
                            name="description"
                            placeholder="An introductory orientation meeting..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            inputClassName="justify-start !h-[156px]"
                        />
                        <div className="flex justify-start">
                            <span className="text-[10px] text-[#888]">{description.length}/500</span>
                        </div>
                    </div>

                    {/* Gradient Separator */}
                    <div
                        className="h-px w-full"
                        style={{ background: 'linear-gradient(90deg, #1A1B1E 0%, #3F4042 50.25%, #1A1B1E 100%)' }}
                    />

                    {/* Change Admin Section */}
                    <div className="flex flex-col gap-4">
                        <span className="text-sm font-normal text-[#888]">Change Admin</span>

                        <div className="relative" onBlur={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget)) {
                                setShowMemberList(false)
                            }
                        }}>
                            <InputField
                                id="admin-search"
                                name="admin-search"
                                type="text"
                                label="Type In Name Or E- Mail"
                                placeholder=""
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setShowMemberList(true)
                                }}
                                onFocus={() => setShowMemberList(true)}
                                inputClassName="!h-[56px] !px-4 !py-3"
                            />

                            {/* Member Dropdown */}
                            <AnimatePresence>
                                {showMemberList && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-[#1A1B1E] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl max-h-[240px] overflow-y-auto custom-scrollbar"
                                    >
                                        {filteredMembers.map(member => {
                                            const available = isMemberAvailable(member.id)
                                            return (
                                                <button
                                                    key={member.id}
                                                    onClick={() => {
                                                        setSelectedMemberId(member.id)
                                                        setShowMemberList(false)
                                                        setSearchQuery('')
                                                    }}
                                                    className={cn(
                                                        "w-full flex items-center justify-between p-3 transition-colors group",
                                                        available ? "hover:bg-system-positive/10" : "hover:bg-system-negative/10"
                                                    )}
                                                    style={{
                                                        background: available ? 'rgba(109, 171, 156, 0.04)' : 'rgba(255, 83, 83, 0.04)'
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            {member.profile_picture ? (
                                                                <Image src={member.profile_picture} alt={member.name} width={32} height={32} className="rounded-full" />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: member.color || '#333' }}>
                                                                    {member.name[0]}
                                                                </div>
                                                            )}
                                                            <div className={cn(
                                                                "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#1D1E21]",
                                                                available ? "bg-system-positive" : "bg-system-negative"
                                                            )} />
                                                        </div>
                                                        <div className="flex flex-col items-start">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-white text-sm font-medium">{member.name}</span>
                                                                {!available && <span className="text-system-negative text-[10px] font-medium uppercase px-1.5 py-0.5 rounded bg-system-negative/10">Busy</span>}
                                                            </div>
                                                            <span className="text-gray-500 text-xs">{member.workspace_email}</span>
                                                        </div>
                                                    </div>
                                                    <div className={cn(
                                                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                                        selectedMemberId === member.id ? "bg-[#333] border-white/20" : "border-white/10"
                                                    )}>
                                                        {selectedMemberId === member.id && <Check size={12} className="text-white" />}
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Selected Admin Display */}
                        {selectedMember && (
                            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    {selectedMember.profile_picture ? (
                                        <Image src={selectedMember.profile_picture} alt={selectedMember.name} width={32} height={32} className="rounded-full" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: selectedMember.color || '#333' }}>
                                            {selectedMember.name[0]}
                                        </div>
                                    )}
                                    <span className="text-white text-sm">{selectedMember.name} (WL Partner)</span>
                                </div>
                                <button
                                    onClick={() => setSelectedMemberId('')}
                                    className="text-gray-500 hover:text-white transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center gap-10 mt-4">
                    <Button
                        onClick={onClose}
                        className="text-white text-base bg-none! bg-transparent! border-none! hover:bg-none! hover:bg-transparent! hover:border-none! "
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !title || !selectedMemberId}
                        className="h-[40px] px-6! py-2.5! w-[172px]"
                    >
                        {isSaving ? <PageLoader size={24} /> : <div className="flex items-center gap-2">Save <ArrowSvg /></div>}
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}
