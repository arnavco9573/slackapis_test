'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { ChevronRight, Loader2 } from 'lucide-react'
import Button from '@/components/core/button'
import InputField from '@/components/core/input-field'
import { useSyncStore } from '../../stores/useSyncStore'
import { cn } from '@/lib/utils'
import SearchSvg from '@/components/svg/search'
import { Checkbox } from '@/components/ui/checkbox'
import { updateTeamMemberStatus } from '../../actions/updateTeamMemberStatus'
import { toast } from 'sonner'
import ArrowSvg from '@/components/svg/arrow'

export default function StepReview() {
    const { setStep, members, setMembers } = useSyncStore()
    const [search, setSearch] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.workspace_email.toLowerCase().includes(search.toLowerCase())
    )

    const toggleSelection = (id: string) => {
        // Update store immediately
        const updatedMembers = members.map(m =>
            m.id === id ? { ...m, is_active: !m.is_active } : m
        )
        setMembers(updatedMembers)
    }

    const handleNext = async () => {
        setIsSaving(true)
        try {
            // Persist all member statuses to DB
            const updates = members.map(m => updateTeamMemberStatus(m.id, !!m.is_active))
            await Promise.all(updates)

            setStep('color')
        } catch (error) {
            console.error('Failed to save selections', error)
            toast.error('Failed to save selections')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex flex-col h-full bg-card section-border rounded-xl overflow-hidden max-w-[550px] w-full max-h-[570px] p-6 mt-29">
            <h2 className="text-xl font-medium text-white mb-6">Select team calendars to display</h2>

            <div className="mb-6">
                <InputField
                    id="search-members"
                    name="search"
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    startAdornment={<SearchSvg className="text-gray-500 size-6" />}
                    inputClassName='h-[40px] justify-center pl-12'
                />
            </div>

            <p className="text-sm text-gray-500 mb-4">{filteredMembers.length} members</p>

            <div className="flex-1 overflow-y-auto min-h-[300px] -mx-2 px-2 custom-scrollbar">
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                >
                    {filteredMembers.map(member => {
                        const isSelected = !!member.is_active
                        return (
                            <div
                                key={member.id}
                                onClick={() => toggleSelection(member.id)}
                                className={cn(
                                    "flex h-[48px] items-center justify-between p-3 rounded-xl cursor-pointer transition-colors",
                                    "hover:bg-neutral-03",
                                    "bg-neutral-03"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {member.avatar_url ? (
                                        <img
                                            src={member.avatar_url}
                                            alt={member.name}
                                            className="w-8 h-8 rounded-full object-cover border border-[#333]"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-neutral-03 flex items-center justify-center text-sm font-medium text-white border border-[#333]">
                                            {member.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-sm font-medium text-white">{member.name}</div>
                                        <div className="text-xs text-gray-500">{member.workspace_email}</div>
                                    </div>
                                </div>

                                <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => toggleSelection(member.id)}
                                    className="rounded-[2.286px] border-[0.286px] border-[#636363] data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-black"
                                    style={{
                                        background: isSelected
                                            ? 'white'
                                            : 'linear-gradient(0deg, var(--Neutrals-10, rgba(255, 255, 255, 0.10)) -0.21%, var(--Neutrals-01, rgba(255, 255, 255, 0.01)) 105.1%)'
                                    }}
                                />
                            </div>
                        )
                    })}
                </motion.div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#262626] flex justify-end">
                <Button onClick={handleNext} disabled={isSaving} className='w-full'>
                    {isSaving ? <Loader2 className="animate-spin" /> : <>Next Step <ArrowSvg className='size-4' /></>}
                </Button>
            </div>
        </div>
    )
}
