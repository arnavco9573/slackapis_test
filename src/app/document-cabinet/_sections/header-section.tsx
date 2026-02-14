"use client"

import React from "react"
import Button from "@/components/core/button"
import InputField from "@/components/core/input-field"
import TextareaField from "@/components/core/textarea-field"
import ArrowSvg from "@/components/svg/arrow"
import DiscardCategoryModal from "../_components/discard-category-modal"
import { useDocumentCabinetStore } from "@/store/use-document-cabinet-store"
import { useState } from "react"

export default function HeaderSection() {
    const { setView } = useDocumentCabinetStore()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [showDiscardModal, setShowDiscardModal] = useState(false)

    const handleDiscard = () => {
        setName("")
        setDescription("")
        setShowDiscardModal(false)
    }

    return (
        <div className="flex flex-col gap-10 w-full mb-10">
            {/* Main Header */}
            <div className="flex justify-between items-center w-full">
                <h1 className="text-(--Primary-White,#FFF) text-[42px] font-medium leading-[46px]">
                    Document Cabinet Management
                </h1>
                <Button
                    className="flex items-center gap-2"
                    onClick={() => setView('list')}
                >
                    View Documents
                    <ArrowSvg className="w-[16px] h-[16px]" />
                </Button>
            </div>

            {/* Add New Category Form */}
            <div className="flex flex-col gap-6">
                <div className="text-(--Primary-White,#FFF) text-[20px] font-normal leading-[24px]">
                    Add new category
                </div>

                <div className="flex flex-col gap-6 max-w-[860px]">
                    <InputField
                        id="category-name"
                        name="categoryName"
                        type="text"
                        label="Category Name"
                        placeholder="Write new category name"
                        inputClassName="h-[58px] justify-center"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextareaField
                        id="category-description"
                        name="categoryDescription"
                        label="Describe Category"
                        placeholder="Write a one-line description for the category."
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className="flex items-center gap-4 mt-2">
                        <Button
                            className="bg-transparent! border-none! bg-none! text-white hover:opacity-80 transition-opacity h-[30px] px-12!"
                            onClick={() => setShowDiscardModal(true)}
                        >
                            Discard
                        </Button>
                        <Button className="h-[30px] px-12!">
                            Save
                        </Button>
                    </div>
                </div>
            </div>

            <DiscardCategoryModal
                isOpen={showDiscardModal}
                onClose={() => setShowDiscardModal(false)}
                onConfirm={handleDiscard}
            />
        </div>
    )
}
