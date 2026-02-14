"use client"

import React from "react"
import HeaderSection from "./_sections/header-section"
import ExistingCategories from "./_sections/existing-categories"
import DocumentListView from "./_sections/document-list-view"
import { useDocumentCabinetStore } from "@/store/use-document-cabinet-store"

export default function DocumentCabinetPage() {
    const { view } = useDocumentCabinetStore()

    return (
        <div className="flex flex-col gap-4 p-8 min-h-screen bg-transparent px-10">
            {view === "management" ? (
                <>
                    <HeaderSection />
                    <ExistingCategories />
                </>
            ) : (
                <DocumentListView />
            )}
        </div>
    )
}
