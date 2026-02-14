'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import ChevronDown from '@/components/svg/chevron-down';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SelectInputProps {
    label?: string;
    value: string | null;
    onChange: (value: string) => void;
    options: { value: string; label: string;[key: string]: any }[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    inputClassName?: string;
    triggerClassName?: string;
    error?: string;
    variant?: 'default' | 'button';
    icon?: React.ReactNode;
    readOnly?: boolean;
}

export const SelectInput = ({
    label,
    value,
    onChange,
    options,
    placeholder = 'Select option',
    disabled,
    className,
    inputClassName,
    triggerClassName,
    error,
    variant = 'default',
    icon,
    readOnly,
}: SelectInputProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(opt => opt.value === value);
    const displayLabel = selectedOption ? selectedOption.label : placeholder;
    const hasValue = value !== '';

    const borderGradient = error
        ? 'var(--input-border-error)'
        : isOpen
            ? 'var(--input-border-active)'
            : hasValue
                ? 'var(--input-border-filled)'
                : 'var(--input-border-default)';

    const inputBackground = 'var(--Neutral-Neutrals-03, rgba(255, 255, 255, 0.03))';

    return (
        <div className={cn('relative flex flex-col gap-1 w-full', className)}>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <div
                        className={cn(
                            'relative flex flex-col items-start gap-[2px] self-stretch rounded-xl px-4 py-1.5 h-[58px] justify-center cursor-pointer',
                            (disabled || readOnly) && 'cursor-not-allowed opacity-50',
                            readOnly && 'pointer-events-none',
                            inputClassName,
                            triggerClassName
                        )}
                        style={{
                            borderRadius: 'var(--input-border-radius, 8px)',
                            background: inputBackground,
                        }}
                    >
                        <div
                            className="absolute inset-0 pointer-events-none rounded-[inherit]"
                            style={{
                                padding: '1px',
                                background: borderGradient,
                                WebkitMask:
                                    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude',
                            }}
                        />

                        {label && (
                            <span className="text-[12px] leading-[16px] font-normal text-(--Primary-700,#636363) z-10 transition-colors">
                                {label}
                            </span>
                        )}

                        <div className="relative w-full z-10 flex items-center justify-between">
                            <span
                                className={cn(
                                    'text-[16px] leading-[20px] font-normal truncate',
                                    hasValue ? 'text-(--Primary-White,#FFF)' : 'text-(--Primary-500,#9C9C9C)',
                                )}
                            >
                                {displayLabel}
                            </span>
                            {icon ? icon : !readOnly && (
                                <ChevronDown className={cn("size-3 text-(--Primary-500,#9C9C9C) transition-transform", isOpen && "rotate-180")} />
                            )}
                        </div>
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className="w-(--radix-popover-trigger-width) p-2 border-0 z-50"
                    align="start"
                    sideOffset={8}
                    style={{
                        borderRadius: '12px',
                        background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
                        boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {options.map((option) => (
                            <DropdownMenuItem
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "cursor-pointer px-4 py-2.5 mb-1 text-sm text-text-highest outline-none transition-all",
                                    "focus:text-text-high focus:rounded-[500px] focus:border-[0.5px] focus:border-[#636363] focus:[background:linear-gradient(0deg,rgba(255,255,255,0.10)_-0.21%,rgba(255,255,255,0.00)_105.1%)]",
                                    "hover:text-text-high hover:rounded-[500px] hover:[background:linear-gradient(0deg,rgba(255,255,255,0.10)_-0.21%,rgba(255,255,255,0.00)_105.1%)]",
                                    value === option.value && "text-text-high"
                                )}
                                style={value === option.value ? {
                                    borderRadius: '500px',
                                    border: '0.5px solid var(--Primary-700, #636363)',
                                    background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.10) -0.21%, rgba(255, 255, 255, 0.00) 105.1%)'
                                } : {}}
                            >
                                {option.label}
                            </DropdownMenuItem>
                        ))}
                        {options.length === 0 && (
                            <div className="px-4 py-2 text-sm text-gray-500 italic">No options available</div>
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            {error && (
                <span className="text-red-500 text-xs ml-1">{error}</span>
            )}
        </div>
    );
};
