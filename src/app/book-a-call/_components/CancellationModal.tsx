'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Button from '@/components/core/button'
import TextareaField from '@/components/core/textarea-field'
import { ArrowLeft, X } from 'lucide-react'
import PageLoader from '@/components/svg/page-loading'
import ArrowSvg from '@/components/svg/arrow'

type CancellationModalProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (reason: string, shouldSendEmail: boolean) => void
    isLoading: boolean
    isScheduled: boolean
}

export default function CancellationModal({
    isOpen,
    onOpenChange,
    onConfirm,
    isLoading,
    isScheduled
}: CancellationModalProps) {
    const [reason, setReason] = useState('')

    const handleSubmit = () => {
        // "Send" -> Send Email = true
        onConfirm(reason, true)
        setReason('')
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-03 backdrop-blur-2xl p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-[500px] flex flex-col gap-6 p-6 rounded-xl bg-[#1D1E21] border border-[#FFFFFF1A]" // section-border style approximated/referenced
                        style={{
                            backgroundColor: '#1C1C1C', // Fallback/Main bg
                            boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.4)'
                        }}
                    >
                        {/* Header */}
                        <div className="flex flex-col gap-2 relative">
                            <button
                                onClick={() => onOpenChange(false)}
                                className="absolute -top-2 -right-2 text-gray-500 hover:text-white transition-colors p-2"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="text-xl font-normal text-white leading-relaxed pr-8">
                                {isScheduled
                                    ? "Would you like to send cancellation emails to Google calendar of the guest?"
                                    : "Reject Booking Request"
                                }
                            </h3>
                            {!isScheduled && (
                                <p className="text-sm text-gray-400">
                                    Please provide a reason for rejecting this request.
                                </p>
                            )}
                        </div>

                        {/* Body */}
                        <div className="flex flex-col gap-1 w-full">
                            <TextareaField
                                id="cancellation-reason"
                                name="reason"
                                placeholder={isScheduled ? "Add message (Optional)" : "Reason for rejection"}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={4}
                                wrapperClassName="w-full"
                                inputClassName="bg-[rgba(255,255,255,0.03)] border-[0.5px] border-[rgba(255,255,255,0.05)] rounded-lg"
                            />
                            <div className="text-[10px] text-[#666] text-right w-full flex justify-end">
                                {reason.length}/2,400
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between w-full pt-2 px-2">
                            <button
                                onClick={() => onOpenChange(false)}
                                className="text-sm text-white hover:text-gray-300 transition-colors"
                            >
                                Back to Editing
                            </button>

                            <div className="flex items-center gap-4">
                                {isScheduled && (
                                    <button
                                        onClick={() => {
                                            // "Don't Send" -> Send Email = false
                                            onConfirm(reason, false)
                                            setReason('')
                                        }}
                                        className="text-sm text-white hover:text-gray-300 transition-colors"
                                    >
                                        Don't Send
                                    </button>
                                )}
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="h-[40px] px-6 rounded-full bg-[#333] border border-[#444] text-white hover:bg-[#444]" // Adjusting to look like image's primary button
                                >
                                    {isLoading ? <><PageLoader size={16} /></> : <p className="flex items-center gap-2">{isScheduled ? 'Send' : 'Reject'} <ArrowSvg /></p>}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
