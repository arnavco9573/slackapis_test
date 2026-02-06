'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckIcon, ChevronDown, Plus, Minus, Ban, Loader2 } from 'lucide-react'
import Button from '@/components/core/button'
import { CountryDropdown, CountryType } from '@/components/core/country-dropdown'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import ArrowSvg from '@/components/svg/arrow'
import ClockSvg from '@/components/svg/clock'
import { saveMasterSyncConfig } from '../actions/saveMasterSyncConfig'
import { toast } from 'sonner'
import { Availability } from '../stores/useSyncStore'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const DAYS = [
    { key: 'mon', label: 'Mon' },
    { key: 'tue', label: 'Tue' },
    { key: 'wed', label: 'Wed' },
    { key: 'thu', label: 'Thu' },
    { key: 'fri', label: 'Fri' },
    { key: 'sat', label: 'Sat' },
    { key: 'sun', label: 'Sun' }
]

const HOURS = Array.from({ length: 24 }).map((_, i) => {
    const hour = i === 0 ? 12 : i > 12 ? i - 12 : i
    const ampm = i < 12 ? 'AM' : 'PM'
    const value = `${i.toString().padStart(2, '0')}:00`
    return { label: `${hour} ${ampm}`, value }
})

interface TimeZoneEditPopoverProps {
    masterId: string
    initialTimezone?: string
    initialAvailability?: Availability
}

export default function TimeZoneEditPopover({ masterId, initialTimezone, initialAvailability }: TimeZoneEditPopoverProps) {
    const [step, setStep] = useState<'timezone' | 'availability'>('timezone')
    const [isOpen, setIsOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Timezone State
    const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(null)
    const [selectedTZ, setSelectedTZ] = useState<string>(initialTimezone || '')
    const [isTZOpen, setIsTZOpen] = useState(false)
    const [tzSearch, setTzSearch] = useState('')
    const [isTZFocused, setIsTZFocused] = useState(false)

    // Availability State
    const [availability, setAvailability] = useState<Availability>(initialAvailability || {
        mon: [{ start: '09:00', end: '17:00' }],
        tue: [{ start: '09:00', end: '17:00' }],
        wed: [{ start: '09:00', end: '17:00' }],
        thu: [{ start: '09:00', end: '17:00' }],
        fri: [{ start: '09:00', end: '17:00' }],
        sat: [],
        sun: []
    })

    useEffect(() => {
        if (initialTimezone) setSelectedTZ(initialTimezone)
        if (initialAvailability) setAvailability(initialAvailability)
    }, [initialTimezone, initialAvailability])

    const timezones = useMemo(() => {
        if (!selectedCountry) return []
        return selectedCountry.timezones || []
    }, [selectedCountry])

    const filteredTZ = timezones.filter(tz =>
        tz.tzName.toLowerCase().includes(tzSearch.toLowerCase()) ||
        tz.gmtOffsetName.toLowerCase().includes(tzSearch.toLowerCase()) ||
        tz.zoneName.toLowerCase().includes(tzSearch.toLowerCase())
    )

    const handleNext = () => {
        if (selectedTZ) {
            setStep('availability')
        }
    }

    const toggleDay = (dayKey: string) => {
        setAvailability({
            ...availability,
            [dayKey]: availability[dayKey].length > 0 ? [] : [{ start: '09:00', end: '17:00' }]
        })
    }

    const updateTime = (dayKey: string, index: number, field: 'start' | 'end', value: string) => {
        const newDaySlots = [...availability[dayKey]]
        newDaySlots[index] = { ...newDaySlots[index], [field]: value }
        setAvailability({ ...availability, [dayKey]: newDaySlots })
    }

    const addSlot = (dayKey: string) => {
        setAvailability({
            ...availability,
            [dayKey]: [...availability[dayKey], { start: '09:00', end: '17:00' }]
        })
    }

    const removeSlot = (dayKey: string, index: number) => {
        const newDaySlots = availability[dayKey].filter((_, i) => i !== index)
        setAvailability({ ...availability, [dayKey]: newDaySlots })
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await saveMasterSyncConfig(masterId, selectedTZ, availability)
            if (res.success) {
                toast.success('Availability updated successfully')
                setIsOpen(false)
                // Optionally reset step for next time
                setTimeout(() => setStep('timezone'), 300)
            } else {
                toast.error(res.message || 'Failed to update availability')
            }
        } catch (error) {
            toast.error('An error occurred while saving')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm">
                    <span>Edit Time Zone</span>
                    <ClockSvg className="" />
                </button>
            </DialogTrigger>
            <DialogContent
                className="w-[520px] max-w-[520px] p-0 bg-[#1D1E21] !section-border border-none rounded-2xl shadow-2xl overflow-hidden"
                hideClose
                overlayClassName="backdrop-blur-[40px] bg-neutral-03/80"
            >
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {step === 'timezone' ? (
                            <motion.div
                                key="timezone"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex flex-col gap-6"
                            >
                                <div>
                                    <h3 className="text-base font-medium text-white mb-1">Edit Time Zone</h3>
                                    {/* <p className="text-xs text-gray-500">Select your local time zone</p> */}
                                </div>

                                <div className="flex flex-col gap-4">
                                    <CountryDropdown
                                        label="Country"
                                        onChange={(country) => {
                                            setSelectedCountry(country)
                                            setSelectedTZ('')
                                        }}
                                    />

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
                                                    background: 'var(--Neutral-Neutrals-03, rgba(255, 255, 255, 0.03))',
                                                }}
                                            >
                                                <div
                                                    className="absolute inset-0 pointer-events-none rounded-[inherit]"
                                                    style={{
                                                        padding: '1px',
                                                        background: isTZFocused || isTZOpen ? 'var(--input-border-active)' : selectedTZ ? 'var(--input-border-filled)' : 'var(--input-border-default)',
                                                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
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
                                                            <Clock size={16} className="text-gray-400 shrink-0" />
                                                            <span className="text-white truncate text-sm">
                                                                {timezones.find(t => t.zoneName === selectedTZ)?.gmtOffsetName} ({selectedTZ})
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500 text-sm h-7 flex items-center">
                                                            {selectedCountry ? "Select time zone" : "Select a country first"}
                                                        </span>
                                                    )}
                                                    <ChevronDown size={16} className="text-gray-500 shrink-0" />
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-(--radix-popper-anchor-width) min-w-(--radix-popper-anchor-width) p-0 bg-[#1D1E21] border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                                <Command shouldFilter={false} className="bg-transparent">
                                                    <CommandInput
                                                        placeholder="Search time zone..."
                                                        value={tzSearch}
                                                        onValueChange={setTzSearch}
                                                        className="h-10 border-none focus:ring-0"
                                                    />
                                                    <CommandList className="max-h-[200px] custom-scrollbar">
                                                        <CommandEmpty className="py-4 text-center text-xs text-gray-500">No time zones found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {filteredTZ.map((tz) => (
                                                                <CommandItem
                                                                    key={tz.zoneName}
                                                                    onSelect={() => {
                                                                        setSelectedTZ(tz.zoneName)
                                                                        setIsTZOpen(false)
                                                                    }}
                                                                    className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-white/5 data-[selected=true]:bg-white/5"
                                                                >
                                                                    <div className="flex flex-col gap-0.5">
                                                                        <span className="text-xs font-medium text-white">{tz.gmtOffsetName}</span>
                                                                        <span className="text-[10px] text-gray-500">{tz.zoneName} ({tz.abbreviation})</span>
                                                                    </div>
                                                                    {selectedTZ === tz.zoneName && <CheckIcon size={14} className="text-white" />}
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
                        ) : (
                            <motion.div
                                key="availability"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col gap-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-medium text-white mb-1">Edit Your Availability</h3>
                                        <p className="text-xs text-gray-500">Set when you're regularly available for appointments</p>
                                    </div>
                                    <button
                                        onClick={() => setStep('timezone')}
                                        className="text-xs text-(--Primary-600) hover:text-white transition-colors"
                                    >
                                        Back to Time Zone
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                    {DAYS.map((day) => {
                                        const slots = availability[day.key] || []
                                        const isAvailable = slots.length > 0

                                        return (
                                            <div key={day.key} className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between min-h-[48px] py-1 border-b border-white/5 last:border-none">
                                                    <span className={cn(
                                                        "text-xs font-normal w-10 shrink-0",
                                                        isAvailable ? "text-white" : "text-(--Primary-600)"
                                                    )}>
                                                        {day.label}
                                                    </span>

                                                    {isAvailable ? (
                                                        <div className="flex flex-col gap-2 flex-1 transition-all">
                                                            {slots.map((slot, index) => (
                                                                <div key={index} className="flex items-center justify-end gap-2">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <div className="relative flex items-center justify-center bg-white/3 border border-white/10 rounded-lg h-9 w-[68px] group/select">
                                                                            <select
                                                                                value={slot.start}
                                                                                onChange={(e) => updateTime(day.key, index, 'start', e.target.value)}
                                                                                className="w-full h-full bg-transparent text-white text-[11px] border-none focus:ring-0 cursor-pointer text-center appearance-none z-10 px-0"
                                                                            >
                                                                                {HOURS.map(h => (
                                                                                    <option key={h.value} value={h.value} className="bg-[#1D1E21]">{h.label}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>

                                                                        <span className="text-white text-[11px] font-normal w-3 text-center">To</span>

                                                                        <div className="relative flex items-center justify-center bg-white/3 border border-white/10 rounded-lg h-9 w-[68px] group/select">
                                                                            <select
                                                                                value={slot.end}
                                                                                onChange={(e) => updateTime(day.key, index, 'end', e.target.value)}
                                                                                className="w-full h-full bg-transparent text-white text-[11px] border-none focus:ring-0 cursor-pointer text-center appearance-none z-10 px-0"
                                                                            >
                                                                                {HOURS.map(h => (
                                                                                    <option key={h.value} value={h.value} className="bg-[#1D1E21]">{h.label}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <div className="w-8 flex justify-end">
                                                                        {index === 0 ? (
                                                                            <button
                                                                                onClick={() => toggleDay(day.key)}
                                                                                className="p-1 text-(--Primary-600) hover:text-white transition-colors"
                                                                            >
                                                                                <Ban size={16} strokeWidth={1.5} />
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                onClick={() => removeSlot(day.key, index)}
                                                                                className="p-1 text-red-500/70 hover:text-red-400 transition-colors"
                                                                            >
                                                                                <Minus size={16} strokeWidth={1.5} />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-end flex-1 gap-2">
                                                            <span className="text-(--Primary-600) text-xs font-normal">Unavailable</span>
                                                            <div className="w-8 flex justify-end">
                                                                <button
                                                                    onClick={() => toggleDay(day.key)}
                                                                    className="p-1 text-(--Primary-600) hover:text-white transition-colors"
                                                                >
                                                                    <Plus size={16} strokeWidth={1.5} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full"
                                >
                                    {isSaving ? <Loader2 className="size-4 animate-spin" /> : <>Save Changes <ArrowSvg className="transition-transform group-hover:translate-x-1" /></>}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    )
}
