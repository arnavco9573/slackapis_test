"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface TaskCreationProgressProps {
    activeStep: number
    progress: number // 0 to 100 for the active step
    className?: string
}

const TaskCreationProgress = ({ activeStep, progress, className }: TaskCreationProgressProps) => {
    return (
        <div className={cn("flex gap-2 w-full", className)}>
            {/* Bar 1 */}
            <div className="h-1 flex-1 relative rounded-[70px] overflow-hidden">
                <div className="absolute inset-0 bg-[#636363] opacity-[0.2]" />
                <div
                    className={cn(
                        "h-full bg-white transition-all duration-300 rounded-[70px]",
                        activeStep > 1 ? "w-full" : "w-0"
                    )}
                    style={{
                        width:
                            activeStep === 1
                                ? `${progress}%`
                                : activeStep > 1
                                    ? "100%"
                                    : "0%",
                    }}
                />
            </div>

            {/* Bar 2 */}
            <div className="h-1 flex-1 relative rounded-[70px] overflow-hidden">
                <div className="absolute inset-0 bg-[#636363] opacity-[0.2]" />
                <div
                    className={cn(
                        "h-full bg-white transition-all duration-300 rounded-[70px]",
                        activeStep === 2 ? "w-full" : "w-0"
                    )}
                    style={{ width: activeStep === 2 ? `${progress}%` : "0%" }}
                />
            </div>
        </div>
    )
}

export default TaskCreationProgress
