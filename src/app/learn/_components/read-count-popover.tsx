'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import ChipBordered from '@/components/core/chip-bordered'
import { ScrollArea } from '@/components/ui/scroll-area'
import Button from '@/components/core/button'
import ChevronDown from '@/components/svg/chevron-down'
import TabSelector from '@/components/core/tab-selector'
import InputField from '@/components/core/input-field'
import SearchSvg from '@/components/svg/search'

interface PartnerProgress {
    id: string
    business_name: string
    avatar_url?: string
    progress: number
    status: 'In Progress' | 'Completed'
    manager: string
    market: string
    started_at: string
}

interface ReadCountPopoverProps {
    progressData: PartnerProgress[]
}

export function ReadCountPopover({
    progressData
}: ReadCountPopoverProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState('')
    const [activeTab, setActiveTab] = React.useState<'All' | 'In progress' | 'Completed'>('All')
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Handle click outside to close
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filteredData = progressData.filter(item => {
        const matchesSearch = item.business_name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesTab = activeTab === 'All' ||
            (activeTab === 'In progress' && item.status === 'In Progress') ||
            (activeTab === 'Completed' && item.status === 'Completed')
        return matchesSearch && matchesTab
    })

    const tabs = [
        { id: 'All', label: 'All' },
        { id: 'In progress', label: 'In progress' },
        { id: 'Completed', label: 'Completed' }
    ] as const;

    return (
        <div className="relative inline-block" ref={containerRef}>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="text-sm h-[30px] px-4!"
            >
                Read count
                <ChevronDown className={cn("size-4 transition-transform", isOpen && "rotate-180")} />
            </Button>

            {isOpen && (
                <div
                    className="absolute top-[82px] right-0 mt-2 w-[420px] p-6 z-36 flex flex-col gap-6 overflow-hidden"
                    style={{
                        borderRadius: '12px',
                        background: 'var(--neutral-01)',
                        boxShadow: '6px 80px 80px 0px var(--neutral-01) inset, 0px -1px 1px 0px var(--neutral-10) inset, 0px 1px 1px 0px var(--neutral-10) inset',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid var(--neutral-10)'
                    }}
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-medium text-white">Read Count</h2>
                    </div>

                    {/* Tabs */}
                    <TabSelector
                        tabs={tabs as any}
                        activeTab={activeTab}
                        onTabChange={(tabId) => setActiveTab(tabId as any)}
                        className="text-base gap-10"
                    />

                    {/* Search */}
                    <div className="relative">
                        <InputField
                            id="booking-search"
                            name="search"
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e: any) => setSearchQuery(e.target.value)}
                            startAdornment={<SearchSvg className="text-[#636363] size-5" />}
                            inputClassName="h-10 text-sm pl-10 justify-center !items-center !text-[#636363]"
                            placeholderClassName='mt-1'
                        />
                    </div>

                    <p className="text-sm text-text-mid">
                        {filteredData.length} Partners
                    </p>

                    <ScrollArea className="h-[400px]">
                        <div className="flex flex-col gap-4 pr-3">
                            {filteredData.map((item) => (
                                <ProgressCard key={item.id} partner={item} />
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    )
}

function ProgressCard({ partner }: { partner: PartnerProgress }) {
    return (
        <div
            className="p-4 flex flex-col gap-4"
            style={{
                borderRadius: '8px',
                background: 'var(--Neutral-Neutrals-03, rgba(255, 255, 255, 0.03))'
            }}
        >
            <ChipBordered className="w-fit">
                <span className="text-[10px] text-text-high">{partner.status}</span>
            </ChipBordered>

            <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-white/10 overflow-hidden shrink-0">
                    {partner.avatar_url ? (
                        <img src={partner.avatar_url} alt={partner.business_name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-medium text-white">
                            {partner.business_name[0]}
                        </div>
                    )}
                </div>
                <span className="text-base font-medium text-white truncate">
                    {partner.business_name}
                </span>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-text-mid">{partner.progress}% completed</span>
                </div>
                {/* Progress Bar */}
                <div
                    className="h-1 w-full relative overflow-hidden"
                    style={{
                        borderRadius: '40px',
                        background: 'rgba(99, 163, 156, 0.1)'
                    }}
                >
                    <div
                        className="absolute inset-0 opacity-50 bg-(--Primary-700,#636363)"
                        style={{ borderRadius: '40px' }}
                    />
                    <div
                        className="absolute inset-y-0 left-0 transition-all duration-500"
                        style={{
                            width: `${partner.progress}%`,
                            borderRadius: '40px',
                            background: 'var(--System-Positive, #6DAB9C)'
                        }}
                    />
                </div>
            </div>

            <div className="h-px bg-white/5 w-full" />

            <div className="flex flex-wrap gap-2">
                <InfoChip label="Manager" value={partner.manager} />
                <InfoChip label="Market" value={partner.market} />
                <InfoChip label="Started reading" value={partner.started_at} />
            </div>
        </div>
    )
}

function InfoChip({ label, value }: { label: string, value: string }) {
    return (
        <div
            className="px-3 py-1 bg-white/5 border border-white/5 rounded-full flex gap-1.5 items-center"
            style={{ borderRadius: '40px' }}
        >
            <span className="text-[10px] text-text-mid">{label}:</span>
            <span className="text-[10px] text-text-high">{value}</span>
        </div>
    )
}
