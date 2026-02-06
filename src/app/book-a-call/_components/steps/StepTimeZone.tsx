'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Globe, Clock, CheckIcon, ChevronDown } from 'lucide-react'
import Button from '@/components/core/button'
import { useSyncStore } from '../../stores/useSyncStore'
import { CountryDropdown, CountryType } from '@/components/core/country-dropdown'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import ArrowSvg from '@/components/svg/arrow'

export default function StepTimeZone() {
    const { setStep, setTimezone, timezone } = useSyncStore()
    const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(null)
    const [selectedTZ, setSelectedTZ] = useState<string>('')
    const [isTZOpen, setIsTZOpen] = useState(false)
    const [tzSearch, setTzSearch] = useState('')
    const [isTZFocused, setIsTZFocused] = useState(false)

    const timezones = useMemo(() => {
        if (!selectedCountry) return []
        return selectedCountry.timezones || []
    }, [selectedCountry])

    const hasTZValue = !!selectedTZ;
    const tzBorderGradient = isTZFocused || isTZOpen
        ? 'var(--input-border-active)'
        : hasTZValue
            ? 'var(--input-border-filled)'
            : 'var(--input-border-default)';
    const inputBackground =
        'var(--Neutral-Neutrals-03, rgba(255, 255, 255, 0.03))';

    const filteredTZ = timezones.filter(tz =>
        tz.tzName.toLowerCase().includes(tzSearch.toLowerCase()) ||
        tz.gmtOffsetName.toLowerCase().includes(tzSearch.toLowerCase()) ||
        tz.zoneName.toLowerCase().includes(tzSearch.toLowerCase())
    )

    const handleNext = () => {
        if (selectedTZ) {
            setTimezone(selectedTZ)
            setStep('availability')
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-[480px] p-8 bg-[#1D1E21] section-border rounded-xl flex flex-col gap-8 "
            >
                <div>
                    <h2 className="text-base font-normal text-white">Time Zone</h2>
                </div>

                <div className="flex flex-col gap-5">
                    {/* Country Selector */}
                    <CountryDropdown
                        label="Country"
                        onChange={(country) => {
                            setSelectedCountry(country)
                            setSelectedTZ('') // Reset TZ when country changes
                        }}
                    />

                    {/* Timezone Selector */}
                    <div className="flex flex-col gap-2 relative">
                        <Popover open={isTZOpen} onOpenChange={setIsTZOpen}>
                            <PopoverTrigger
                                disabled={!selectedCountry}
                                onFocus={() => setIsTZFocused(true)}
                                onBlur={() => setIsTZFocused(false)}
                                className={cn(
                                    "relative flex flex-col items-start gap-[2px] self-stretch rounded-xl px-4 py-1.5 w-full cursor-pointer h-auto text-left transition-colors",
                                    !selectedCountry && "opacity-50 cursor-not-allowed"
                                )}
                                style={{
                                    background: inputBackground,
                                }}
                            >
                                <div
                                    className="absolute inset-0 pointer-events-none rounded-[inherit]"
                                    style={{
                                        padding: '1px',
                                        background: tzBorderGradient,
                                        WebkitMask:
                                            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        WebkitMaskComposite: 'xor',
                                        maskComposite: 'exclude',
                                    }}
                                />

                                <span className="text-[12px] leading-[16px] font-normal capitalize text-(--Primary-700,#636363) z-10">
                                    Select Time Zone
                                </span>

                                <div className="flex items-center justify-between w-full z-10">
                                    {selectedTZ ? (
                                        <div className="flex items-center gap-3 overflow-hidden h-7">
                                            <Clock size={18} className="text-gray-400 shrink-0" />
                                            <span className="text-white truncate text-[16px] leading-[20px]">
                                                {timezones.find(t => t.zoneName === selectedTZ)?.gmtOffsetName} ({selectedTZ})
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-500 text-[16px] leading-[20px] h-7 flex items-center">
                                            {selectedCountry ? "Select time zone" : "Select a country first"}
                                        </span>
                                    )}
                                    <ChevronDown size={18} className="text-gray-500 shrink-0" />
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-(--radix-popper-anchor-width) min-w-(--radix-popper-anchor-width) p-0 bg-[#1D1E21] border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                <Command shouldFilter={false} className="bg-transparent">
                                    <CommandInput
                                        placeholder="Search time zone..."
                                        value={tzSearch}
                                        onValueChange={setTzSearch}
                                        className="h-12 border-none focus:ring-0"
                                    />
                                    <CommandList className="max-h-[240px] custom-scrollbar">
                                        <CommandEmpty className="py-6 text-center text-sm text-gray-500">No time zones found.</CommandEmpty>
                                        <CommandGroup>
                                            {filteredTZ.map((tz) => (
                                                <CommandItem
                                                    key={tz.zoneName}
                                                    onSelect={() => {
                                                        setSelectedTZ(tz.zoneName)
                                                        setIsTZOpen(false)
                                                    }}
                                                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 data-[selected=true]:bg-white/5"
                                                >
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-sm font-medium text-white">{tz.gmtOffsetName}</span>
                                                        <span className="text-xs text-gray-500">{tz.zoneName} ({tz.abbreviation})</span>
                                                    </div>
                                                    {selectedTZ === tz.zoneName && <CheckIcon size={16} className="text-white" />}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <Button
                    onClick={handleNext}
                    disabled={!selectedTZ}
                    className="w-full"
                >
                    Next <ArrowSvg className="transition-transform group-hover:translate-x-1" />
                </Button>
            </motion.div>
        </div>
    )
}
