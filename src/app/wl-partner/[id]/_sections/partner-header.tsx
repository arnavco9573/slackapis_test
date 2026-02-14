"use client"

import React from "react"
import Image from "next/image"
import BackButton from "@/components/core/back-button"
import ChipBordered from "@/components/core/chip-bordered"
import ChipFilled from "@/components/core/chip-filled"
import { useRouter } from "next/navigation"

interface PartnerHeaderProps {
    businessName: string
    status: string
    wlManager: string
    registrationDate: string
    onboardingDate: string
    avatarUrl?: string
}

export default function PartnerHeader({
    businessName,
    status,
    wlManager,
    registrationDate,
    onboardingDate,
    avatarUrl,
}: PartnerHeaderProps) {
    const router = useRouter()

    return (
        <div className="flex flex-col gap-[72px]">
            {/* Back Button */}

            <BackButton onClick={() => router.back()} className="self-start left-5 mt-2" />

            {/* Main Header Info */}
            <div className="flex items-center gap-6">
                {/* Avatar */}
                <div
                    className="w-[180px] h-[180px] rounded-full overflow-hidden shrink-0 relative bg-[#0A1622]"
                    style={{
                        boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.25)"
                    }}
                >
                    {avatarUrl ? (
                        <Image
                            src={avatarUrl}
                            alt={businessName}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#0A1622]">
                            {/* Placeholder logo if no avatarUrl provided */}
                            <div className="text-[#469ABB] font-bold text-2xl text-center px-4 leading-none">
                                {businessName.split(' ').map(w => w[0]).join('')}
                            </div>
                        </div>
                    )}
                </div>

                {/* Text Info */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-[#FFF] text-[42px] font-medium leading-[46px]">
                        {businessName}
                    </h1>

                    <div className="flex flex-col gap-3">
                        {/* Status and Manager */}
                        <div className="flex items-center gap-3">
                            <ChipBordered className="text-[#469ABB] text-sm py-1.5 px-4 rounded-[500px]">
                                {status}
                            </ChipBordered>
                            <ChipBordered className="text-[#9C9C9C] text-sm py-1.5 px-4 rounded-[500px]">
                                Manager - <span className="text-white">{wlManager}</span>
                            </ChipBordered>
                        </div>

                        {/* Dates */}
                        <div className="flex items-center gap-3">
                            <ChipFilled className="text-[#9C9C9C] text-sm py-1.5 px-4 rounded-[500px]">
                                Registration Date: <span className="text-sm ml-2">{registrationDate}</span>
                            </ChipFilled>
                            <ChipFilled className="text-[#9C9C9C] text-sm py-1.5 px-4 rounded-[500px]">
                                Onboarding date: <span className="text-sm ml-2">{onboardingDate}</span>
                            </ChipFilled>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
