'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import SearchSvg from '@/components/svg/search';
import { dummyTasks, Task } from './_utils/tasks';
import { getTitleFromCategory, formatDate } from './_utils/utils';
import Link from 'next/link';
import ArrowSvg from '@/components/svg/arrow';
import TopBar from '@/components/core/top-bar';
import SideBar from '@/components/core/sidebar';
import GradientSeparator from '@/components/core/gradient-separator';
import ChipFilled from '@/components/core/chip-filled';
import ChipBordered from '@/components/core/chip-bordered';
import Button from '@/components/core/button';
import { useRouter } from 'next/navigation';
import TabSelector from '@/components/core/tab-selector';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ChevronDown from '@/components/svg/chevron-down';

const statusTabs = [
    { id: 'all', label: 'All' },
    { id: 'todo', label: 'To-Do' },
    { id: 'completed', label: 'Completed' },
] as const;

const monthOptions = [
    { label: "January", value: "january" },
    { label: "February", value: "february" },
    { label: "March", value: "march" },
    { label: "April", value: "april" },
    { label: "May", value: "may" },
    { label: "June", value: "june" },
    { label: "July", value: "july" },
    { label: "August", value: "august" },
    { label: "September", value: "september" },
    { label: "October", value: "october" },
    { label: "November", value: "november" },
    { label: "December", value: "december" },
];

const categoryFilters = [
    { id: 'all', name: 'All' },
    { id: 'registration_request', name: 'Registration Request' },
    { id: 'assign_market_portal', name: 'Assign Portal' },
    { id: 'slack_onboarding', name: 'Connect Slack' },
    { id: 'other', name: 'Other' },
];

export default function TaskManagementPage() {
    const [activeStatus, setActiveStatus] = useState('all');
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('march');


    const filteredTasks = dummyTasks.filter(task => {
        const matchesStatus = activeStatus === 'all' || task.status === activeStatus;
        const matchesCategory = activeCategory === 'all' ||
            (activeCategory === 'other' ? !['registration_request', 'assign_market_portal', 'slack_onboarding'].includes(task.category) : task.category === activeCategory);
        const matchesSearch = task.wl_partner?.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            getTitleFromCategory(task.category).toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesCategory && matchesSearch;
    });

    return (
        <div className="w-full flex flex-col gap-10 p-10">
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between px-5">
                    <TabSelector
                        tabs={statusTabs as any}
                        activeTab={activeStatus}
                        onTabChange={setActiveStatus}
                        className='gap-10'
                    />


                    <div className="flex items-center gap-4">

                        <div className="relative w-80">
                            <SearchSvg className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text-low" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-neutral-03 rounded-full py-2 pl-12 pr-6 text-sm text-text-high placeholder:text-text-low focus:outline-none focus:border-neutral-20"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="h-10 px-4 flex items-center">
                                    <span className="capitalize">{selectedMonth}</span>
                                    <ChevronDown className="size-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[180px] p-4 border-0! section-border z-50 flex flex-col gap-3"
                                align="end"
                                sideOffset={8}
                                style={{
                                    borderRadius: '12px',
                                    background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
                                    boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <p className="text-sm text-text-mid">Select Month</p>
                                <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3">
                                    {monthOptions.map(option => (
                                        <div
                                            key={option.value}
                                            onClick={() => setSelectedMonth(option.value)}
                                            className="flex items-center gap-3 cursor-pointer group"
                                        >
                                            <div
                                                className={cn(
                                                    "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                                                    selectedMonth === option.value
                                                        ? "border border-white/10"
                                                        : "border border-white/10 group-hover:border-white/20"
                                                )}
                                                style={{ borderRadius: '90px' }}
                                            >
                                                {selectedMonth === option.value && (
                                                    <div className="w-2 h-2 rounded-full bg-white" />
                                                )}
                                            </div>
                                            <span className={cn(
                                                "text-sm transition-colors",
                                                selectedMonth === option.value ? "text-text-highest" : "text-text-high group-hover:text-text-highest"
                                            )}>
                                                {option.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <GradientSeparator opacity={0.9} />

                <div className="flex items-center gap-3">
                    {categoryFilters.map((filter) => (
                        <Button
                            key={filter.id}
                            onClick={() => setActiveCategory(filter.id)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                activeCategory === filter.id
                                    ? "bg-neutral-10 text-white"
                                    : "bg-none! border-none! bg-transparent! text-text-high hover:bg-neutral-03"
                            )}
                        >
                            {filter.name}
                        </Button>
                    ))}
                </div>

                <GradientSeparator opacity={0.9} />

                <div className="grid grid-cols-3 gap-5 w-full">
                    {filteredTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function TaskCard({ task }: { task: Task }) {
    const statusColors: Record<string, { text: string; bg: string }> = {
        todo: { text: '#C39C5F', bg: 'rgba(195, 156, 95, 0.1)' },
        pending: { text: '#469ABB', bg: 'rgba(70, 154, 187, 0.1)' },
        completed: { text: '#6DAB9C', bg: 'rgba(109, 171, 156, 0.1)' },
        rejected: { text: '#FF5353', bg: 'rgba(255, 83, 83, 0.1)' },
    };

    const router = useRouter();
    const colors = statusColors[task.status] || statusColors.todo;

    return (
        <div className="bg-card section-border rounded-2xl p-6 flex flex-col gap-6 hover:border-neutral-20 transition-all group">
            <div className="flex items-center justify-between">
                <ChipFilled
                    className="px-3 py-1 text-xs font-medium uppercase bg-neutral-03 rounded-full"
                    style={{ color: colors.text }}
                >
                    {task.status === 'todo' ? 'To-Do' : task.status}
                </ChipFilled>
                <ChipBordered className="px-3 py-1 text-xs text-text-mid">
                    Task Id: <span className="text-text-high ml-1">{task.id}</span>
                </ChipBordered>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-normal text-text-highest line-clamp-1">
                    {getTitleFromCategory(task.category)}
                </h3>

                <div className="flex flex-wrap gap-2">
                    <ChipFilled className="px-3 py-1 text-sm text-text-mid">
                        {task.tag}
                    </ChipFilled>
                    <ChipFilled className="px-3 py-1 text-sm text-text-mid">
                        Created: {formatDate(task.created_at)}
                    </ChipFilled>
                </div>
            </div>

            <GradientSeparator />

            <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-3">
                    <DetailChip label="Company" value={task.wl_partner?.company_name} />
                    <DetailChip label="Manager" value={task.wl_partner?.manager_name} />
                    <DetailChip label="Market Request" value={task.wl_partner?.market_request || '-'} isBold />
                </div>
                <div className="flex items-center">
                    <Button className='px-3 py-2' onClick={() => router.push(`/task-management/${task.id}`)}>
                        <ArrowSvg className="size-4" />
                    </Button>
                </div>
            </div>

        </div>
    );
}

function DetailChip({ label, value, isBold }: { label: string, value?: string, isBold?: boolean }) {
    return (
        <ChipBordered className="">
            <div className="flex items-center gap-2">
                <span className="text-xs font-normal leading-[18px] text-(--Primary-600)">{label}:</span>
                <span className={cn(
                    "text-xs leading-[18px] text-white",
                    isBold ? "font-normal" : "font-normal"
                )}>
                    {value}
                </span>
            </div>
        </ChipBordered>
    );
}
