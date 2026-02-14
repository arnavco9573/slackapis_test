"use client"

import React, { useState } from "react"
import CabinetHeader from "../_components/cabinet-header"
import DocumentCard from "../_components/document-card"
import DocumentPreviewModal from "../_components/document-preview-modal"

const DocumentCabinet = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("Third Party Audits")
    const [selectedDocument, setSelectedDocument] = useState<{
        name: string
        category: string
        url: string
    } | null>(null)

    // Mock Data
    const documents = [
        // Third Party Audits
        { id: 1, name: "Business Licence", date: "15 January, 2026", category: "Third Party Audits", thumbnailUrl: "/Businees Logo.png" },
        { id: 2, name: "Audit Report Q1", date: "10 February, 2026", category: "Third Party Audits", thumbnailUrl: "/Businees Logo.png" },
        { id: 3, name: "Compliance Cert", date: "20 March, 2026", category: "Third Party Audits", thumbnailUrl: "/Businees Logo.png" },

        // Investor Portal Documents
        { id: 4, name: "Investor Guide", date: "05 January, 2026", category: "Investor Portal Documents", thumbnailUrl: "/Businees Logo.png" },
        { id: 5, name: "Risk Disclosure", date: "12 January, 2026", category: "Investor Portal Documents", thumbnailUrl: "/Businees Logo.png" },
        { id: 6, name: "Terms of Service", date: "15 January, 2026", category: "Investor Portal Documents", thumbnailUrl: "/Businees Logo.png" },

        // Company Incorporation
        { id: 7, name: "Incorporation Cert", date: "01 January, 2025", category: "Company Incorporation", thumbnailUrl: "/Businees Logo.png" },
        { id: 8, name: "Articles of Assoc", date: "01 January, 2025", category: "Company Incorporation", thumbnailUrl: "/Businees Logo.png" },
        { id: 9, name: "Memorandum", date: "01 January, 2025", category: "Company Incorporation", thumbnailUrl: "/Businees Logo.png" },

        // Legal Documents
        { id: 10, name: "Privacy Policy", date: "15 January, 2026", category: "Legal Documents", thumbnailUrl: "/Businees Logo.png" },
        { id: 11, name: "Cookie Policy", date: "15 January, 2026", category: "Legal Documents", thumbnailUrl: "/Businees Logo.png" },
        { id: 12, name: "GDPR Compliance", date: "15 January, 2026", category: "Legal Documents", thumbnailUrl: "/Businees Logo.png" }
    ]

    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    // Group documents by category if "All" is selected
    const groupedDocuments = filteredDocuments.reduce((acc, doc) => {
        if (!acc[doc.category]) {
            acc[doc.category] = []
        }
        acc[doc.category].push(doc)
        return acc
    }, {} as Record<string, typeof documents>)

    return (
        <section className="flex flex-col gap-8 w-full">
            <CabinetHeader
                onSearch={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />

            <div className="flex flex-col gap-12 mt-2 pb-12">
                {Object.entries(groupedDocuments).map(([category, docs]) => (
                    <div key={category} className="flex flex-col gap-6">
                        {/* Category Heading */}
                        <h2 className="text-white text-[20px] font-medium leading-[24px]">
                            {category}
                        </h2>

                        {/* Document Grid for this category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {docs.map((doc) => (
                                <DocumentCard
                                    key={doc.id}
                                    name={doc.name}
                                    date={doc.date}
                                    category={doc.category}
                                    thumbnailUrl={doc.thumbnailUrl}
                                    onClick={() => setSelectedDocument({
                                        name: doc.name,
                                        category: doc.category,
                                        url: doc.thumbnailUrl
                                    })}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {selectedDocument && (
                <DocumentPreviewModal
                    isOpen={!!selectedDocument}
                    onClose={() => setSelectedDocument(null)}
                    documentName={selectedDocument.name}
                    category={selectedDocument.category}
                    documentUrl={selectedDocument.url}
                />
            )}
        </section>
    )
}

export default DocumentCabinet
