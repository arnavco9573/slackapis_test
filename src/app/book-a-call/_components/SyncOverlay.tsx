'use client'

import React from 'react'
import { AnimatePresence } from 'motion/react'
import { useSyncStore } from '../stores/useSyncStore'
import StepSync from './steps/StepSync'
import StepReview from './steps/StepReview'
import StepColor from './steps/StepColor'
import StepTimeZone from './steps/StepTimeZone'
import StepAvailability from './steps/StepAvailability'

export default function SyncOverlay({ masterId, onComplete }: { masterId: string, onComplete: () => void }) {
    const { step } = useSyncStore()

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <AnimatePresence mode='wait'>
                {step === 'init' && <StepSync key="init" masterId={masterId} />}

                {step === 'timezone' && (
                    <div key="timezone" className="absolute inset-0 flex items-center justify-center p-4">
                        <StepTimeZone />
                    </div>
                )}

                {step === 'availability' && (
                    <div key="availability" className="absolute inset-0 flex items-center justify-center p-4">
                        <StepAvailability />
                    </div>
                )}

                {step === 'review' && (
                    <div key="review" className="absolute inset-0 flex items-center justify-center p-4">
                        <StepReview />
                    </div>
                )}

                {step === 'color' && (
                    <div key="color" className="absolute inset-0 z-50 flex items-center justify-center p-4">
                        <StepColor masterId={masterId} onComplete={onComplete} />
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
