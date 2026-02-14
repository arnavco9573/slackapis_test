"use client"

import React from "react"
import ChipFilled from "@/components/core/chip-filled"
import FolderSvg from "@/components/svg/folder"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Button from "@/components/core/button"
import DownloadSvg from "@/components/svg/download"

interface DocumentCardProps {
    name: string
    date: string
    category: string
    thumbnailUrl?: string
    className?: string
    onClick?: () => void
}

const DocumentCard = ({
    name,
    date,
    category,
    thumbnailUrl,
    className,
    onClick
}: DocumentCardProps) => {
    return (
        <div
            className={cn(
                "bg-card section-border p-6 h-[418px] flex flex-col justify-between group relative cursor-pointer hover:border-white/20 transition-all",
                className
            )}
            onClick={onClick}
        >
            {/* Download Button */}
            <div className="flex justify-end">
                <Button
                    onClick={(e) => {
                        e.stopPropagation()
                        // Handle download
                        console.log("Download clicked")
                    }}
                    className="px-4! py-2! h-[30px]"
                >
                    <DownloadSvg className="size-5 text-white" />
                </Button>
            </div>

            {/* Preview Area */}
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
                                        alt={name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col gap-3">
                <h3 className="text-lg font-medium text-white leading-[18px]">
                    {name}
                </h3>
                <div className="flex items-center gap-2">
                    <ChipFilled className="text-(--Primary-500) font-normal h-auto text-xs leading-tight">
                        {date}
                    </ChipFilled>
                    <ChipFilled className="text-(--Primary-500) font-normal h-auto text-xs leading-tight">
                        {category}
                    </ChipFilled>
                </div>
            </div>
        </div>
    )
}

export default DocumentCard
