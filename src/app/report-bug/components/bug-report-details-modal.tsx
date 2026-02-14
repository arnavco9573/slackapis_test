'use client';

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
import { TooltipWrapper } from '@/components/core/info-tooltip';

interface BugReportDetailsModalProps {
    report: any | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function BugReportDetailsModal({
    report,
    isOpen,
    onClose,
}: BugReportDetailsModalProps) {
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                hideClose
                className="w-[550px] max-h-[90vh] overflow-y-auto custom-scrollbar pt-8 pr-8 pb-[28px] pl-8 border-none focus:outline-none flex flex-col items-start gap-6"
                style={{
                    background: '#1D1E21',
                    borderRadius: '12px',
                    boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                    backdropFilter: 'blur(10px)',
                }}
                overlayClassName='bg-neutral-03/50 backdrop-blur-2xl'
            >
                <VisuallyHidden.Root>
                    <DialogTitle>Bug Report: {report.title}</DialogTitle>
                </VisuallyHidden.Root>

                {/* Header Section */}
                <div className="flex justify-between items-center w-full">
                    <ChipBordered>
                        <span className="text-sm font-normal text-text-highest">
                            <span className="text-(--Primary-600)">Date: </span>
                            {formatDate(report.created_at)}
                        </span>
                    </ChipBordered>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-white cursor-pointer"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-8 w-full">
                    <h2 className="text-[20px] font-normal text-text-highest leading-tight tracking-tight">
                        {report.title}
                    </h2>

                    <div className="flex gap-4">
                        <div className="bg-neutral-03 rounded-full flex items-center gap-2 px-2.5 py-0.5 whitespace-nowrap">
                            <span className="text-[12px] text-(--Primary-600)">Category:</span>
                            <span className="text-[12px] text-text-highest">{report.category}</span>
                        </div>
                        {report.reporter_name && report.reporter_name !== 'Unknown' && (
                            <div className="bg-neutral-03 rounded-full flex items-center gap-2 px-2.5 py-0.5 whitespace-nowrap">
                                <span className="text-[12px] text-(--Primary-600)">{getReporterLabel()}</span>
                                <span className="text-[12px] text-text-highest">{report.reporter_name}</span>
                            </div>
                        )}
                        <div className="bg-neutral-03 rounded-full flex items-center gap-2 px-2.5 py-0.5">
                            <span className="text-[12px] text-(--Primary-600)">Status:</span>
                            <span className={cn(
                                "text-[12px] font-normal",
                                report.status === 'pending' ? "text-negative" :
                                    report.status === 'resolved' ? "text-system-positive" :
                                        "text-text-mid"
                            )}>
                                {(report.status || 'Pending').charAt(0).toUpperCase() + (report.status || 'Pending').slice(1).toLowerCase()}
                            </span>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[14px] font-normal text-[#9C9C9C]">Description</label>
                        <div className="bg-neutral-02 section-border rounded-[8px] p-3 text-text-highest text-[12px] leading-tight">
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
                                                <span className="text-[12px] text-(--Primary-600) font-normal leading-[14px] uppercase">
                                                    {extension} Document
                                                </span>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog >
    );
}
