"use client"

import React from "react"

interface ChecklistProgressBarProps {
    progress: number
}

const ChecklistProgressBar = ({ progress }: ChecklistProgressBarProps) => {
    return (
        <div className="rounded-lg border border-[#FFFFFF14] p-4 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
                <span className="text-[18px] leading-[20px] text-white font-normal">
                    {progress}%
                </span>
                <span className="text-[12px] leading-[16px] text-(--Primary-700) font-normal">
                    Operational Checklist Progress
                </span>
            </div>

            <div className="h-1 w-full rounded-[40px] opacity-50 bg-(--Primary-700)">
                <div
                    className="h-full rounded-[40px] bg-[#6DAB9C] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    )
}

export default ChecklistProgressBar
