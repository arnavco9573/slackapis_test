'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Plus, Minus, Ban } from 'lucide-react'
import Button from '@/components/core/button'
import { useSyncStore, Availability } from '../../stores/useSyncStore'
import { cn } from '@/lib/utils'
import ArrowSvg from '@/components/svg/arrow'

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

export default function StepAvailability() {
    const { setStep, availability, setAvailability } = useSyncStore()

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

    return (
        <div className="flex flex-col items-center justify-center w-full h-full mt-31">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-[520px] p-8 bg-[#1D1E21] border border-white/10 rounded-2xl flex flex-col gap-8 shadow-2xl overflow-hidden"
            >
                <div>
                    <h2 className="text-base font-normal text-white mb-1">Set Your Availability</h2>
                    <p className="text-(--Primary-600) text-sm font-normal">Set when you're regularly available for appointments</p>
                </div>

                <div className="flex flex-col gap-4 max-h-[440px] overflow-y-auto custom-scrollbar">
                    {DAYS.map((day) => {
                        const slots = availability[day.key] || []
                        const isAvailable = slots.length > 0

                        return (
                            <div key={day.key} className="flex flex-col gap-1">
                                <div className="flex items-center justify-between min-h-[56px] py-1">
                                    <span className={cn(
                                        "text-sm font-normal w-12 shrink-0",
                                        isAvailable ? "text-white" : "text-(--Primary-600)"
                                    )}>
                                        {day.label}
                                    </span>

                                    {isAvailable ? (
                                        <div className="flex flex-col gap-2 flex-1 transition-all">
                                            {slots.map((slot, index) => (
                                                <div key={index} className="flex items-center justify-end gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative flex items-center justify-center bg-white/3 border border-white/10 rounded-lg h-[40px] w-[76px] group/select">
                                                            <select
                                                                value={slot.start}
                                                                onChange={(e) => updateTime(day.key, index, 'start', e.target.value)}
                                                                className="w-full h-full bg-transparent text-white text-[13px] border-none focus:ring-0 cursor-pointer text-center appearance-none z-10 px-0"
                                                            >
                                                                {HOURS.map(h => (
                                                                    <option key={h.value} value={h.value} className="bg-[#1D1E21]">{h.label}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <span className="text-white text-[13px] font-normal w-4 text-center">To</span>

                                                        <div className="relative flex items-center justify-center bg-white/3 border border-white/10 rounded-lg h-[40px] w-[76px] group/select">
                                                            <select
                                                                value={slot.end}
                                                                onChange={(e) => updateTime(day.key, index, 'end', e.target.value)}
                                                                className="w-full h-full bg-transparent text-white text-[13px] border-none focus:ring-0 cursor-pointer text-center appearance-none z-10 px-0"
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
                                                                <Ban size={20} strokeWidth={1.5} />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => removeSlot(day.key, index)}
                                                                className="p-1 text-red-500/70 hover:text-red-400 transition-colors"
                                                            >
                                                                <Minus size={20} strokeWidth={1.5} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-end flex-1 gap-4">
                                            <span className="text-(--Primary-600) text-sm font-normal">Unavailable</span>
                                            <div className="w-8 flex justify-end">
                                                <button
                                                    onClick={() => toggleDay(day.key)}
                                                    className="p-1 text-(--Primary-600) hover:text-white transition-colors"
                                                >
                                                    <Plus size={20} strokeWidth={1.5} />
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
                    onClick={() => setStep('review')}
                    className="w-full"
                >
                    Next <ArrowSvg className="transition-transform group-hover:translate-x-1" />
                </Button>
            </motion.div>
        </div>
    )
}
