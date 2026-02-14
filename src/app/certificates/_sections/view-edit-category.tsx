"use client";

import React, { useState, useEffect } from "react";
import { useCertificateStore } from "@/store/use-certificate-store";
import BackButton from "@/components/core/back-button";
import Button from "@/components/core/button";
import GradientSeparator from "@/components/core/gradient-separator";
import { Plus } from "lucide-react";
import SuccessCheckSvg from "@/components/svg/success-check";
import EditPencilSvg from "@/components/svg/edit-pencil";
import CategoryForm from "../create-category/_components/category-form";
import MilestoneCard from "../create-category/_components/milestone-card";
import CreateMilestoneModal from "../create-category/_components/create-milestone-modal";
import EditCertificateModal from "../create-category/_components/edit-certificate-modal";
import { cn } from "@/lib/utils";

export default function ViewEditCategory() {
    const {
        selectedCategory,
        isEditing,
        setEditing,
        popView,
        updateCategory
    } = useCertificateStore();

    // Local state for the form during editing
    const [categoryName, setCategoryName] = useState(selectedCategory?.name || "");
    const [measurementType, setMeasurementType] = useState<string | null>(selectedCategory?.measurementType || null);
    const [marketType, setMarketType] = useState<string | null>(selectedCategory?.marketType || "global");
    const [milestones, setMilestones] = useState<any[]>(selectedCategory?.milestones || []);

    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // Sync local state when selectedCategory changes (e.g., initial mount)
    useEffect(() => {
        if (selectedCategory) {
            setCategoryName(selectedCategory.name);
            setMeasurementType(selectedCategory.measurementType);
            setMarketType(selectedCategory.marketType || "global");
            setMilestones(selectedCategory.milestones);
        }
    }, [selectedCategory]);

    const handleSave = () => {
        updateCategory({
            name: categoryName,
            measurementType: measurementType || "Dollars",
            marketType: marketType || "Global",
            milestones: milestones
        });
        setEditing(false);
    };

    const handleAddMilestone = (milestone: any) => {
        setMilestones([...milestones, milestone]);
    };

    const handleDeleteMilestone = (index: number) => {
        setMilestones(milestones.filter((_, i) => i !== index));
    };

    const handleEditCertificate = (index: number) => {
        setEditingIndex(index);
        setIsEditModalOpen(true);
    };

    const handleSaveVariables = (variables: string[]) => {
        if (editingIndex !== null) {
            const updatedMilestones = [...milestones];
            updatedMilestones[editingIndex] = {
                ...updatedMilestones[editingIndex],
                variables
            };
            setMilestones(updatedMilestones);
        }
    };

    if (!selectedCategory) return null;

    return (
        <div className="w-full flex flex-col gap-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-5 w-full">
                <div className="flex justify-between items-center w-full">
                    <BackButton onClick={popView} className="size-10 my-2" />
                </div>
                <div className="flex justify-between items-center">
                    <h1 className="text-white text-[32px] font-medium leading-[40px] tracking-tight capitalize">
                        {categoryName || "Category Name"}
                    </h1>
                    <div className="flex items-center gap-4">
                        {isEditing ? (
                            <>
                                <Button
                                    className="bg-transparent! border-none! bg-none! text-text-mid h-10 px-8 hover:text-white transition-colors"
                                    onClick={() => setEditing(false)}
                                >
                                    Discard
                                </Button>
                                <Button
                                    className="h-10 px-6 rounded-full flex items-center gap-2"
                                    onClick={handleSave}
                                >
                                    Save Changes
                                    <SuccessCheckSvg className="w-4 h-4" />
                                </Button>
                            </>
                        ) : (
                            <Button
                                className="h-10 px-6 rounded-full flex items-center gap-2 border border-white/10 [background:linear-gradient(0deg,rgba(255,255,255,0.10)_-0.21%,rgba(255,255,255,0.00)_105.1%)]"
                                onClick={() => setEditing(true)}
                            >
                                Edit
                                <EditPencilSvg className="size-4" />
                            </Button>
                        )}
                    </div>
                </div>
                <GradientSeparator opacity={0.9} className="w-full my-3" />
            </div>

            {/* Details Section */}
            <div className="flex flex-col gap-6">
                <h3 className="text-white text-[16px] font-normal leading-[20px] capitalize">
                    Details
                </h3>
                <CategoryForm
                    categoryName={categoryName}
                    setCategoryName={setCategoryName}
                    measurementType={measurementType}
                    setMeasurementType={setMeasurementType}
                    marketType={marketType}
                    setMarketType={setMarketType}
                    readOnly={!isEditing}
                />
            </div>

            {/* Milestone Section */}
            <div className="flex flex-col gap-6 mt-4 pb-12">
                <h3 className="text-white text-[16px] font-normal leading-[20px] capitalize">
                    Set Certificate Milestone
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {Array.from({ length: 3 }).map((_, index) => {
                        const milestone = milestones[index];
                        const isNextSlot = index === milestones.length;

                        if (milestone) {
                            return (
                                <MilestoneCard
                                    key={index}
                                    number={index + 1}
                                    value={milestone.name}
                                    onDelete={() => handleDeleteMilestone(index)}
                                    onEditCertificate={() => handleEditCertificate(index)}
                                    readOnly={!isEditing}
                                    className={cn(!isEditing && "pointer-events-auto")}
                                />
                            );
                        }

                        if (!isEditing) return null;

                        return (
                            <div
                                key={index}
                                className={cn(
                                    "w-full rounded-[12px] flex items-center justify-center p-6 text-center",
                                    isEditing ? "h-[308px]" : "min-h-[400px]"
                                )}
                                style={{
                                    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.35) 100%)",
                                    backdropFilter: "blur(20px)",
                                }}
                            >
                                {isNextSlot && (
                                    <div
                                        className="flex items-center justify-center gap-1 cursor-pointer group"
                                        onClick={() => setIsMilestoneModalOpen(true)}
                                    >
                                        <p className="flex items-center gap-3 text-white text-base">
                                            Create Milestone <Plus className="w-4 h-4 text-white" />
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <CreateMilestoneModal
                isOpen={isMilestoneModalOpen}
                onClose={() => setIsMilestoneModalOpen(false)}
                onAdd={handleAddMilestone}
            />

            <EditCertificateModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveVariables}
                initialVariables={editingIndex !== null ? milestones[editingIndex]?.variables : []}
            />
        </div>
    );
}
