'use client'

import React from 'react'
import { AnimatePresence } from 'motion/react'
import { useSyncStore } from '../stores/useSyncStore'
import StepSync from './steps/StepSync'
import StepReview from './steps/StepReview'
import StepColor from './steps/StepColor'

export default function SyncOverlay({ masterId, onComplete }: { masterId: string, onComplete: () => void }) {
    const { step } = useSyncStore()

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <AnimatePresence mode='wait'>
                {step === 'init' && <StepSync key="init" masterId={masterId} />}

                {step === 'review' && (
                    <div key="review" className="absolute inset-0 flex items-center justify-center p-4 mt-16">
                        <StepReview />
                    </div>
                )}

                {step === 'color' && (
                    <div key="color" className="absolute inset-0 z-50 flex items-center justify-center p-4 mt-16">
                        <StepColor onComplete={onComplete} />
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
