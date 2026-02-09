"use client"

import React, { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCategory, deleteCategory, updateCategory } from "../actions"
import InputField from "@/components/core/input-field"
import Button from "@/components/core/button"
import { DataTable } from "@/components/core/data-table"
import EditPencilSvg from "@/components/svg/edit-pencil"
import Trash2Svg from "@/components/svg/trash2"
import GradientSeparator from "@/components/core/gradient-separator"
import { cn } from "@/lib/utils"
import { Loader2, X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface CategoryManagementProps {
    categories: any[]
}

export function CategoryManagement({ categories }: CategoryManagementProps) {
    const queryClient = useQueryClient()
    const [newName, setNewName] = useState("")
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<any>(null)
    const [editName, setEditName] = useState("")

    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories-list"] })
            queryClient.invalidateQueries({ queryKey: ["blog-categories"] })
            setNewName("")
        }
    })

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories-list"] })
            queryClient.invalidateQueries({ queryKey: ["blog-categories"] })
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({ documentId, name }: { documentId: string, name: string }) => updateCategory(documentId, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories-list"] })
            queryClient.invalidateQueries({ queryKey: ["blog-categories"] })
            setIsEditOpen(false)
            setSelectedCategory(null)
            setEditName("")
        }
    })

    const handleCreate = () => {
        if (!newName.trim()) return
        createMutation.mutate(newName)
    }

    const handleUpdate = () => {
        if (!editName.trim() || !selectedCategory) return
        updateMutation.mutate({ documentId: selectedCategory.documentId, name: editName })
    }

    const columns = [
        {
            header: "Category",
            flex: 2,
            cell: (cat: any) => <span className="text-text-high">{cat.name}</span>
        },
        {
            header: "Number of materials",
            flex: 1.5,
            cell: (cat: any) => cat.blogs?.length || 0
        },
        {
            header: "Date",
            flex: 1.5,
            cell: (cat: any) => {
                const date = new Date(cat.createdAt)
                const day = date.getDate().toString().padStart(2, '0')
                const month = date.toLocaleDateString("en-GB", { month: "short" })
                const year = date.getFullYear()
                return `${day} ${month},${year}`
            }
        },
        {
            header: "-",
            flex: 1,
            className: "text-right",
            cell: (cat: any) => (
                <div className="flex items-center justify-end gap-4">
                    <button
                        onClick={() => {
                            setSelectedCategory(cat)
                            setEditName(cat.name)
                            setIsEditOpen(true)
                        }}
                        className="text-text-mid hover:text-text-high transition-colors"
                    >
                        <EditPencilSvg className="w-5 h-5" />
                    </button>
                    {/* <button
                        onClick={() => {
                            if (confirm(`Are you sure you want to delete the category "${cat.name}"?`)) {
                                deleteMutation.mutate(cat.documentId)
                            }
                        }}
                        className="text-red-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2Svg className="w-4 h-5" />
                    </button> */}
                </div>
            )
        }
    ]

    return (
        <div className="space-y-10 animate-in fade-in duration-500 max-w-[70%]">
            {/* Add New Category Form */}
            <div className="space-y-4">
                <h3 className="text-[18px] font-normal leading-[24px] text-[#FFF]">
                    Add new category
                </h3>

                <div className="flex flex-col gap-4">
                    <InputField
                        id="new-category"
                        name="new-category"
                        type="text"
                        label="Create New Category"
                        placeholder="Write new Category name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        inputClassName="h-[58px] justify-center"
                    />

                    <Button
                        onClick={handleCreate}
                        disabled={!newName.trim() || createMutation.isPending}
                        className="w-32 h-10"
                    >
                        {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </Button>
                </div>
            </div>

            <GradientSeparator opacity={0.2} />

            {/* Existing Categories Table */}
            <div className="space-y-6">
                <h3 className="text-[18px] font-normal leading-[24px] text-[#FFF]">
                    Existing Categories
                </h3>

                <DataTable
                    data={categories}
                    columns={columns}
                    minWidth="0"
                />
            </div>

            {/* Edit Category Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent
                    hideClose
                    overlayClassName="backdrop-blur-2xl bg-neutral-03"
                    className="max-w-[500px] p-6 border-0 bg-[#1D1E21] rounded-[12px] flex flex-col items-center shadow-2xl"
                    style={{
                        boxShadow: "6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset",
                        backdropFilter: 'blur(10px)',
                        padding: '24px',
                        gap: '32px'
                    }}
                >
                    <div className="w-full flex items-center justify-between">
                        <DialogTitle className="text-[20px] font-normal text-white">Edit Category</DialogTitle>
                        <button onClick={() => setIsEditOpen(false)} className="text-white opacity-60 hover:opacity-100 transition-opacity">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="w-full">
                        <InputField
                            id="edit-category-name"
                            name="edit-category-name"
                            type="text"
                            label="Edit Title"
                            placeholder="Write category name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            inputClassName="h-[58px] justify-center"
                        />
                    </div>

                    <div className="flex items-center gap-8 justify-center">
                        <button
                            onClick={() => setIsEditOpen(false)}
                            className="text-white text-[16px] font-normal hover:opacity-80 transition-opacity"
                        >
                            Discard
                        </button>
                        <Button
                            onClick={handleUpdate}
                            disabled={!editName.trim() || updateMutation.isPending}
                            className="w-[124px] text-[16px] font-normal"
                        >
                            {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
