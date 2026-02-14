"use client"

import React, { useState } from "react"
import { PartnerData } from "../../data"
import CertificateHeader from "../_components/certificate-header"
import CertificateCard, { Certificate } from "../_components/certificate-card"
import AssignCertificateModal from "../_components/assign-certificate-modal"

interface CertificatesProps {
    partner: PartnerData
}

// Mock certificates data
const mockCertificates = [
    {
        id: "cert-1",
        title: "Management Fee",
        milestone: "10,000 AUM",
        date: "11 Dec 2026",
        category: "Management Fees",
        previewUrl: "/certificate-1.png"
    },
    {
        id: "cert-2",
        title: "Performance Fee",
        milestone: "50,000 AUM",
        date: "15 Jan 2027",
        category: "Performance Fees",
        previewUrl: "/certificate-2.png"
    },
]

export default function Certificates({ partner }: CertificatesProps) {
    const isMultiMarket = partner?.marketType?.includes("Global") && partner?.marketType?.includes("USA")
    const [activeTab, setActiveTab] = useState("Global")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

    // Filter certificates based on category (and potentially market/tab if data supported it)
    const filteredCertificates = mockCertificates.filter(cert => {
        if (selectedCategory !== "All" && cert.category !== selectedCategory) return false
        return true
    })

    // Group certificates by category
    const groupedCertificates = filteredCertificates.reduce((acc, cert) => {
        if (!acc[cert.category]) {
            acc[cert.category] = []
        }
        acc[cert.category].push(cert)
        return acc
    }, {} as Record<string, typeof mockCertificates>)

    const handleAssignClick = () => {
        setIsAssignModalOpen(true)
    }

    return (
        <div className="flex flex-col gap-8 w-full mt-4">
            <h1 className="sr-only">Certificates Section</h1>

            <AssignCertificateModal
                open={isAssignModalOpen}
                onOpenChange={setIsAssignModalOpen}
                partner={partner}
            />

            <CertificateHeader
                showTabs={isMultiMarket}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onAssignClick={handleAssignClick}
            />

            <div className="flex flex-col gap-10">
                {Object.entries(groupedCertificates).map(([category, certs]) => (
                    <div key={category} className="flex flex-col gap-6">
                        <h2 className="text-white text-[20px] font-medium leading-[24px]">
                            {category}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {certs.map((cert) => (
                                <CertificateCard key={cert.id} certificate={cert} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
