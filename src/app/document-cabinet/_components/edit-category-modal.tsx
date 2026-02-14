"use client"

import React, { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Button from "@/components/core/button"
import InputField from "@/components/core/input-field"
import TextareaField from "@/components/core/textarea-field"
import DiscardCategoryModal from "./discard-category-modal"

interface CategoryData {
    id: string
    category: string
    description: string
}

interface EditCategoryModalProps {
    isOpen: boolean
    onClose: () => void
    category: CategoryData | null
}

export default function EditCategoryModal({
    isOpen,
    onClose,
    category,
}: EditCategoryModalProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [showDiscardModal, setShowDiscardModal] = useState(false)

    useEffect(() => {
        if (category) {
            setTitle(category.category)
            setDescription(category.description)
        }
    }, [category])

    const handleSave = () => {
        // Mock save functionality
        console.log("Saving category:", { ...category, title, description })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="bg-card section-border p-6 md:max-w-[500px] gap-6 rounded-xl"
                overlayClassName="bg-neutral-03 backdrop-blur-2xl"
            >
                <DialogHeader>
                    <DialogTitle className="text-white text-[20px] font-medium leading-[24px] text-left">
                        Edit Category
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6">
                    <InputField
                        id="edit-category-title"
                        name="title"
                        type="text"
                        label="Current Title"
                        placeholder="Category Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        inputClassName="h-[58px]"
                    />

                    <TextareaField
                        id="edit-category-description"
                        name="description"
                        label="Describe Category"
                        placeholder="Category Description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-center gap-15 mt-2">
                    <Button
                        onClick={() => setShowDiscardModal(true)}
                        className="bg-transparent! border-none! bg-none! text-white hover:opacity-80 transition-opacity h-[40px] px-12"
                    >
                        Discard
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="h-[40px] px-12 rounded-full"
                    >
                        Save
                    </Button>
                </div>
            </DialogContent>

            <DiscardCategoryModal
                isOpen={showDiscardModal}
                onClose={() => setShowDiscardModal(false)}
                onConfirm={onClose}
            />
        </Dialog>
    )
}
