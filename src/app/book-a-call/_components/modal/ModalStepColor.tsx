'use client'

import React from 'react'
import { motion } from 'motion/react'
import { Palette, Loader2 } from 'lucide-react'
import ColorPickerSvg from '@/components/svg/color-picker'
import Button from '@/components/core/button'
import { useSyncStore } from '../../stores/useSyncStore'
import { updateTeamColorsBatch } from '../../actions/updateTeamColorsBatch'
import { toast } from 'sonner'

// Preset colors for the picker
const PRESET_COLORS = [
    '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981', '#06B6D4',
    '#3B82F6', '#6366F1', '#8B5CF6', '#D946EF', '#EC4899', '#64748B'
]

interface ModalStepColorProps {
    onComplete: () => void
}

// Helper to convert hex to rgba for the gradient
const hexToRgba = (hex: string, alpha: number) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    return `rgba(${r},${g},${b},${alpha})`;
}

export default function ModalStepColor({ onComplete }: ModalStepColorProps) {
    const { members, setMembers, isLoading, setLoading } = useSyncStore()
    const [activeId, setActiveId] = React.useState<string | null>(null)

    const updateMemberColor = (id: string, color: string) => {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, color } : m))
        setActiveId(null) // Close picker after selection
    }

    const handleSaveColors = async () => {
        setLoading(true)
        try {
            const updates = members.map(m => ({
                id: m.id,
                color: m.color || PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]
            }))

            const result = await updateTeamColorsBatch(updates)
            if (result.success) {
                toast.success("Team setup complete!")
                onComplete()
            } else {
                toast.error("Failed to save colors")
            }
        } catch (error) {
            toast.error("Error saving colors")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full w-full">
            <p className="text-sm text-gray-500 mb-6">
                Assign a unique color to each member for the calendar view.
            </p>

            <div className="space-y-3">
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                >
                    <div className="grid gap-3">
                        {members.map(member => {
                            const gradientStyle = member.color
                                ? { background: `linear-gradient(90deg, ${hexToRgba(member.color, 0.32)} 0%, ${hexToRgba(member.color, 0.03)} 100%)` }
                                : {};

                            return (
                                <div
                                    key={member.id}
                                    className="flex h-[48px] items-center justify-between p-3 bg-neutral-03 rounded-xl transition-colors hover:bg-neutral-03 relative"
                                    style={gradientStyle}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white transition-colors overflow-hidden border border-[#333]"
                                            style={{ backgroundColor: member.avatar_url ? 'transparent' : (member.color || '#333') }}
                                        >
                                            {member.avatar_url ? (
                                                <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                member.name.charAt(0)
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white">{member.name}</div>
                                            <div className="text-xs text-gray-500">{member.workspace_email}</div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={() => setActiveId(activeId === member.id ? null : member.id)}
                                            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                                        >
                                            <ColorPickerSvg className="text-gray-400 group-hover:text-white" />
                                        </button>

                                        {activeId === member.id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setActiveId(null)}
                                                />
                                                <div className="absolute right-0 top-full mt-2 z-20 p-3 bg-[#1F1F1F] border border-[#333] rounded-xl shadow-xl w-[180px]">
                                                    <div className="flex gap-2 flex-wrap justify-center">
                                                        {PRESET_COLORS.map(c => (
                                                            <button
                                                                key={c}
                                                                onClick={() => updateMemberColor(member.id, c)}
                                                                className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${member.color === c ? 'ring-2 ring-white scale-110' : ''}`}
                                                                style={{ backgroundColor: c }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>
            </div>

        </div>
    )
}
