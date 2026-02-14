'use client';
import { useState } from 'react';
import TabSelector from '@/components/core/tab-selector';
import Button from '@/components/core/button';
import SearchSvg from '@/components/svg/search';
import PlusSvg from '@/components/svg/plus';
import GradientSeparator from '@/components/core/gradient-separator';
import CreateCategoryModal from '../_components/create-category-modal';

export default function PrimaryChecklistHeader() {
    const [activeTab, setActiveTab] = useState('usa');
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    const tabs = [
        { id: 'usa', label: 'USA List' },
        { id: 'global', label: 'Global List' },
    ];

    return (
        <div className="flex flex-col gap-9 px-4">
            {/* Header Content */}
            <div className="flex flex-col gap-9">
                <h1
                    className="text-(--Primary-White,#FFF) font-medium"
                    style={{
                        fontSize: '42px',
                        lineHeight: '46px',
                        fontStyle: 'normal',
                    }}
                >
                    Primary Operational Checklist
                </h1>

                <div className="flex items-center justify-between">
                    <TabSelector
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={(tabId) => setActiveTab(tabId)}
                    />

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div
                            className="flex items-center gap-3 px-4 py-2 w-[320px]"
                            style={{
                                borderRadius: '90px',
                                border: '0.5px solid var(--System-GR-Neutral-5-01, rgba(255, 255, 255, 0.05))',
                                background: 'var(--Neutral-Neutrals-03, rgba(255, 255, 255, 0.03))',
                            }}
                        >
                            <SearchSvg className="text-(--Primary-500,#9C9C9C)" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-transparent border-none outline-none text-(--Primary-White,#FFF) placeholder:text-(--Primary-500,#9C9C9C) text-base w-full"
                            />
                        </div>

                        {/* Create New Category Button */}
                        <Button
                            className="flex items-center gap-2"
                            onClick={() => setIsCategoryModalOpen(true)}
                        >
                            <span>Create New Category</span>
                            <PlusSvg />
                        </Button>
                    </div>
                </div>
            </div>

            <GradientSeparator />

            <CreateCategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
            />
        </div>
    );
}
