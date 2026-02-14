"use client";

import React, { useState, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { X, Upload, Check, Search, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Button from "@/components/core/button";
import InputField from "@/components/core/input-field";
import ChipBordered from "@/components/core/chip-bordered";
import ChipFilled from "@/components/core/chip-filled";
import ArrowSvg from "@/components/svg/arrow";
import SuccessCheckSvg from "@/components/svg/success-check";
import TaskCreationProgress from "@/app/primary-checklist/_components/task-creation-progress";
import UploadSvg from "@/components/svg/upload";
import GradientSeparator from "@/components/core/gradient-separator";
import ZoomSvg from "@/components/svg/zoom";

interface CreateMilestoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (milestone: any) => void;
}

export default function CreateMilestoneModal({
    isOpen,
    onClose,
    onAdd,
}: CreateMilestoneModalProps) {
    const [step, setStep] = useState(1);
    const [milestoneValue, setMilestoneValue] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const [selectedVariables, setSelectedVariables] = useState<string[]>([]);

    const toggleVariable = (variable: string) => {
        setSelectedVariables(prev =>
            prev.includes(variable)
                ? prev.filter(v => v !== variable)
                : [...prev, variable]
        );
    };

    const handleNext = () => {
        if (step === 1) {
            setStep(step + 1);
        } else {
            // Final Save
            onAdd({ name: milestoneValue, file, variables: selectedVariables });
            onClose();
            // Reset state for next time
            setTimeout(() => {
                setStep(1);
                setMilestoneValue("");
                setFile(null);
                setSelectedVariables([]);
            }, 300);
        }
    };

    const handleDiscard = () => {
        onClose();
        setStep(1);
        setMilestoneValue("");
        setFile(null);
        setSelectedVariables([]);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="max-w-[500px] bg-card section-border p-0 overflow-hidden gap-0 rounded-[12px]"
                overlayClassName="bg-neutral-03 backdrop-blur-2xl"
                hideClose
            >
                <div className="flex flex-col p-6 gap-0">
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-6">
                        <DialogTitle className="text-base font-normal text-white">
                            Create Milestones
                        </DialogTitle>
                        <DialogClose
                            className="opacity-70 ring-offset-background transition-opacity hover:opacity-100 outline-none"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5 text-white" />
                        </DialogClose>
                    </DialogHeader>

                    {/* Progress Bar - Using the one from reference, might need 3 bars if steps=3 */}
                    <div className="mb-8">
                        <TaskCreationProgress
                            activeStep={step}
                            progress={step === 1 ? 50 : 20}
                        />
                    </div>

                    <div className="flex flex-col gap-6">
                        {step === 1 && (
                            <>
                                <InputField
                                    label="Milestone Value"
                                    placeholder="Set milestone value"
                                    type="text"
                                    id="milestone-value"
                                    name="milestoneValue"
                                    value={milestoneValue}
                                    onChange={(e) => setMilestoneValue(e.target.value)}
                                    inputClassName="h-[58px] justify-center"
                                />

                                <div className="flex flex-col gap-2">
                                    <span className="text-xs text-(--Primary-500) font-normal tracking-wider">
                                        Upload Certificate
                                    </span>
                                    <div
                                        className="w-full h-[120px] rounded-[8px] border border-dashed border-(--Primary-700) bg-neutral-03 flex flex-col items-center justify-center gap-3 cursor-pointer"
                                        onClick={() => document.getElementById('certificate-upload')?.click()}
                                    >
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center">
                                            <UploadSvg className="w-4 h-4 text-white/40" />
                                        </div>
                                        <span className="text-white/40 text-sm">Drag or drop file</span>
                                        <input
                                            type="file"
                                            id="certificate-upload"
                                            className="hidden"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        />
                                    </div>
                                    <span className="text-[12px] text-(--Primary-500) min-h-[1.5em]">
                                        {file ? file.name : "No file chosen"}
                                    </span>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <div className="flex flex-col gap-5">
                                <span className="text-[12px] text-(--Primary-500) font-normal tracking-wide">
                                    Set Certificate Variables
                                </span>

                                <div className="relative w-full aspect-7/5 rounded-[12px] border border-white/10 overflow-hidden flex flex-col group">
                                    <Image
                                        src="/certificate-2.png"
                                        alt="Certificate Template"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute bottom-4 right-4 z-20">
                                        <ZoomSvg className="size-6" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {/* Selected Variables Section */}
                                    <div className="flex flex-col gap-3">
                                        <span className="text-[14px] text-(--Primary-500) font-normal">Selected</span>
                                        <div className="flex flex-wrap gap-2 min-h-[40px]">
                                            {selectedVariables.length > 0 ? (
                                                selectedVariables.map((variable) => (
                                                    <ChipFilled
                                                        key={variable}
                                                        onClick={() => toggleVariable(variable)}
                                                        className="cursor-pointer h-8 border border-white/40 text-white flex items-center gap-2 pr-2"
                                                        style={{
                                                            borderRadius: '12px',
                                                            background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.15) -0.21%, rgba(255, 255, 255, 0.05) 105.1%)'
                                                        }}
                                                    >
                                                        {variable}
                                                        <X className="w-3.5 h-3.5" />
                                                    </ChipFilled>
                                                ))
                                            ) : (
                                                <span className="text-xs text-white/20 italic">No variables selected</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Select Variable Section */}
                                    <div className="flex flex-col gap-3">
                                        <span className="text-[14px] text-(--Primary-500) font-normal">Select Variable</span>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                "WL Name",
                                                "WL Designation",
                                                "Compony Name",
                                                "Date of assignment"
                                            ].filter(v => !selectedVariables.includes(v)).map((variable) => (
                                                <ChipFilled
                                                    key={variable}
                                                    onClick={() => toggleVariable(variable)}
                                                    className="cursor-pointer h-8 opacity-60 hover:opacity-100 transition-opacity text-white"
                                                    style={{
                                                        borderRadius: '12px',
                                                        border: '1px solid var(--Neutrals-20, rgba(255, 255, 255, 0.20))',
                                                        background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.10) -0.21%, rgba(255, 255, 255, 0.00) 105.1%)'
                                                    }}
                                                >
                                                    {variable}
                                                </ChipFilled>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <GradientSeparator opacity={0.9} className="w-full my-4" />

                    <div className="flex items-center justify-between gap-6 pt-2">
                        <Button
                            className="flex-1 bg-transparent! border-none! bg-none! text-text-mid h-10 hover:text-white transition-colors flex items-center gap-2"
                            onClick={step === 1 ? handleDiscard : () => setStep(step - 1)}
                        >
                            {step > 1 && <ArrowLeft className="w-4 h-4" />}
                            {step === 1 ? "Discard" : "Back"}
                        </Button>
                        <Button
                            className="flex-1 rounded-full h-10 font-medium flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                            onClick={handleNext}
                            disabled={step === 1 && (!milestoneValue || !file)}
                        >
                            {step === 2 ? "Save" : "Next"}
                            <ArrowSvg className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
