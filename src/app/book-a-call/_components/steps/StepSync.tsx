'use client'

import React from 'react'
import { Calendar } from 'lucide-react'
import GoogleIcon from '@/components/svg/GoogleIcon'
import EllipseBlurSvg from '@/components/svg/ellipse-blur'
import Button from '@/components/core/button'
import { useSyncStore } from '../../stores/useSyncStore'
import { syncTeamMembers } from '../../actions/syncTeamMembers'
import { toast } from 'sonner'

interface StepSyncProps {
    masterId: string
}

export default function StepSync({ masterId }: StepSyncProps) {
    const { setLoading, setStep, setMembers, isLoading } = useSyncStore()

    const handleSync = async () => {
        setLoading(true)
        try {
            const result = await syncTeamMembers(masterId)
            if (result.success && result.members) {
                setMembers(result.members)
                setStep('timezone')
                toast.success(`Found ${result.count} team members!`)
            } else {
                toast.error(result.message || "Failed to sync")
            }
        } catch (error) {
            toast.error("An error occurred during sync")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="flex flex-col items-center text-center w-[400px] p-8 bg-card section-border rounded-2xl">
                {/* Google Icon Container */}
                <div className="relative mb-6">
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150'>
                        <EllipseBlurSvg className='text-white size-36' />
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center relative z-10 bg-[#262626] rounded-xl border border-[#333]">
                        <GoogleIcon width={24} height={24} />
                    </div>
                </div>

                <h2 className="text-xl font-medium text-white mb-2">Sync your Google workspace</h2>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed px-4">
                    Sync your Google Workspace to manage calendars and call request across your team.
                </p>

                <Button
                    onClick={handleSync}
                    disabled={isLoading}
                    className="w-full text-sm py-2.5"
                >
                    {isLoading ? 'Connecting...' : 'Connect Google Calendar'}
                </Button>
            </div>
        </div>
    )
}
