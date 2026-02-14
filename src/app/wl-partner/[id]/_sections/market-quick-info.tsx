"use client"

import React, { useState } from "react"
import { Plus } from "lucide-react"
import Button from "@/components/core/button"
import { PartnerData } from "../../data"
import AddMarketModal from "../_components/add-market-modal"

interface InfoItemProps {
    label: string
    value: string
}

const InfoItem = ({ label, value }: InfoItemProps) => (
    <div className="flex items-center gap-3 bg-neutral-03 rounded-[8px] p-4">
        <span className="text-(--Primary-600,#888) text-sm font-normal leading-[18px] shrink-0">
            {label}
        </span>
        <span className="text-(--Primary-White,#FFF) text-sm font-normal leading-[18px] truncate">
            {value}
        </span>
    </div>
)

interface MarketQuickInfoProps {
    partner: PartnerData
}

export default function MarketQuickInfo({ partner }: MarketQuickInfoProps) {
    const [showAddMarketModal, setShowAddMarketModal] = useState(false)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch relative">
            {/* Market Type Section */}
            <div className="flex flex-col gap-5 h-full">
                <h3 className="text-(--Primary-White,#FFF) text-[20px] font-medium leading-[24px]">
                    Market Type
                </h3>

                <div
                    className="flex flex-col gap-4 p-6 rounded-xl bg-card section-border relative flex-1"
                    style={{
                        boxShadow: "6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset",
                        backdropFilter: "blur(40px)"
                    }}
                >
                    {partner.marketType.includes("Global") && partner.marketType.includes("USA") ? (
                        <div className="flex flex-col gap-4 justify-center h-full">
                            <div className="flex flex-col gap-2 bg-card section-border p-4 rounded-lg">
                                <h4 className="text-(--Primary-White,#FFF) text-[16px] font-medium leading-[20px]">
                                    USA
                                </h4>
                                <p className="text-(--Primary-600,#888) text-[12px] font-medium leading-[16px]">
                                    For White Labels operating exclusively in the United States and subject to US regulatory requirements.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 bg-card section-border p-4 rounded-lg">
                                <h4 className="text-(--Primary-White,#FFF) text-[16px] font-medium leading-[20px]">
                                    Global
                                </h4>
                                <p className="text-(--Primary-600,#888) text-[12px] font-medium leading-[16px]">
                                    For White Labels operating in international markets, excluding the United States.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-2 bg-card section-border p-4 rounded-lg">
                                <h4 className="text-(--Primary-White,#FFF) text-[16px] font-medium leading-[20px]">
                                    {partner.marketType}
                                </h4>
                                <p className="text-(--Primary-600,#888) text-[12px] font-medium leading-[16px]">
                                    {partner.marketDescription}
                                </p>
                            </div>

                            <div className="flex-1" />

                            <Button className="flex w-fit text-xs bg-none! border-none! bg-transparent! text-(--Primary-White,#FFF)"
                                onClick={() => setShowAddMarketModal(true)}>
                                <Plus size={8} />
                                Add market
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Quick Info Section */}
            <div className="flex flex-col gap-5 h-full">
                <h3 className="text-(--Primary-White,#FFF) text-[20px] font-medium leading-[24px]">
                    Quick Info
                </h3>

                <div
                    className="p-6 rounded-xl border border-[rgba(255,255,255,0.10)] flex-1"
                    style={{
                        background: "var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))",
                        boxShadow: "6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset",
                        backdropFilter: "blur(40px)"
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                        <InfoItem label="Email" value={partner.email} />
                        <InfoItem label="State" value={partner.state} />
                        <InfoItem label="Phone" value={partner.phone} />
                        <InfoItem label="City" value={partner.city} />
                        <InfoItem label="Country" value={partner.country} />
                        <InfoItem label="Zip Code" value={partner.zipCode} />
                    </div>
                </div>
            </div>

            <AddMarketModal
                isOpen={showAddMarketModal}
                onClose={() => setShowAddMarketModal(false)}
                onAssign={(market) => {
                    console.log(`Assigned market: ${market}`)
                    setShowAddMarketModal(false)
                }}
                missingMarket={partner.marketType.includes("USA") ? "Global" : "USA"}
            />
        </div>
    )
}
