"use client"

import React from "react"
import ChevronRightSvg from "@/components/svg/chevron-right"
import SearchSvg from "@/components/svg/search"
import CabinetSortDropdown from "../_components/cabinet-sort-dropdown"
import CabinetFilterDropdown from "../_components/cabinet-filter-dropdown"
import { ChangeEvent } from "react"
import BackButton from "@/components/core/back-button"
import { useDocumentCabinetStore } from "@/store/use-document-cabinet-store"
import CabinetDocumentCard from "../_components/cabinet-document-card"

const mockDocuments = [
    {
        id: "1",
        partnerName: "Kanya West",
        documentName: "Business Licence",
        date: "15 January, 2026",
        category: "Third Party Audit",
        marketType: "Global Market",
        thumbnailUrl: "/Businees Logo.png" // Corrected path: removed /public and matched actual filename
    },
    {
        id: "2",
        partnerName: "Travis Scott",
        documentName: "Tax Residency",
        date: "12 February, 2026",
        category: "Legal Documents",
        marketType: "USA Market",
        thumbnailUrl: "/Businees Logo.png"
    },
    {
        id: "3",
        partnerName: "Drake Aubrey",
        documentName: "Incorporation Cert",
        date: "05 March, 2026",
        category: "Company Incorporation",
        marketType: "Dual Market",
        thumbnailUrl: "/Businees Logo.png"
    },
    {
        id: "4",
        partnerName: "Kendrick Lamar",
        documentName: "Audit Report",
        date: "20 May, 2026",
        category: "Third Party Audit",
        marketType: "Global Market",
        thumbnailUrl: "/Businees Logo.png"
    }
]

export default function DocumentListView() {
    const { setView } = useDocumentCabinetStore()
    const [searchTerm, setSearchTerm] = React.useState("")
    const [sortOrder, setSortOrder] = React.useState("newest_to_oldest")

    return (
        <div className="flex flex-col gap-10 w-full animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-8">
                <BackButton onClick={() => setView('management')} className="self-start" />

                <h1 className="text-white text-[42px] font-medium leading-[50.4px]">
                    Document Cabinet
                </h1>

                {/* Controls Bar */}
                <div className="flex items-center justify-between gap-4 mt-2">
                    <div className="relative flex-1 max-w-[350px]">
                        <SearchSvg className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
                        <input
                            placeholder="Search"
                            className="h-[43px] w-full rounded-full border border-white/10 bg-white/5 pl-14 pr-6 text-white placeholder:text-white/40 outline-none focus:border-white/20 transition-all"
                            value={searchTerm}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <CabinetFilterDropdown />
                        <CabinetSortDropdown
                            sortOrder={sortOrder}
                            onSortChange={setSortOrder}
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {mockDocuments.map((doc) => (
                    <CabinetDocumentCard
                        key={doc.id}
                        partnerName={doc.partnerName}
                        documentName={doc.documentName}
                        date={doc.date}
                        category={doc.category}
                        marketType={doc.marketType}
                        thumbnailUrl={doc.thumbnailUrl}
                    />
                ))}
            </div>
        </div>
    )
}
