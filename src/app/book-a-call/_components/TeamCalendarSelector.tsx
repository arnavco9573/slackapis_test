'use client'

import React, { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import Button from '@/components/core/button'
import EditPencilSvg from '@/components/svg/edit-pencil'
import Image from 'next/image'

interface TeamMember {
    id: string
    name: string
    workspace_email: string
    color: string | null
    avatar_url?: string | null
}

interface TeamCalendarSelectorProps {
    members: TeamMember[]
    selectedMemberIds: string[]
    onSelectionChange: (memberIds: string[]) => void
    onEditClick: () => void
    isLoading?: boolean
}

// Helper to convert hex to rgba for the gradient
const hexToRgba = (hex: string, alpha: number) => {
    if (!hex) return `rgba(136, 136, 136, ${alpha})`

    let r = 0, g = 0, b = 0
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16)
        g = parseInt(hex[2] + hex[2], 16)
        b = parseInt(hex[3] + hex[3], 16)
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16)
        g = parseInt(hex.substring(3, 5), 16)
        b = parseInt(hex.substring(5, 7), 16)
    }
    return `rgba(${r},${g},${b},${alpha})`
}

const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
}

export default function TeamCalendarSelector({
    members,
    selectedMemberIds,
    onSelectionChange,
    onEditClick,
    isLoading = false
}: TeamCalendarSelectorProps) {

    const handleToggleMember = (memberId: string) => {
        if (selectedMemberIds.includes(memberId)) {
            onSelectionChange(selectedMemberIds.filter(id => id !== memberId))
        } else {
            onSelectionChange([...selectedMemberIds, memberId])
        }
    }

    const handleSelectAll = () => {
        if (selectedMemberIds.length === members.length) {
            onSelectionChange([])
        } else {
            onSelectionChange(members.map(m => m.id))
        }
    }

    const allSelected = selectedMemberIds.length === members.length && members.length > 0

    return (
        <div className='bg-card section-border p-4'>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-normal text-white">Team Calendar</h2>
                    <button
                        onClick={handleSelectAll}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                        {allSelected ? 'Deselect All' : 'Select All'}
                    </button>
                </div>
                <Button
                    onClick={onEditClick}
                    className="text-sm h-8 px-3 py-1.5"
                >
                    Edit Calendar <EditPencilSvg className="size-3" />
                </Button>
            </div>

            {/* Member Grid */}
            <div className="grid grid-cols-3 gap-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                {isLoading ? (
                    // Skeleton Loader
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-neutral-05 rounded-[4px] p-2 flex items-center gap-2 animate-pulse h-[48px]">
                            <div className="w-8 h-8 rounded-full bg-[#333] shrink-0" />
                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                                <div className="h-3 w-20 bg-[#333] rounded" />
                                <div className="h-2 w-16 bg-[#333] rounded" />
                            </div>
                        </div>
                    ))
                ) : (
                    members.map((member) => {
                        const isSelected = selectedMemberIds.includes(member.id)

                        return (
                            <div
                                key={member.id}
                                onClick={() => handleToggleMember(member.id)}
                                className="bg-neutral-05 rounded-[4px] p-2 flex items-center gap-2 cursor-pointer hover:bg-neutral-03 transition-colors relative overflow-hidden"
                            >
                                {/* Avatar */}
                                <div className="shrink-0">
                                    {member.avatar_url ? (
                                        <Image
                                            src={member.avatar_url}
                                            alt={member.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                            width={32}
                                            height={32}
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-white text-xs font-medium">
                                            {getInitials(member.name)}
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {member.name}
                                    </p>
                                    <p className="text-[10px] text-gray-400 truncate">
                                        {member.workspace_email}
                                    </p>
                                </div>

                                {/* Checkbox */}
                                <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => handleToggleMember(member.id)}
                                        className="w-4 h-4 border-[#636363] data-[state=checked]:text-white"
                                        style={{
                                            background: (isSelected && member.color)
                                                ? `linear-gradient(180deg, ${member.color} 0%, ${hexToRgba(member.color, 0.5)} 100%)`
                                                : undefined,
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Empty State */}
            {!isLoading && members.length === 0 && (
                <div className="text-center py-4 text-gray-400 text-xs">
                    No team members selected. Click "Edit Calendar" to add members.
                </div>
            )}
        </div>
    )
}
