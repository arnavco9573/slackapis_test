'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/core/button';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SuccessCheckSvg from '@/components/svg/success-check';
import WarningTriangleSvg from '@/components/svg/warning-triangle';
import RejectTask from './reject-task-dialog';

interface TaskActionPanelProps {
    onComplete?: () => void;
    onReject?: () => void;
    isCompleting?: boolean;
    isRejecting?: boolean;
    disabled?: boolean;
    status: string;
    assignedUser?: string;
    showReject?: boolean;
    taskId?: string; // Optional taskId to enable RejectTask dialog functionality
    completionLabel?: string;
    showTaskManagementButton?: boolean;
}

export default function TaskActionPanel({
    onComplete,
    onReject,
    isCompleting,
    isRejecting,
    disabled,
    status,
    assignedUser,
    showReject = true,
    completionLabel = 'Mark Complete',
    showTaskManagementButton = false,
    taskId,
}: TaskActionPanelProps) {
    const router = useRouter();
    const [dialogType, setDialogType] = useState<'none' | 'completion' | 'rejection'>('none');

    // Close dialog automatically when task becomes completed or rejected
    useEffect(() => {
        if (status === 'completed' || status === 'rejected') {
            setDialogType('none');
        }
    }, [status]);

    const handleCompleteClick = () => {
        setDialogType('completion');
    };

    const handleRejectClick = () => {
        setDialogType('rejection');
    };

    const handleConfirm = () => {
        if (dialogType === 'completion') {
            onComplete?.();
        } else if (dialogType === 'rejection') {
            onReject?.();
        }
    };

    const isPending = dialogType === 'completion' ? isCompleting : isRejecting;

    return (
        <>
            <div className="w-full flex items-center mt-[20px] mb-[20px] justify-end">
                <div className="flex justify-end items-center gap-4">
                    {showReject && status !== 'completed' && status !== 'rejected' && (
                        taskId ? (
                            <RejectTask taskId={taskId}>
                                <div className='py-1 px-2 h-10 flex items-center gap-2 w-fit cursor-pointer text-base text-cta-text font-normal leading-6 bg-transparent border-none hover:bg-transparent'>
                                    {isRejecting ? 'Rejecting...' : 'Reject'}
                                </div>
                            </RejectTask>
                        ) : (
                            <Button
                                onClick={handleRejectClick}
                                disabled={disabled || isRejecting}
                                className="bg-none border-none hover:bg-none"
                            >
                                {isRejecting ? 'Rejecting...' : 'Reject'}
                            </Button>
                        )
                    )}

                    {status === 'completed' ? (
                        showTaskManagementButton ? (
                            <Button
                                onClick={() => router.push('/task-management')}
                                className={cn(
                                    'bg-cta-primary-normal hover:bg-cta-primary-hover text-cta-text flex items-center gap-2 rounded-full px-6'
                                )}
                            >
                                Task Management
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2 text-(--Primary-700) font-medium px-6 py-2 bg-neutral-01 rounded-full cursor-not-allowed">
                                Mark Complete
                                <SuccessCheckSvg className="size-5 text-(--Primary-700)" />
                            </div>
                        )
                    ) : (
                        <Button
                            onClick={handleCompleteClick}
                            disabled={disabled || isCompleting}
                            className={cn(
                                'bg-cta-primary-normal hover:bg-cta-primary-hover text-cta-text flex items-center gap-2 rounded-full px-6'
                            )}
                        >
                            {isCompleting ? (
                                <>
                                    <Loader2 className="animate-spin size-4" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {completionLabel}
                                    <SuccessCheckSvg className="size-4" />
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            <Dialog open={dialogType !== 'none'} onOpenChange={(open) => !open && setDialogType('none')}>
                <DialogContent
                    className="p-6 border-0 bg-[#1D1E21] section-border rounded-xl flex flex-col gap-6 items-center justify-center overflow-hidden"
                    overlayClassName="bg-neutral-03 backdrop-blur-[40px]"
                    hideClose
                    style={{
                        width: "380px",
                        height: "280px"
                    }}
                >
                    <div className="flex flex-col items-center w-full gap-8 pt-[48px] px-6 pb-6">
                        <div className="flex w-[60px] h-[60px] p-4 justify-center items-center rounded-xl border-[0.5px] border-solid border-(--Primary-700)"
                            style={{
                                background: "linear-gradient(0deg, var(--Neutrals-10, rgba(255, 255, 255, 0.10)) -0.21%, var(--Neutrals-01, rgba(255, 255, 255, 0.01)) 105.1%)"
                            }}>
                            <WarningTriangleSvg className="size-5 text-white" />
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <p className="text-text-mid text-center text-base font-normal leading-6">
                                {dialogType === 'completion'
                                    ? 'Are you sure you want to mark this task as completed?'
                                    : 'Are you sure you want to reject this task?'}
                            </p>
                        </div>

                        <div className="flex gap-3 justify-between items-center w-full">
                            <Button
                                className="flex-1 bg-transparent! border-none! bg-none! text-white!"
                                onClick={() => setDialogType('none')}
                            >
                                No
                            </Button>

                            <Button
                                onClick={handleConfirm}
                                disabled={isPending}
                                className="flex-1"
                            >
                                {isPending ? 'Processing...' : 'Yes'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
