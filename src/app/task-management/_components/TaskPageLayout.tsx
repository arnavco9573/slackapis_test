'use client';

import React from 'react';
import BackButton from '@/components/core/back-button';
import { cn } from '@/lib/utils';
import GradientSeparator from '@/components/core/gradient-separator';
import { useRouter } from 'next/navigation';

interface TaskPageLayoutProps {
    title?: string | React.ReactNode | null;
    headerActions?: React.ReactNode;
    leftColumnContent: React.ReactNode;
    rightColumnContent?: React.ReactNode;
    actionPanel?: React.ReactNode;
    footerContent?: React.ReactNode;
    className?: string;
    showSeparator?: boolean;
    cardWidth?: '610px'; // 610px for tasks with messaging, 720px for tasks without
}

export default function TaskPageLayout({
    title,
    headerActions,
    leftColumnContent,
    rightColumnContent,
    actionPanel,
    footerContent,
    className,
    showSeparator = true,
    cardWidth = '610px', // Default to 610px for tasks without messaging
}: TaskPageLayoutProps) {
    const router = useRouter();
    return (
        <div className={cn('min-h-screen bg-[var(--Primary-800)]', className)}>
            <div className="flex mt-[46px] pl-10 pr-4 flex-col gap-2 pb-24">
                <div className="flex items-center gap-2 mb-6">
                    <BackButton onClick={() => router.back()} />
                </div>

                <div className="flex flex-col gap-8">
                    {/* Header Section - Only show if title or headerActions exist */}
                    {(title || headerActions) && (
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-4">
                                    {title && (
                                        <h1 className="text-3xl font-semibold text-text-highest">
                                            {title}
                                        </h1>
                                    )}
                                    {headerActions}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content Grid */}
                    <div className="flex gap-10 items-start w-full">
                        {/* Left Column - Main Details Card */}
                        <div className="flex flex-col items-start">
                            {/* Glassmorphism Card Wrapper */}
                            <div
                                className="flex flex-col rounded-xl"
                                style={{
                                    width: cardWidth,
                                    background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
                                    boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                {leftColumnContent}
                            </div>
                        </div>

                        {/* Right Column - Secondary Content */}
                        {rightColumnContent && (
                            <div className="flex flex-col gap-6 w-full sticky top-8">
                                {rightColumnContent}
                            </div>
                        )}
                    </div>

                    {/* Action Panel */}
                    {actionPanel}

                    {/* Separator */}
                    {showSeparator && <GradientSeparator opacity={0.9} />}

                    {/* Footer Content (Next Task Card) */}
                    {footerContent}
                </div>
            </div>
        </div>
    );
}
