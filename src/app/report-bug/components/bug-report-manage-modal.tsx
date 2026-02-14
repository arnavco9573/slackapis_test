'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import ChipBordered from '@/components/core/chip-bordered';
import Image from 'next/image';
import { useBugReports, useUpdateBugStatus } from '../hooks';
import { toast } from 'sonner';

type BugReportPortal = 'master' | 'investor' | 'wl';
type BugReportStatus = 'pending' | 'resolved';
import Button from '@/components/core/button';
import ArrowSvg from '@/components/svg/arrow';
import { TooltipWrapper } from '@/components/core/info-tooltip';
import { SelectInput } from '@/components/core/select-input';

interface BugReportManageModalProps {
    report: any | null;
    isOpen: boolean;
    onClose: () => void;
    portal: BugReportPortal;
    status: BugReportStatus;
}

export default function BugReportManageModal({
    report,
    isOpen,
    onClose,
    portal,
    status,
}: BugReportManageModalProps) {
    const [duplicateOfId, setDuplicateOfId] = useState<string>("");

    const updateBugMutation = useUpdateBugStatus();

    // Reset duplicate selection when modal opens/changes
    useEffect(() => {
        setDuplicateOfId("");
    }, [report, isOpen]);

    // // Fetch potential duplicate targets (Commented out for dummy)
    // const { data: allReportsData } = useBugReports({ ... });
    // const reports = allReportsData?.data || [];

    // Prepare options for the dropdown (Mock options)
    const options = [
        { label: "Select duplicate of (optional)", value: "" },
        { label: "UI Bug - Header alignment", value: "mock-1" },
        { label: "Performance - Login slow", value: "mock-2" }
    ];

    if (!report) return null;

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        try {
            return format(new Date(dateString), 'dd MMM yyyy');
        } catch (e) {
            return dateString;
        }
    };

    const getFileIcon = () => {
        return (
            <div className="size-8 shrink-0 relative">
                <Image
                    src="/file-icon.svg"
                    alt="File icon"
                    fill
                    className="object-contain opacity-40"
                />
            </div>
        );
    };

    const getReporterLabel = () => {
        switch (report.portal) {
            case 'wl': return 'WL Partner:';
            case 'master': return 'Master:';
            default: return 'Reporter:';
        }
    };

    const handleAction = async () => {
        // try {
        //     const payload: any = {
        //         reportId: report.id,
        //         duplicateOf: duplicateOfId || null
        //     };

        //     // Only mark as resolved if NOT a duplicate
        //     if (!duplicateOfId) {
        //         payload.status = 'resolved';
        //     }

        //     await updateBugMutation.mutateAsync(payload);

        toast.success(duplicateOfId ? "Marked as duplicate (Demo)" : "Bug report marked as resolved (Demo)");
        onClose();
        // } catch (err) {
        //     toast.error(err instanceof Error ? err.message : "Failed to update report");
        // }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                hideClose={true}
                className="w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar pt-8 pr-8 pb-[28px] pl-8 border-none focus:outline-none flex flex-col items-start gap-6"
                style={{
                    background: '#1D1E21',
                    borderRadius: '12px',
                    boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                    backdropFilter: 'blur(10px)',
                }}
                overlayClassName='bg-neutral-03/50 backdrop-blur-2xl'
            >
                <VisuallyHidden.Root>
                    <DialogTitle>Manage Bug Report: {report.title}</DialogTitle>
                </VisuallyHidden.Root>

                {/* Header Section */}
                <div className="flex justify-between items-center w-full">
                    <ChipBordered>
                        <span className="text-sm font-normal text-text-highest">
                            <span className="text-primary-600">Date: </span>
                            {formatDate(report.created_at)}
                        </span>
                    </ChipBordered>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-white ml-4 cursor-pointer"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-8 w-full mt-2">
                    <div className="flex justify-between items-center">
                        <h2 className="text-[20px] font-normal text-text-highest leading-tight tracking-tight">
                            {report.title}
                        </h2>

                    </div>

                    <div className="flex gap-4">
                        <div className="bg-neutral-03 rounded-full flex items-center gap-2 px-2.5 py-0.5 whitespace-nowrap">
                            <span className="text-[12px] text-text-low-disabled">Category:</span>
                            <span className="text-[12px] text-text-highest">{report.category}</span>
                        </div>
                        {report.reporter_name && report.reporter_name !== 'Unknown' && (
                            <div className="bg-neutral-03 rounded-full flex items-center gap-2 px-2.5 py-0.5 whitespace-nowrap">
                                <span className="text-[12px] text-text-low-disabled">{getReporterLabel()}</span>
                                <span className="text-[12px] text-text-highest">{report.reporter_name}</span>
                            </div>
                        )}
                        <div className="bg-neutral-03 rounded-full flex items-center gap-2 px-2.5 py-0.5">
                            <span className="text-[12px] text-text-low-disabled">Status:</span>
                            <span className={cn(
                                "text-[12px] font-normal",
                                report.status === 'pending' ? "text-negative" :
                                    report.status === 'resolved' ? "text-system-positive" : "text-text-mid"
                            )}>
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1).toLowerCase()}
                            </span>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[14px] font-normal text-[#9C9C9C]">Description</label>
                        <div className="bg-neutral-02 section-border rounded-[8px] p-3 text-text-highest text-[12px] leading-tight min-h-[80px]">
                            {report.description}
                        </div>
                    </div>

                    {/* Attachment Section */}
                    {report.attachment && report.attachment.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <label className="text-[14px] font-normal text-[#9C9C9C]">Attachment</label>
                            <div className="grid grid-cols-2 gap-4 w-full">
                                {report.attachment.map((url: string, index: number) => {
                                    const rawFileName = url.split('/').pop()?.split('-').slice(1).join('-') || `attachment-${index + 1}`;
                                    const fileName = decodeURIComponent(rawFileName);
                                    const extension = url.split('.').pop()?.toUpperCase() || 'FILE';

                                    return (
                                        <a
                                            key={index}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 w-full h-[62px] p-4 rounded-[8px] transition-all group overflow-hidden"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                                                backdropFilter: 'blur(10px)',
                                            }}
                                        >
                                            <div className="shrink-0">
                                                {getFileIcon()}
                                            </div>
                                            <div className="flex flex-col gap-1 overflow-hidden">
                                                <TooltipWrapper content={fileName}>
                                                    <span className="text-[16px] font-normal text-white truncate leading-5">
                                                        {fileName}
                                                    </span>
                                                </TooltipWrapper>
                                                <span className="text-[12px] text-primary-600 font-normal leading-[14px] uppercase">
                                                    {extension} Document
                                                </span>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="w-full">
                        <SelectInput
                            label="Duplicate of"
                            options={options.slice(1)}
                            value={duplicateOfId || ""}
                            onChange={(val: string) => setDuplicateOfId(val)}
                            placeholder="Select duplicate of (optional)"
                            inputClassName="h-[58px] bg-neutral-03/30 border-neutral-05 rounded-xl"
                            className="w-full"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center w-full mt-4 gap-4">
                        <Button
                            className="flex-1 h-10 rounded-full bg-transparent bg-none border-none hover:bg-neutral-03 text-text-mid shadow-none"
                            onClick={onClose}
                            disabled={updateBugMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 h-10 rounded-full px-6 flex items-center justify-center gap-2"
                            onClick={handleAction}
                            disabled={false}
                        >
                            {duplicateOfId ? 'Mark as Duplicate' : 'Mark as Resolved'}
                            <ArrowSvg className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    );
}
