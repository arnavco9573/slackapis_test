'use client';

import Link from 'next/link';
import Button from '@/components/core/button';
import ArrowSvg from '@/components/svg/arrow';
import ForbiddenOctagon from '@/components/svg/forbidden-octagon';
import { addDays, format, formatDate } from 'date-fns';
import { useNextTask } from '../_utils/useNextTask';
import { getTitleFromCategory, formatNumber } from '../_utils/utils';

export function NextTaskCard({
    task,
}: {
    task: {
        id: string;
        status: string;
        category: string;
        investor_transaction_id?: string;
        type?: string;
        investment_batch?: any;
        transaction?: any;
        investor?: any;
        strategy?: any;
    };
}) {
    const validCategories = [
        'registration_request',
        'slack_onboarding',
        'assign_market_portal',
        'transaction_verification',
        'add_mt_account',
        'withdrawal_approval',
        'withdraw_from_mt_account',
        'add_transaction',
    ];

    if (!validCategories.includes(task.category)) {
        return null;
    }

    const { data: nextTask, isLoading } = useNextTask(
        task.investor_transaction_id,
        task.id,
        task.status === 'completed',
        task.category,
        (task as any).transaction?.type
    );

    const isCompleted = task.status === 'completed';
    const isUnlocked = !!nextTask && isCompleted && !isLoading;

    const nextTitle = nextTask?.category
        ? getTitleFromCategory(nextTask.category, nextTask.status)
        : 'Next Task';

    const amount = (nextTask as any)?.transaction?.amount;
    const investor = (nextTask as any)?.wl_partner || (nextTask as any)?.investor;
    const strategy = (nextTask as any)?.strategy;
    const createdAt = nextTask?.created_at;

    // Check if this is a WL partner onboarding task
    const isWLPartnerTask = ['registration_request', 'slack_onboarding', 'assign_market_portal'].includes(nextTask?.category || '');

    return (
        <div className="w-full flex flex-col mt-[36px] gap-8">
            <h3 className="text-sm text-text-mid font-normal">Next Task</h3>
            <div className="relative flex flex-col gap-3 bg-card section-border rounded-xl" style={{ width: '510px' }}>
                <div className="flex gap-16 bg-card section-border p-6 rounded-xl items-end" style={{ width: '510px' }}>
                    <div className="flex flex-col gap-4">
                        <div className="text-2xl font-medium text-text-highest ">
                            {nextTitle}
                        </div>
                        {isWLPartnerTask ? (
                            // WL Partner Task Fields
                            <>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-(--Primary-600) font-normal leading-4">
                                        Company
                                    </p>
                                    <h3 className="text-base text-text-high font-normal leading-5">
                                        {investor?.company_name || '-'}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-(--Primary-600) font-normal leading-4">
                                        Manager
                                    </p>
                                    <h3 className="text-base text-text-high font-normal leading-5">
                                        {investor?.manager_name || '-'}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-(--Primary-600) font-normal leading-4">
                                        Email
                                    </p>
                                    <h3 className="text-base text-text-high font-normal leading-5">
                                        {investor?.email || '-'}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-(--Primary-600) font-normal leading-4">
                                        Market Request
                                    </p>
                                    <h3 className="text-base text-text-high font-normal leading-5">
                                        {investor?.market_request || '-'}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-(--Primary-600) font-normal leading-4">
                                        Created
                                    </p>
                                    <h3 className="text-base text-text-high font-normal leading-5">
                                        {createdAt ? formatDate(createdAt, 'dd MMM yyyy') : '-'}
                                    </h3>
                                </div>
                            </>
                        ) : (
                            // Transaction Task Fields
                            <>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-(--Primary-600) font-normal leading-4">
                                        Amount
                                    </p>
                                    <h3 className="text-base text-text-high font-normal leading-5">
                                        {amount ? `$${formatNumber(amount)}` : '-'}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-(--Primary-600) font-normal leading-4">
                                        Partner/Investor
                                    </p>
                                    <h3 className="text-base text-text-high font-normal leading-5">
                                        {investor
                                            ? `${investor.first_name || investor.manager_name || ''} ${investor.last_name || ''}`
                                            : '-'}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-(--Primary-600) font-normal leading-4">
                                        Strategy
                                    </p>
                                    <h3 className="text-base text-text-high font-normal leading-5">
                                        {task?.investment_batch?.investor_strategies &&
                                            task?.investment_batch?.investor_strategies.length > 0
                                            ? 'Multi Strategy Allocation'
                                            : strategy?.title || '-'}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-(--Primary-600) font-normal leading-4">
                                        Created
                                    </p>
                                    <h3 className="text-base text-text-high font-normal leading-5">
                                        {createdAt ? formatDate(createdAt, 'dd MMM yyyy') : '-'}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-(--Primary-600) font-normal leading-4">
                                        Due Date
                                    </p>
                                    <h3 className="text-base text-text-high font-normal leading-5">
                                        {createdAt
                                            ? format(addDays(new Date(createdAt), 7), 'dd MMM yyyy')
                                            : '-'}
                                    </h3>
                                </div>
                            </>
                        )}
                    </div>

                    <Link href={nextTask?.id ? `/task-management/${nextTask.id}` : '#'}>
                        <Button
                            className="w-44 mt-auto h-10 flex gap-2 items-center"
                            disabled={!isUnlocked}
                        >
                            Open <ArrowSvg className="size-5 -rotate-45" />
                        </Button>
                    </Link>
                </div>

                {!isUnlocked && (
                    <div
                        className="absolute inset-0 flex items-center justify-center rounded-[12px] z-10"
                        style={{
                            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.35) 100%)',
                            backdropFilter: 'blur(2px)',
                        }}
                    >
                        <div className="w-[260px] text-text-mid flex items-center gap-3 flex-col mt-25">
                            <ForbiddenOctagon className="size-10 text-white" />
                            <p className="text-sm text-center font-normal leading-5 text-white">
                                You need to complete the previous task before accessing this one
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
