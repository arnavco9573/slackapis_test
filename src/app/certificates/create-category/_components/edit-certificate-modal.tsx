"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { X, ArrowLeft } from "lucide-react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import Button from "@/components/core/button";
import ChipFilled from "@/components/core/chip-filled";
import ArrowSvg from "@/components/svg/arrow";
import GradientSeparator from "@/components/core/gradient-separator";
import ZoomSvg from "@/components/svg/zoom";
import Image from "next/image";

interface EditCertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (variables: string[]) => void;
    initialVariables?: string[];
}

export default function EditCertificateModal({
    isOpen,
    onClose,
    onSave,
    initialVariables = [],
}: EditCertificateModalProps) {
    const [selectedVariables, setSelectedVariables] = useState<string[]>(initialVariables);

    const toggleVariable = (variable: string) => {
        setSelectedVariables(prev =>
            prev.includes(variable)
                ? prev.filter(v => v !== variable)
                : [...prev, variable]
        );
    };

    const handleSave = () => {
        onSave(selectedVariables);
        onClose();
    };

    const handleDiscard = () => {
        onClose();
        setTimeout(() => {
            setSelectedVariables(initialVariables);
        }, 300);
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
                            Edit Certificate
                        </DialogTitle>
                        <DialogClose
                            className="opacity-70 ring-offset-background transition-opacity hover:opacity-100 outline-none"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5 text-white" />
                        </DialogClose>
                    </DialogHeader>

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

                    <GradientSeparator opacity={0.9} className="w-full my-4" />

                    <div className="flex items-center justify-between gap-6 pt-2">
                        <Button
                            className="flex-1 bg-transparent! border-none! bg-none! text-text-mid h-10 hover:text-white transition-colors flex items-center gap-2"
                            onClick={handleDiscard}
                        >
                            Discard
                        </Button>
                        <Button
                            className="flex-1 rounded-full h-10 font-medium flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                            onClick={handleSave}
                        >
                            Save
                            <ArrowSvg className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
