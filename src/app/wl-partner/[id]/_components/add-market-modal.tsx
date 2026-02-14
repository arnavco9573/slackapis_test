"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import Button from "@/components/core/button"
import { X, ArrowRight } from "lucide-react"

interface AddMarketModalProps {
    isOpen: boolean
    onClose: () => void
    onAssign: (market: string) => void
    missingMarket: "USA" | "Global"
}

const AddMarketModal = ({
    isOpen,
    onClose,
    onAssign,
    missingMarket
}: AddMarketModalProps) => {
    const [isChecked, setIsChecked] = useState(false)

    const handleAssign = () => {
        if (isChecked) {
            onAssign(missingMarket)
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-[500px] bg-card section-border p-6 rounded-2xl"
                hideClose
                overlayClassName="bg-neutral-03 backdrop-blur-2xl"
            >
                <DialogTitle className="flex justify-between items-center text-white text-xl font-medium mb-6">
                    Add Market
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-neutral-400" />
                    </button>
                </DialogTitle>

                <div className="bg-card section-border p-4 rounded-xl flex items-start gap-4 mb-4">
                    <Checkbox
                        id="market-checkbox"
                        checked={isChecked}
                        onCheckedChange={(checked) => setIsChecked(checked as boolean)}
                        className="mt-1"
                        style={{
                            borderRadius: "2.286px",
                            border: "0.286px solid var(--Primary-700, #636363)",
                            background:
                                "var(--System-GR-Neutral-10-01, linear-gradient(0deg, var(--Neutrals-10, rgba(255, 255, 255, 0.10)) -0.21%, var(--Neutrals-01, rgba(255, 255, 255, 0.01)) 105.1%))"
                        }}
                    />
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="market-checkbox"
                            className="text-white text-base font-medium cursor-pointer"
                        >
                            {missingMarket}
                        </label>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            {missingMarket === "USA"
                                ? "For White Labels operating exclusively in the United States and subject to US regulatory requirements."
                                : "For White Labels operating in international markets, excluding the United States."}
                        </p>
                    </div>
                </div>

                <div className="flex justify-center gap-10 items-center w-full">
                    <Button
                        // variant="ghost"
                        onClick={onClose}
                        className="text-white bg-none! border-none! bg-transparent!"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={!isChecked}
                        className="px-8 py-2.5 rounded-full flex items-center gap-2"
                    >
                        Assign <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddMarketModal
