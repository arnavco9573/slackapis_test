'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import Button from '@/components/core/button';
import WarningTriangleSvg from '@/components/svg/warning-triangle';
import EllipseBlurSvg from '@/components/svg/ellipse-blur';

interface DeleteTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskTitle?: string;
}

const DeleteTaskModal = ({
    isOpen,
    onClose,
    onConfirm,
    taskTitle
}: DeleteTaskModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="max-w-[380px] bg-card p-0 overflow-hidden rounded-[12px] border-none shadow-2xl"
                overlayClassName="bg-neutral-01 backdrop-blur-2xl"
                hideClose
            >
                <div className="relative flex flex-col items-center p-10 pb-8 gap-0">
                    {/* Icon Container with Blur Background */}
                    <div className="relative mb-8 flex items-center justify-center">
                        <EllipseBlurSvg className="absolute inset-0 size-[240px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                        <div
                            className="relative size-16 flex items-center justify-center z-10"
                            style={{
                                borderRadius: '12px',
                                border: '0.5px solid var(--Primary-700, #636363)',
                                background: 'var(--System-GR-Neutral-10-01, linear-gradient(0deg, rgba(255, 255, 255, 0.10) -0.21%, rgba(255, 255, 255, 0.01) 105.1%))'
                            }}
                        >
                            <WarningTriangleSvg className="size-6 text-white" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 mb-10 text-center">
                        <p className="text-sm font-normal text-(--Primary-600) leading-[24px]">
                            Are you sure you delete this <br /> checklist task.
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-4 w-full">
                        <Button
                            className="flex-1 bg-transparent! bg-none! border-none!"
                            onClick={onClose}
                        >
                            No
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            Yes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteTaskModal;
