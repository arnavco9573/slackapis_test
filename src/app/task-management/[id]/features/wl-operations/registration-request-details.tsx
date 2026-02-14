'use client';

import { useTaskStore } from '../../../_store/taskStore';
import TaskPageLayout from '../../../_components/TaskPageLayout';
import StatusSelect from '../../../_components/StatusSelect';
import { NextTaskCard } from '../../../_components/NextTaskCard';
import { getTitleFromCategory, formatDate } from '../../../_utils/utils';
import Button from '@/components/core/button';
import TaskActionPanel from '@/app/task-management/_components/TaskActionPanel';
import { toast } from 'sonner';
import ChipBordered from '@/components/core/chip-bordered';

export default function RegistrationRequestDetails() {
    const { currentTask, completeTask, isLoading, updateTaskStatus } = useTaskStore();

    if (!currentTask) return null;

    const handleComplete = async () => {
        await completeTask();
        toast.success('Task marked as completed');
    };

    return (
        <TaskPageLayout
            leftColumnContent={
                <div className="flex flex-col gap-8 p-6">
                    {/* Top: Task Id, Title & Status */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-3">
                            <ChipBordered className='w-fit'>
                                Task Id: <span className="text-text-high ml-1">{currentTask.id}</span>
                            </ChipBordered>

                            <h1 className="text-white text-2xl font-normal tracking-tight">
                                {getTitleFromCategory(currentTask.category)}
                            </h1>
                        </div>
                        <StatusSelect
                            status={currentTask.status}
                            onStatusChange={(newStatus) => updateTaskStatus(newStatus as any)}
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <p className="text-(--Primary-600) text-sm font-normal">Description</p>
                        <p className="text-text-highest text-base font-normal leading-tight">
                            {currentTask.description}
                        </p>
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-base text-text-highest font-normal">Registration Details</h3>
                        <div className="flex flex-col gap-4 bg-card section-border p-5">
                            <DetailRow label="Tags" value={currentTask.tag} />
                            <DetailRow label="Company" value={currentTask.wl_partner?.company_name} />
                            <DetailRow label="Client" value={currentTask.wl_partner?.manager_name} />
                            <DetailRow label="Role" value="Manager" />
                            <DetailRow label="E-mail" value={currentTask.wl_partner?.email} />
                            <DetailRow label="Phone number" value={currentTask.wl_partner?.phone} />
                            <DetailRow label="Country" value={currentTask.wl_partner?.country} />
                            <DetailRow label="State" value={currentTask.wl_partner?.state} />
                            <DetailRow label="City" value={currentTask.wl_partner?.city} />
                            <DetailRow label="Address" value={currentTask.wl_partner?.address} />
                            <DetailRow label="Registration Date" value={formatDate(currentTask.wl_partner?.registration_date || '')} />
                            <DetailRow
                                label="Onboarding date"
                                value={
                                    <div className="flex items-center gap-1.5">
                                        {formatDate(currentTask.wl_partner?.onboarding_date || '')}
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
                                            <path d="M7 9.33333V7M7 4.66667H7.00583M13 7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7C1 3.68629 3.68629 1 7 1C10.3137 1 13 3.68629 13 7Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                }
                            />
                            <DetailRow label="Market Request" value={currentTask.wl_partner?.market_request} />
                        </div>
                    </div>
                </div>
            }
            rightColumnContent={null}
            actionPanel={
                <TaskActionPanel
                    onComplete={handleComplete}
                    isCompleting={isLoading}
                    status={currentTask.status}
                    taskId={currentTask.id}
                    completionLabel="Mark Complete"
                />
            }
            footerContent={<NextTaskCard task={currentTask} />}
        />
    );
}

function DetailRow({ label, value }: { label: string; value?: string | React.ReactNode }) {
    return (
        <div className="flex items-center">
            <p className="text-sm text-(--Primary-600) font-normal w-[180px] shrink-0">{label}</p>
            <p className="text-sm text-text-highest font-normal">{value || '-'}</p>
        </div>
    );
}
