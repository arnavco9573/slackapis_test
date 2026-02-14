"use client"

import React from "react"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import Button from "@/components/core/button"
import WarningTriangleSvg from "@/components/svg/warning-triangle"
import EllipseBlurSvg from "@/components/svg/ellipse-blur"

interface DiscardCategoryModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

const DiscardCategoryModal = ({
    isOpen,
    onClose,
    onConfirm,
}: DiscardCategoryModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="max-w-[420px] bg-card p-0 overflow-hidden rounded-[12px] border-none shadow-2xl"
                overlayClassName="bg-neutral-01 backdrop-blur-2xl"
                hideClose
            >
                <div className="relative flex flex-col items-center p-6 gap-0">
                    {/* Icon Container with Blur Background */}
                    <div className="relative mb-8 flex items-center justify-center">
                        <EllipseBlurSvg className="absolute inset-0 size-[240px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                        <div
                            className="relative size-16 flex items-center justify-center z-10"
                            style={{
                                borderRadius: "12px",
                                border: "0.5px solid var(--Primary-700, #636363)",
                                background: "var(--System-GR-Neutral-10-01, linear-gradient(0deg, rgba(255, 255, 255, 0.10) -0.21%, rgba(255, 255, 255, 0.01) 105.1%))"
                            }}
                        >
                            <WarningTriangleSvg className="size-6 text-white" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 mb-12 text-center">
                        <p className="text-[18px] font-normal text-white/60 leading-[26px]">
                            Are you sure you discard <br /> created document category
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-4 w-full px-4">
                        <Button
                            className="flex-1 bg-transparent! bg-none! border-none! text-white"
                            onClick={onClose}
                        >
                            No
                        </Button>
                        <Button
                            className="flex-1 h-[48px] rounded-full"
                            onClick={() => {
                                onConfirm()
                                onClose()
                            }}
                        >
                            Yes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DiscardCategoryModal
