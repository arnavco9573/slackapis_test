"use client"

import React from "react"
import ChipFilled from "@/components/core/chip-filled"
import ChipBordered from "@/components/core/chip-bordered"
import FolderSvg from "@/components/svg/folder"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Button from "@/components/core/button"
import DownloadSvg from "@/components/svg/download"

interface CabinetDocumentCardProps {
    partnerName: string
    documentName: string
    date: string
    category: string
    marketType: string
    thumbnailUrl?: string
    className?: string
    onClick?: () => void
}

const CabinetDocumentCard = ({
    partnerName,
    documentName,
    date,
    category,
    marketType,
    thumbnailUrl,
    className,
    onClick
}: CabinetDocumentCardProps) => {
    return (
        <div
            className={cn(
                "bg-card section-border p-6 h-[440px] flex flex-col group relative cursor-pointer hover:border-white/20 transition-all",
                className
            )}
            onClick={onClick}
        >
            {/* Top Bar: Date and Download */}
            <div className="flex items-center justify-between mb-4">
                <ChipFilled className="text-white/60 bg-white/5 border border-white/5 font-normal h-auto text-xs leading-4 px-4 py-2">
                    {date}
                </ChipFilled>
                <Button
                    onClick={(e) => {
                        e.stopPropagation()
                        // Handle download
                        console.log("Download clicked")
                        window.alert("Download functionality not implemented")
                    }}
                    className="px-4! py-2! h-[34px] rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
                >
                    <DownloadSvg className="size-5 text-white" />
                </Button>
            </div>

            {/* Preview Area (Folder/Image) */}
            <div className="relative w-[280px] h-[220px] mx-auto mt-auto mb-8">
                {/* Blurred Background - Absolute behind the folder */}
                <div
                    className="absolute left-1 top-2 inset-0 overflow-hidden section-border w-[270px]"
                    style={{
                        borderRadius: "12.326px",
                        background: "rgba(255, 255, 255, 0.01)",
                        backdropFilter: "blur(10.27px)"
                    }}
                />

                {/* Folder Thumbnail Div - Clubbed and on top */}
                <div className="relative z-10 w-[280px] h-full flex flex-col items-center justify-end">
                    <div className="w-full relative">
                        <FolderSvg className="w-full h-full" />

                        {/* Document Thumbnail Overlay - Positioned inside folder body */}
                        {thumbnailUrl && (
                            <div className="absolute top-[13%]  left-[4.5%] right-[4.5%] bottom-[5%] flex items-center justify-center overflow-hidden">
                                <div className="relative w-full h-full rounded-[6px] overflow-hidden border border-white/10">
                                    <Image
                                        src={thumbnailUrl}
                                        alt={documentName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Partner Info & Meta Chips */}
            <div className="flex flex-col gap-5 mt-auto">
                <h3 className="text-[18px] font-medium text-white leading-[26.4px]">
                    {partnerName}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                    <ChipBordered className="rounded-full h-auto text-xs text-white">
                        {documentName}
                    </ChipBordered>
                    <ChipBordered className="rounded-full h-auto text-xs text-white">
                        {marketType}
                    </ChipBordered>
                    <ChipBordered className="rounded-full h-auto text-xs text-white">
                        {category}
                    </ChipBordered>
                </div>
            </div>
        </div>
    )
}

export default CabinetDocumentCard
