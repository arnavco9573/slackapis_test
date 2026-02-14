"use client"

import React, { use } from "react"
import PartnerHeader from "./_sections/partner-header"
import MarketQuickInfo from "./_sections/market-quick-info"
import OperationalChecklist from "./_sections/operational-checklist"
import Certificates from "./_sections/certificates"
import DocumentCabinet from "./_sections/document-cabinet"
import { mockPartners, PartnerData } from "../data"

interface Props {
    params: Promise<{ id: string }>
}

export default function PartnerDetailsPage({ params }: Props) {
    const { id } = use(params)
    const partner = mockPartners.find((p: PartnerData) => p.id === id) || mockPartners[0]

    return (
        <div className="flex flex-col gap-8 p-8 min-h-screen bg-transparent px-10">
            <PartnerHeader
                businessName={partner.businessName}
                status={partner.status}
                wlManager={partner.wlManager}
                registrationDate={partner.registrationDate}
                onboardingDate={partner.onboardingDate}
            />

            <MarketQuickInfo partner={partner} />

            <OperationalChecklist partner={partner} />

            <Certificates partner={partner} />

            <DocumentCabinet />
        </div>
    )
}
