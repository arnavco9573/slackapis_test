'use client';

import { useTaskStore } from '../../../_store/taskStore';
import TaskPageLayout from '../../../_components/TaskPageLayout';
import StatusSelect from '../../../_components/StatusSelect';
import { getTitleFromCategory, formatDate } from '../../../_utils/utils';
import Button from '@/components/core/button';
import TaskActionPanel from '@/app/task-management/_components/TaskActionPanel';
import { toast } from 'sonner';
import ChipBordered from '@/components/core/chip-bordered';

export default function AssignMarketPortalDetails() {
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
                                <p className="text-xs text-text-low font-normal">
                                    Task Id: <span className="text-text-high ml-1">{currentTask.id}</span>
                                </p>
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
                        <h3 className="text-base text-text-highest font-normal">Portal Assignment Details</h3>
                        <div className="flex flex-col gap-4 bg-card section-border p-5">
                            <DetailRow label="Tags" value={currentTask.tag} />
                            <DetailRow label="Company" value={currentTask.wl_partner?.company_name} />
                            <DetailRow label="Client" value={currentTask.wl_partner?.manager_name} />
                            <DetailRow label="E-mail" value={currentTask.wl_partner?.email} />
                            <DetailRow label="Phone number" value={currentTask.wl_partner?.phone} />
                            <DetailRow label="Market Request" value={currentTask.wl_partner?.market_request} />
                            <DetailRow label="Registration Date" value={formatDate(currentTask.wl_partner?.registration_date || '')} />
                            <DetailRow label="Onboarding date" value={formatDate(currentTask.wl_partner?.onboarding_date || '')} />
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
            footerContent={null}
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
