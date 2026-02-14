"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/core/button";
import { SelectInput } from "@/components/core/select-input";
import InputField from "@/components/core/input-field";
import DateInputField from "@/components/core/date-input";
import TaskCreationProgress from "@/app/primary-checklist/_components/task-creation-progress";
import { Upload, X } from "lucide-react";
import ArrowSvg from "@/components/svg/arrow";
import SuccessCheckSvg from "@/components/svg/success-check";
import DiscardCertificateModal from "./discard-certificate-modal";

interface AssignCertificateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AssignCertificateModal({
    open,
    onOpenChange
}: AssignCertificateModalProps) {
    const [step, setStep] = useState(1);
    const [showDiscard, setShowDiscard] = useState(false);
    const [assignAllMilestones, setAssignAllMilestones] = useState(false);

    // Form State
    const [presentedTo, setPresentedTo] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [marketType, setMarketType] = useState("");
    const [category, setCategory] = useState("");
    const [milestone, setMilestone] = useState("");
    const [date, setDate] = useState("12/02/2026");
    const [signedBy, setSignedBy] = useState("Vanquish CEO");

    // Mock options
    const partnerOptions = [
        { value: "p1", label: "Tom Shelby" },
        { value: "p2", label: "Ada Wong" },
        { value: "p3", label: "Michael Smith" },
        { value: "p4", label: "Lisa Johnson" },
        { value: "p5", label: "Ethan Hunt" }
    ];
    const companyOptions = [
        { value: "c1", label: "Blue Moon PVT.LTD" },
        { value: "c2", label: "Red Sun Enterprises" },
        { value: "c3", label: "Green Leaf Co." }
    ];
    const marketOptions = [
        { value: "global", label: "Global" },
        { value: "usa", label: "USA" },
        { value: "global_usa", label: "Global + USA" }
    ];
    const categoryOptions = [
        { value: "aum", label: "AUM" },
        { value: "investors", label: "Investors" },
        { value: "performance_fees", label: "Performance Fees" },
        { value: "management_fees", label: "Management Fees" }
    ];
    const milestoneOptions = [
        { value: "70k_aum", label: "$ 70,000 AUM" },
        { value: "2m_aum", label: "$ 2 Million AUM" },
        { value: "5m_aum", label: "$ 5 Million AUM" },
        { value: "10m_aum", label: "$ 10 Million AUM" }
    ];

    const handleNext = () => {
        setStep(2);
    };

    const handleAssign = () => {
        console.log("Certificate Assigned", {
            presentedTo,
            companyName,
            marketType,
            category,
            milestone,
            date,
            signedBy
        });
        onOpenChange(false);
        setStep(1);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) setShowDiscard(true);
        }}>
            <DialogContent className="max-w-[500px] bg-[#1A1D21] border border-white/10 p-0 overflow-hidden gap-0" hideClose
                overlayClassName="bg-neutral-03 backdrop-blur-2xl">
                <DialogHeader className="px-6 py-4 pb-0">
                    <DialogTitle className="text-base font-normal text-white flex justify-between items-center">
                        <h3 className="text-base font-normal text-white">
                            Assign Certificate
                        </h3>
                        <Button
                            className="bg-none! border-none! bg-transparent! px-0!"
                            onClick={() => setShowDiscard(true)}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 py-5 mb-4">
                    <TaskCreationProgress activeStep={step} progress={step === 1 ? 50 : 20} />
                </div>

                <div className="px-6 pb-6">
                    {step === 1 ? (
                        <div className="flex flex-col gap-3">
                            <SelectInput
                                label="Presented To"
                                placeholder="Select WL Partner"
                                value={presentedTo}
                                onChange={setPresentedTo}
                                options={partnerOptions}
                            />

                            <SelectInput
                                label="Company Name"
                                placeholder="Select Company"
                                value={companyName}
                                onChange={setCompanyName}
                                options={companyOptions}
                            />

                            <SelectInput
                                label="Market Type"
                                placeholder="Select Market Type"
                                value={marketType}
                                onChange={setMarketType}
                                options={marketOptions}
                            />

                            <SelectInput
                                label="Certificate Category"
                                placeholder="Select Certificate Category"
                                value={category}
                                onChange={setCategory}
                                options={categoryOptions}
                            />

                            <div className="flex flex-col gap-3">
                                <SelectInput
                                    label="Milestone Archived"
                                    placeholder="Select Milestone"
                                    value={milestone}
                                    onChange={(val) => {
                                        setMilestone(val);
                                        if (val !== "10m_aum") setAssignAllMilestones(false);
                                    }}
                                    options={milestoneOptions}
                                />

                                {milestone === "10m_aum" && (
                                    <div className="flex items-start justify-between gap-4 mt-1">
                                        {!assignAllMilestones ? (
                                            <>
                                                <p className="text-[12px] leading-[16px] font-normal text-[#C39C5F] max-w-[280px]">
                                                    You’ve selected the highest-ranked milestone. Would you like to automatically assign all previous milestones as well?
                                                </p>
                                                <Button
                                                    className="h-8 px-4 rounded-full text-xs"
                                                    onClick={() => setAssignAllMilestones(true)}
                                                >
                                                    Assign all <ArrowSvg className="ml-1 w-3 h-3" />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-[12px] leading-[16px] font-normal text-[#6DAB9C] max-w-[280px]">
                                                    All previous milestones will be assigned along with this one.
                                                </p>
                                                <div className="flex items-center gap-1 text-white text-xs font-normal shrink-0">
                                                    Assignment confirmed <SuccessCheckSvg className="w-3.5 h-3.5" />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <DateInputField
                                label="Date"
                                placeholder="12/02/2026"
                                id="date"
                                name="date"
                                value={date}
                                onChange={setDate}
                                inputClassName="h-[58px] justify-center"
                            />

                            <div className="grid grid-cols-[1.5fr_1fr] gap-4">
                                <InputField
                                    label="Signed By"
                                    placeholder="Vanquish CEO"
                                    type="text"
                                    id="signed-by"
                                    name="signedBy"
                                    value={signedBy}
                                    onChange={(e) => setSignedBy(e.target.value)}
                                    inputClassName="h-[58px] justify-center"
                                />

                                <div className="flex flex-col gap-1">
                                    {/* <span className="text-[12px] leading-[16px] font-normal capitalize text-(--Primary-700,#636363) mb-[-4px]">
                                        Signature
                                    </span> */}
                                    <div className="relative h-[58px] rounded-xl flex items-center justify-between px-4 bg-white/3 border border-transparent">
                                        <div className="relative w-full h-[30px]">
                                            <Image
                                                src="/signature-preview.png"
                                                alt="Signature"
                                                fill
                                                className="object-contain"
                                                onError={(e) => {
                                                    // Fallback if image doesn't exist
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                            <span className="text-xl font-script text-white hidden only:block">
                                                Otakar S.
                                            </span>
                                        </div>
                                        <Upload className="w-4 h-4 text-neutral-400 cursor-pointer" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-4 gap-4">
                                <Button
                                    className="flex-1 bg-none! border-none! bg-transparent! text-neutral-400 hover:text-white"
                                    onClick={() => setShowDiscard(true)}
                                >
                                    Discard
                                </Button>
                                <Button
                                    className="flex-1 rounded-full"
                                    onClick={handleNext}
                                >
                                    Next
                                    <ArrowSvg className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <span className="text-xs text-neutral-500">Preview</span>

                            {/* Certificate Preview Card */}
                            <div className="w-full aspect-5/6 bg-neutral-900 rounded-xl relative overflow-hidden border border-white/5">
                                <Image
                                    src="/certificate-2.png"
                                    alt="Certificate Preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex justify-between items-center gap-4 mt-2">
                                <Button
                                    className="flex-1 bg-none! border-none! bg-transparent! text-neutral-400 hover:text-white"
                                    onClick={() => setShowDiscard(true)}
                                >
                                    Discard
                                </Button>
                                <Button
                                    className="flex-1 rounded-full"
                                    onClick={handleAssign}
                                >
                                    Assign
                                    <SuccessCheckSvg className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>

            <DiscardCertificateModal
                isOpen={showDiscard}
                onClose={() => setShowDiscard(false)}
                onConfirm={() => {
                    setShowDiscard(false);
                    onOpenChange(false);
                    setStep(1);
                }}
            />
        </Dialog>
    );
}
