"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X, ZoomIn, ZoomOut, Download, Share2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
// import ChipBordered from "@/components/core/chip-bordered"
/* ChipBordered dummy implementation if missing or for now */
const ChipBordered = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("border border-white/20 rounded-full px-3 py-1 text-white/80 text-xs", className)}>
        {children}
    </div>
)

/* Dummy components for missing imports */
const DownloadDropdown = ({ onDownloadImage, onDownloadPdf }: any) => (
    <button onClick={onDownloadImage} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white">
        <Download className="w-4 h-4" />
    </button>
)


interface CertificatePreviewModalProps {
    isOpen: boolean
    onClose: () => void
    certificateId: string
    title: string
    category: string
    previewUrl?: string
    isLocked?: boolean
    certificateData?: {
        milestone: string
        date: string
    }
}

const CertificatePreviewModal = ({
    isOpen,
    onClose,
    certificateId,
    title,
    category,
    previewUrl,
    isLocked = false,
    certificateData,
}: CertificatePreviewModalProps) => {
    const [zoom, setZoom] = useState(100)

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 10, 200))
    }

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 10, 50))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-screen max-h-screen w-full h-full p-0 bg-neutral-03 border-none"
                hideClose
                overlayClassName="bg-neutral-03 backdrop-blur-2xl"
            >
                <DialogTitle className="sr-only">{title}</DialogTitle>
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-linear-to-b from-black/40 to-transparent">
                    {/* Left: Certificate Info */}
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
                            <svg
                                width="14"
                                height="16"
                                viewBox="0 0 14 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8.5 0.5H2C1.17157 0.5 0.5 1.17157 0.5 2V14C0.5 14.8284 1.17157 15.5 2 15.5H12C12.8284 15.5 13.5 14.8284 13.5 14V5.5L8.5 0.5Z"
                                    fill="white"
                                    fillOpacity="0.6"
                                />
                                <path d="M8.5 0.5V5.5H13.5" stroke="white" strokeOpacity="0.4" />
                            </svg>
                        </div>
                        <span className="text-white text-[18px] font-normal">{title}</span>
                    </div>

                    {/* Center: Category Chip */}
                    <div className="flex items-center justify-center flex-1">
                        <ChipBordered className="text-(--Primary-500) font-normal px-3 py-1 h-auto text-sm">
                            {category}
                        </ChipBordered>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                        {!isLocked && (
                            <DownloadDropdown
                                onDownloadImage={() => console.log("Download Image", certificateId)}
                                onDownloadPdf={() => console.log("Download PDF", certificateId)}
                            />
                        )}
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all ml-2"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="flex items-center justify-center w-full h-full px-6 py-6 scrollbar-hide overflow-auto">
                    <div
                        className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
                        style={{
                            width: "60%",
                            maxWidth: "calc(100vw - 100px)",
                            maxHeight: "calc(100vh - 200px)",
                            aspectRatio: "1.25/1",
                            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(255, 255, 255, 0.05)",
                        }}
                    >
                        <div
                            className="relative w-full h-full"
                            style={{
                                transform: `scale(${zoom / 100})`,
                                transformOrigin: "center center",
                                transition: "transform 0.2s ease-out",
                            }}
                        >
                            {previewUrl ? (
                                <Image src={previewUrl} alt={title} fill className="object-contain" />
                            ) : (
                                <div className="w-full h-full bg-linear-to-br from-[#0A2540] to-[#1D4ED8] flex flex-col items-center justify-center p-8 text-center">
                                    <div className="text-[#FBBF24] text-4xl font-bold italic">Ryans_Analysis</div>
                                    <div className="h-px w-48 bg-white/20 my-8" />
                                    <div className="text-white/60 text-lg uppercase tracking-widest">
                                        Proudly presented to:
                                    </div>
                                </div>
                            )}

                            {isLocked && (
                                <div
                                    className="absolute inset-0 z-10 flex items-center justify-center"
                                    style={{
                                        background:
                                            "linear-gradient(180deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.00) 45.67%, rgba(0, 0, 0, 0.37) 100%)",
                                        backdropFilter: "blur(7.2px)",
                                    }}
                                >
                                    {/* Using a lucid lock icon or similar since lock.png might be missing */}
                                    <div className="text-white">Locked</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-center px-6 py-6 ">
                    <div className="flex items-center gap-4 bg-[#1D1E21] section-border rounded-full px-4 py-2">
                        <button
                            onClick={handleZoomOut}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
                            disabled={zoom <= 50}
                        >
                            <ZoomOut className="w-4 h-4 text-white" />
                        </button>

                        <div className="w-12 h-8 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">{zoom}%</span>
                        </div>

                        <button
                            onClick={handleZoomIn}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
                            disabled={zoom >= 200}
                        >
                            <ZoomIn className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CertificatePreviewModal
