"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/core/back-button";
import Button from "@/components/core/button";
import GradientSeparator from "@/components/core/gradient-separator";
import { Plus } from "lucide-react";
import SuccessCheckSvg from "@/components/svg/success-check";
import CategoryForm from "./_components/category-form";
import CreateMilestoneModal from "./_components/create-milestone-modal";
import MilestoneCard from "./_components/milestone-card";
import EditCertificateModal from "./_components/edit-certificate-modal";

import { cn } from "@/lib/utils";

export default function CreateCertificateCategoryPage() {
    const router = useRouter();
    const [categoryName, setCategoryName] = useState("");
    const [measurementType, setMeasurementType] = useState<string | null>(null);
    const [marketType, setMarketType] = useState<string | null>(null);
    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [milestones, setMilestones] = useState<any[]>([
        { name: "$10 Million AUM", file: null, variables: ["WL Name", "WL Designation"] }
    ]);

    const isFormFilled = categoryName.trim() !== "" && measurementType !== null && marketType !== null;

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

    return (
        <div className="w-full h-full px-9 py-12 flex flex-col gap-8 animate-in fade-in duration-500 overflow-clip">
            {/* Header Section */}
            <div className="flex flex-col gap-5 w-full">
                <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col items-center gap-4">
                        <BackButton onClick={() => router.back()} className="size-10 my-2 self-start" />
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <h1 className="text-(--Primary-White,#FFF) text-[32px] font-medium leading-[40px] tracking-tight">
                        Create New Certificate Category
                    </h1>
                    <div className="flex items-center gap-4">
                        <Button
                            className="bg-transparent! border-none! bg-none! text-text-mid h-10 px-8 hover:text-white transition-colors"
                            onClick={() => router.back()}
                        >
                            Discard
                        </Button>
                        <Button
                            className="h-10 px-6 rounded-full flex items-center gap-2"
                            disabled={!isFormFilled}
                        >
                            Create
                            <SuccessCheckSvg className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <GradientSeparator opacity={0.9} className="w-full my-3" />
            </div>

            {/* Form Section: Add Details */}
            <CategoryForm
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                measurementType={measurementType}
                setMeasurementType={setMeasurementType}
                marketType={marketType}
                setMarketType={setMarketType}
            />

            {/* Milestone Section: Set Certificate Milestone */}
            <div className="flex flex-col gap-6 mt-4 pb-12">
                <h3 className="text-[#9C9C9C] text-[14px] font-normal leading-[18px]">
                    Set Certificate Milestone
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {/* Dynamic Milestone Slots */}
                    {Array.from({ length: 3 }).map((_, index) => {
                        const milestone = milestones[index];
                        const isNextSlot = index === milestones.length;
                        const isEmptyCenter = milestones.length === 0 && index === 1;

                        if (milestone) {
                            return (
                                <MilestoneCard
                                    key={index}
                                    number={index + 1}
                                    value={milestone.name}
                                    onDelete={() => handleDeleteMilestone(index)}
                                    onEditCertificate={() => handleEditCertificate(index)}
                                />
                            );
                        }

                        return (
                            <div
                                key={index}
                                className={cn(
                                    "w-full h-[308px] rounded-[12px] flex flex-col items-center justify-center p-6 text-center transition-all border border-dashed border-white/10"
                                )}
                                style={{
                                    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.35) 100%)",
                                    backdropFilter: "blur(20px)",
                                }}
                            >
                                {isEmptyCenter ? (
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <span className="text-white text-[18px] font-medium leading-normal whitespace-nowrap">
                                            No milestones created yet
                                        </span>
                                        <Button
                                            className="h-10 px-6 rounded-full flex items-center gap-2"
                                            onClick={() => setIsMilestoneModalOpen(true)}
                                        >
                                            Create Milestones
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (milestones.length > 0 && isNextSlot) ? (
                                    <div
                                        className="flex items-center justify-center gap-1 cursor-pointer group"
                                        onClick={() => setIsMilestoneModalOpen(true)}
                                    >
                                        <p className="flex items-center gap-3 text-white text-base">Create Milestone <Plus className="w-4 h-4 text-white" /></p>
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Create Milestone Modal */}
            <CreateMilestoneModal
                isOpen={isMilestoneModalOpen}
                onClose={() => setIsMilestoneModalOpen(false)}
                onAdd={handleAddMilestone}
            />

            {/* Edit Certificate Modal */}
            <EditCertificateModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveVariables}
                initialVariables={editingIndex !== null ? milestones[editingIndex]?.variables : []}
            />
        </div>
    );
}
