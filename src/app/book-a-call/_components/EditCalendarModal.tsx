'use client'

import React, { useState } from 'react'
import Button from '@/components/core/button'
import { useSyncStore } from '../stores/useSyncStore'
import ModalStepReview from './modal/ModalStepReview'
import ModalStepColor from './modal/ModalStepColor'
import { syncTeamMembers } from '../actions/syncTeamMembers'
import { updateTeamMemberColor } from '../actions/updateTeamMemberColor'
import { updateTeamMemberStatus } from '../actions/updateTeamMemberStatus'
import { fetchAllTeamMembers } from '../actions/fetchAllTeamMembers'
import { toast } from 'sonner'
import PageLoader from '@/components/svg/page-loading'
import { RefreshSvg } from '@/components/svg/refresh'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

interface EditCalendarModalProps {
    isOpen: boolean
    onClose: () => void
    masterId: string
    onSave: () => void
}

export default function EditCalendarModal({ isOpen, onClose, masterId, onSave }: EditCalendarModalProps) {
    const { step, setStep, members, setMembers } = useSyncStore()
    const [isSyncing, setIsSyncing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isLoadingMembers, setIsLoadingMembers] = useState(false)

    // Reset step and fetch members on open
    React.useEffect(() => {
        if (isOpen) {
            setStep('review')

            const loadMembers = async () => {
                setIsLoadingMembers(true)
                try {
                    const result = await fetchAllTeamMembers(masterId)
                    if (result.success) {
                        setMembers(result.data)
                    }
                } catch (error) {
                    console.error('Failed to load members', error)
                } finally {
                    setIsLoadingMembers(false)
                }
            }
            loadMembers()
        }
    }, [isOpen, masterId, setStep, setMembers])

    const handleSync = async () => {
        setIsSyncing(true)
        try {
            const result = await syncTeamMembers(masterId)
            if (result.success) {
                setMembers(result.members || [])
                toast.success('Team members synced successfully')
            } else {
                toast.error(result.message || 'Failed to sync team members')
            }
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSyncing(false)
        }
    }

    const handleNext = async () => {
        if (step === 'review') {
            // Save member selections before moving to color step
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
        } else {
            handleSave()
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Save color selections if on color step
            if (step === 'color') {
                // Update member status and colors
                for (const member of members) {
                    // Update Active Status
                    if (typeof member.is_active !== 'undefined') {
                        const statusResult = await updateTeamMemberStatus(member.id, member.is_active)
                        if (!statusResult.success) {
                            console.error(`Failed to update status for ${member.name}`)
                        }
                    }

                    // Update Color
                    if (member.color) {
                        const result = await updateTeamMemberColor(member.id, member.color!)
                        if (!result.success) {
                            toast.error(`Failed to save color for ${member.name}`)
                            setIsSaving(false)
                            return
                        }
                    }
                }
            }

            toast.success('Calendar settings saved')
            onSave()
            onClose()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSaving(false)
        }
    }

    const handleBack = () => {
        if (step === 'color') {
            setStep('review')
        }
    }

    const handleComplete = () => {
        handleSave()
    }

    const handleClose = () => {
        setStep('review')
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-03 backdrop-blur-2xl">
            <AnimatePresence mode="wait">
                {step === 'review' ? (
                    <motion.div
                        key="review"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col relative"
                        style={{
                            display: 'flex',
                            width: '438px',
                            height: '397px',
                            padding: '24px',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '24px',
                            borderRadius: '12px',
                            background: '#1A1B1E',
                            boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center w-full">
                            <h3 className="text-lg font-normal text-white">Select team calendars to display</h3>
                            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 w-full overflow-hidden flex flex-col">
                            <ModalStepReview />
                        </div>

                        {/* Footer */}
                        <div className="flex w-full justify-end gap-3 items-center">
                            <Button
                                onClick={handleSync}
                                disabled={isSyncing}
                                className="text-sm h-9 px-4 bg-neutral-03 hover:bg-neutral-05 text-white"
                            >
                                {isSyncing ? <PageLoader size={14} /> : <>Sync <RefreshSvg className="size-4 ml-1" /></>}
                            </Button>
                            <Button
                                onClick={handleNext}
                                disabled={isSaving}
                                className="text-sm h-9 px-4"
                            >
                                {isSaving ? <PageLoader size={14} /> : 'Add Calendars'}
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="color"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-[495px] bg-[#1A1B1E] section-border rounded-xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 pb-0 flex items-center justify-between">
                            <h2 className="text-xl font-medium text-white">
                                Edit team calendars to display
                            </h2>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-03 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 max-h-[600px] overflow-y-auto">
                            <ModalStepColor onComplete={handleComplete} />
                        </div>

                        {/* Footer */}
                        <div className="p-6 pt-0 flex justify-center items-center w-full">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="text-sm h-10 px-6 w-full max-w-[438px] rounded-full"
                            >
                                {isSaving ? <PageLoader size={14} /> : 'Add Calendars'}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
