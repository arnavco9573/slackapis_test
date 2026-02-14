"use client";
import React, { useState } from "react";
import Button from "@/components/core/button";
import TabSelector from "@/components/core/tab-selector";
import GradientSeparator from "@/components/core/gradient-separator";
import CertificateIcon from "@/components/svg/certificate-icon";
import { ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { useCertificateStore } from "@/store/use-certificate-store";
import AssignCertificateModal from "../_components/assign-certificate-modal";

type TabId = "global" | "usa";

export default function HeaderSection() {
    const [activeTab, setActiveTab] = useState<TabId>("global");
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const { pushView } = useCertificateStore();
    const router = useRouter();

    return (
        <div className="flex flex-col gap-10 w-full mb-6">
            {/* Main Header Row */}
            <div className="flex justify-between items-center w-full">
                <h1 className="text-(--Primary-White,#FFF) text-[42px] font-medium leading-[46px]">
                    Certificate Management
                </h1>
                <div className="flex items-center gap-4">
                    <Button
                        className="h-10 px-6 rounded-full"
                        onClick={() => setIsAssignModalOpen(true)}
                    >
                        Assign Certificate
                    </Button>
                    <Button
                        className="h-10 px-6 rounded-full flex items-center gap-2 font-normal"
                        onClick={() => router.push('/certificates/create-category')}
                    >
                        Create New Category
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Navigation row with Tabs and Leaderboard */}
            <div className="flex justify-between items-end w-full p-6 relative">
                <TabSelector
                    tabs={[
                        { id: "global", label: "Global" },
                        { id: "usa", label: "USA" },
                    ]}
                    activeTab={activeTab}
                    onTabChange={(id) => setActiveTab(id as TabId)}
                    className="gap-10"
                />

                {/* Leaderboard Link */}
                <div
                    className="flex items-center gap-3 cursor-pointer group pb-1"
                    onClick={() => pushView('LEADERBOARD')}
                >
                    <div className="w-6 h-6 rounded-md flex items-center justify-center">
                        <CertificateIcon className="size-5 text-[#C39C5F]" />
                    </div>
                    <span className="text-white text-sm font-medium font-primary leading-5">
                        Leaderboard
                    </span>
                    <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                </div>
            </div>

            <GradientSeparator opacity={0.9} className="-mt-6" />

            <AssignCertificateModal
                open={isAssignModalOpen}
                onOpenChange={setIsAssignModalOpen}
            />
        </div>
    );
}
