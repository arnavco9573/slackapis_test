"use client"

import React, { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import CertificatePreviewModal from "./certificate-preview-modal"

export interface Certificate {
    id: string
    title: string
    milestone: string
    date: string
    category: string
    previewUrl?: string
}

interface CertificateCardProps {
    certificate: Certificate
}

export default function CertificateCard({ certificate }: CertificateCardProps) {
    const [showPreview, setShowPreview] = useState(false)
    return (
        <div className="flex flex-col gap-6 p-6 bg-neutral-03 rounded-xl w-full">
            {/* Certificate Preview Area */}
            <div
                className="relative w-full aspect-175/215 rounded-lg overflow-hidden flex items-center justify-center border border-white/5 group cursor-pointer"
                onClick={() => setShowPreview(true)}
            >
                {certificate.previewUrl ? (
                    <Image
                        src={certificate.previewUrl}
                        alt={certificate.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 p-8 text-center transition-transform group-hover:scale-105">
                        {/* This matches the visual style in the screenshot */}
                        <div className="text-[#FBBF24] text-xl font-bold italic">Ryans_Analysis</div>
                        <div className="h-px w-24 bg-white/20 my-4" />
                        <div className="text-white/60 text-[10px] uppercase tracking-widest">Proudly presented to:</div>
                    </div>
                )}
            </div>

            {/* Certificate Details */}
            <div className="flex flex-col gap-1">
                <h3
                    className="text-white text-[20px] font-medium leading-[24px]"
                >
                    {certificate.title}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[#888] text-[14px] font-medium leading-[18px]">Milestone:</span>
                        <span className="text-white text-[14px] font-medium leading-[18px]">{certificate.milestone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[#888] text-[14px] font-medium leading-[18px]">Date:</span>
                        <span className="text-white text-[14px] font-medium leading-[18px]">{certificate.date}</span>
                    </div>
                </div>
            </div>

            <CertificatePreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                certificateId={certificate.id}
                title={certificate.title}
                category={certificate.category}
                previewUrl={certificate.previewUrl}
                isLocked={false}
                certificateData={{
                    milestone: certificate.milestone,
                    date: certificate.date
                }}
            />
        </div>
    )
}
