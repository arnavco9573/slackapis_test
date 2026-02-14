"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Play } from "lucide-react"
import Button from "@/components/core/button"
import EditPencilSvg from "@/components/svg/edit-pencil"

interface Asset {
    name: string
    url: string
}

interface Task {
    id: string
    title: string
    description: string
    points: number
    guideItems?: string[]
    referenceAssets?: Asset[]
}

interface TaskDetailsProps {
    task: Task
}

const TaskDetails = ({ task }: TaskDetailsProps) => {
    return (
        <div className="flex flex-col gap-8 h-full bg-card section-border p-6 overflow-hidden">
            <h2 className="text-[24px] font-medium text-white leading-[28px]">{task.title}</h2>

            <div className="flex-1 flex flex-col gap-6 p-6 rounded-2xl bg-card section-border overflow-y-auto no-scrollbar">
                <div className="flex flex-col gap-3">
                    <p className="text-base text-text-high leading-relaxed font-light">
                        {task.description.split("\n").map((line, i) => (
                            <React.Fragment key={i}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </p>
                </div>

                {task.guideItems && task.guideItems.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-normal text-neutral-60 uppercase tracking-wider">Task Guide</h3>
                        <ul className="list-disc list-inside flex flex-col gap-2">
                            {task.guideItems.map((item, index) => (
                                <li key={index} className="text-sm text-text-high font-light">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {task.referenceAssets && task.referenceAssets.length > 0 && (
                    <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-white/5">
                        <h3 className="text-sm font-normal text-neutral-60">Helpful Resources</h3>
                        <div className="flex flex-wrap gap-3">
                            {task.referenceAssets.map((asset, index) => (
                                <Button
                                    key={index}
                                    className="flex items-center gap-2 px-4 py-2.5"
                                >
                                    <span className="text-sm text-text-high font-light">
                                        {asset.name}
                                    </span>
                                    <div className="size-5 rounded-full border border-white/40 flex items-center justify-center">
                                        <Play className="size-2 fill-white text-white translate-x-[0.5px]" />
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-4">
                <div className="flex flex-col gap-1">
                    <p className="text-sm text-neutral-40">View Document Submitted</p>
                    <p className="text-sm text-neutral-40">by White label</p>
                </div>
                <Button className="px-6 gap-2">
                    View <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 1L13 5M13 5L9 9M13 5L1 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Button>
            </div>
        </div>
    )
}

export default TaskDetails
