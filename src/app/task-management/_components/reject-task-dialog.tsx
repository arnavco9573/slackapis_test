'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import Button from '@/components/core/button';
import { cn } from '@/lib/utils';
// import { useRejectTask } from '../../_components/hooks';
import WarningTriangleSvg from '@/components/svg/warning-triangle';
import CloseSvg from '@/components/svg/close';
import { X } from 'lucide-react';
import TextareaField from '@/components/core/textarea-field';

interface RejectTaskProps {
    taskId: string;
    className?: string;
    disabled?: boolean;
    children?: React.ReactNode;
}

export default function RejectTask({
    taskId,
    className,
    disabled,
    children,
}: RejectTaskProps) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [reason, setReason] = useState('The submitted address appears to be invalid and requires review.');
    const [isPending, setIsPending] = useState(false);
    // const { mutateAsync: rejectTask, isPending } = useRejectTask();

    const handleReject = async () => {
        try {
            setIsPending(true);
            // const res = await rejectTask({ id: taskId, reason });

            // Mocking the delay and success for now
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success('Task rejected successfully');
            setOpen(false);
            setStep(1); // Reset for next time
        } catch (error) {
            console.error(error);
            toast.error('Network error, please try again');
        } finally {
            setIsPending(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setStep(1); // Reset step when dialog closes
        }
    };

    const iconContainerStyles = "flex w-[60px] h-[60px] p-4 justify-center items-center rounded-xl border-[0.5px] border-solid border-(--Primary-700)";
    const iconContainerBg = {
        background: "linear-gradient(0deg, var(--Neutrals-10, rgba(255, 255, 255, 0.10)) -0.21%, var(--Neutrals-01, rgba(255, 255, 255, 0.01)) 105.1%)",
        border: "1px solid var(--Primary-700)",
        borderRadius: "12px"
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <div className={cn("cursor-pointer", className, disabled && "pointer-events-none opacity-50")}>
                    {children ? children : (
                        <p className="py-1 px-2 h-10 flex items-center gap-2 w-fit cursor-pointer text-base text-cta-text font-normal leading-6">
                            Reject
                        </p>
                    )}
                </div>
            </DialogTrigger>

            <DialogContent
                className="bg-[#1D1E21] border-0 section-border shadow-none p-6 flex flex-col items-center rounded-xl overflow-hidden outline-none gap-0"
                overlayClassName="bg-neutral-03 backdrop-blur-[40px]"
                hideClose
                style={{
                    width: "380px",
                    height: step === 1 ? "240px" : "410px"
                }}
            >
                {step === 1 ? (
                    <div className="flex flex-col items-center w-full gap-6">
                        <div className={iconContainerStyles} style={iconContainerBg}>
                            <WarningTriangleSvg className="size-5 text-white" />
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <p className="text-text-highest text-center text-base font-normal leading-6">
                                Are you sure you want to reject the registration request?
                            </p>
                        </div>

                        <div className="flex gap-5 justify-between items-center w-full">
                            <Button
                                className=" flex-1 bg-transparent! border-none! bg-none! text-white!"
                                onClick={() => setOpen(false)}
                            >
                                No
                            </Button>

                            <Button
                                onClick={() => setStep(2)}
                                className="flex-1 "
                            >
                                Yes
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center w-full gap-6">
                        <div className={iconContainerStyles} style={iconContainerBg}>
                            <X className="size-5 text-white" />
                        </div>

                        <div className="flex flex-col gap-2 w-full items-center">
                            <h3 className="text-text-highest text-center text-xl font-normal">Reject</h3>
                            <p className="text-text-mid text-center text-sm font-normal leading-5 px-2">
                                Kindly share the reason fo the registration rejection with the client
                            </p>
                        </div>

                        <div className="flex flex-col items-start w-full gap-0.5">
                            <TextareaField
                                id="reject-reason"
                                name="reason"
                                placeholder="Enter reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                inputClassName="h-24"
                                rows={4}
                            />
                        </div>

                        <div className="flex justify-between items-center w-full gap-5">
                            <Button
                                className="flex-1 bg-transparent! bg-none! border-none!"
                                onClick={handleReject}
                            >
                                Skip
                            </Button>

                            <Button
                                onClick={handleReject}
                                disabled={isPending || reason.length < 20}
                                className="flex-1"
                            >
                                {isPending ? 'Processing...' : 'Send'}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
