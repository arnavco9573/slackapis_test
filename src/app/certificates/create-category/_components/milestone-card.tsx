"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import EditPencilSvg from "@/components/svg/edit-pencil";
import InputField from "@/components/core/input-field";
import Image from "next/image";

interface MilestoneCardProps {
    number: number;
    value: string;
    onDelete?: () => void;
    onEditCertificate?: () => void;
    className?: string;
    readOnly?: boolean;
}

export default function MilestoneCard({
    number,
    value,
    onDelete,
    onEditCertificate,
    className,
    readOnly = false
}: MilestoneCardProps) {
    return (
        <div
            className={cn(
                "w-full border border-white/5 rounded-[8px] flex flex-col items-start p-4 gap-4 relative overflow-hidden isolate",
                readOnly ? "h-auto" : "h-[308px]",
                className
            )}
            style={{
                background: "var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))",
                boxShadow: "6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset",
                backdropFilter: "blur(10px)",
            }}
        >
            <div className="flex justify-between items-center w-full z-20">
                <h4 className="text-white text-[16px] font-normal leading-[20px] capitalize">
                    {readOnly ? value : `Milestone ${number}`}
                </h4>
                {(!readOnly && onDelete) && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="opacity-70 hover:opacity-100 transition-opacity outline-none cursor-pointer"
                    >
                        <X className="h-5 w-5 text-white" />
                    </button>
                )}
            </div>

            {!readOnly && (
                <InputField
                    label="Milestone Value"
                    placeholder="Milestone Value"
                    type="text"
                    value={value}
                    readOnly
                    id={`milestone-${number}-value`}
                    name={`milestone-${number}-value`}
                    inputClassName="h-[58px] justify-center"
                />
            )}

            <div
                className={cn(
                    "w-full relative rounded-xl flex items-center justify-center overflow-hidden isolate mx-auto",
                    readOnly ? "aspect-4/5" : "flex-1",
                    !readOnly && "cursor-pointer group"
                )}
                onClick={() => !readOnly && onEditCertificate?.()}
            >
                <Image
                    src="/certificate-2.png"
                    alt="Certificate Preview"
                    fill
                    className="object-cover rounded-xl"
                />
                {!readOnly && (
                    <div
                        className="absolute inset-0 z-10 rounded-xl"
                        style={{
                            background: "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.35) 100%)",
                            backdropFilter: "blur(20px)",
                        }}
                    />
                )}
                {!readOnly && (
                    <div className="flex items-center gap-2 text-white font-normal hover:text-white/80 transition-colors relative z-20">
                        <span>Edit Certificate</span>
                        <EditPencilSvg className="w-5 h-5" />
                    </div>
                )}
            </div>
        </div>
    );
}
