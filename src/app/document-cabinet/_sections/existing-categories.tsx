"use client"

import React from "react"
import { DataTable } from "@/components/core/data-table"
import EditPencilSvg from "@/components/svg/edit-pencil"
import EditCategoryModal from "../_components/edit-category-modal"
import { useState } from "react"

interface CategoryData {
    id: string
    category: string
    description: string
}

const CATEGORIES: CategoryData[] = [
    {
        id: "1",
        category: "Third party audit",
        description: "Quarterly audit reports and compliance documents"
    },
    {
        id: "2",
        category: "Company Incorporation",
        description: "Documents related to your investor portal"
    },
    {
        id: "3",
        category: "Legal Documents",
        description: "Your company formation and registration documents"
    },
    {
        id: "4",
        category: "Investor Portal Document",
        description: "Legal documents from Mangum & Associates"
    },
]

export default function ExistingCategories() {
    const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null)

    const columns = [
        {
            header: "Category",
            accessorKey: "category",
            className: "text-sm font-normal leading-[16.8px]",
            flex: 1.5
        },
        {
            header: "Description",
            accessorKey: "description",
            className: "text-sm font-normal leading-[16.8px]",
            flex: 3
        },
        {
            header: "-",
            accessorKey: "actions",
            className: "justify-end flex",
            flex: 0.5,
            cell: (item: CategoryData) => (
                <div className="flex justify-end pr-4">
                    <button
                        className="text-neutral-400 hover:text-white transition-colors"
                        onClick={() => setEditingCategory(item)}
                    >
                        <EditPencilSvg className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ]

    return (
        <div className="w-full">
            <h2 className="text-(--Primary-White,#FFF) text-[20px] font-medium leading-[24px] mb-6">
                Existing Categories
            </h2>
            <DataTable
                data={CATEGORIES}
                columns={columns}
                minWidth="100%"
                className="bg-transparent backdrop-blur-none p-6 border-none gap-0"
            />
            {editingCategory && (
                <EditCategoryModal
                    isOpen={!!editingCategory}
                    onClose={() => setEditingCategory(null)}
                    category={editingCategory}
                />
            )}
        </div>
    )
}
