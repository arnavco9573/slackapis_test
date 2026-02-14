"use client"

import React, { useState } from "react"
import ChecklistHeader from "../_components/ChecklistHeader"
import ChecklistProgressBar from "../_components/ChecklistProgressBar"
import CategoryNavigation from "../_components/CategoryNavigation"
import TaskList from "../_components/TaskList"
import TaskDetails from "../_components/TaskDetails"
import { cn } from "@/lib/utils"
import { PartnerData } from "../../data"

interface OperationalChecklistProps {
    partner: PartnerData
}

// Mock data for the checklist
const mockChecklistCategories = [
    {
        id: "category-1",
        name: "Communication Entry",
        description: "Initial communication setup and channel entry",
        tasks: [
            {
                id: "task-comm-1",
                title: "Setup Slack Channel",
                description: "Create a dedicated Slack channel for communication with the partner.",
                points: 5,
                guideItems: ["Create #partner-name channel", "Invite key stakeholders"],
                requiresSubmission: false
            }
        ]
    },
    {
        id: "category-2",
        name: "Business Foundation",
        description: "Initial agreement, payment and communication setup",
        tasks: [
            {
                id: "task-1",
                title: "Sign Vanquish Solution white label services Agreement",
                description: "Sign the official service agreement to formalize your partnership with Vanquish. This agreement outlines service scope, responsibilities, and compliance requirements and is required before activation.",
                points: 5,
                guideItems: [
                    "The agreement will be sent to the primary decision-maker listed during onboarding",
                    "Documents are signed digitally using Zoho e-Sign",
                    "No printing, scanning, or physical paperwork required"
                ],
                requiresSubmission: true
            },
            {
                id: "task-2",
                title: "Pay white label onboarding fee",
                description: "Initial onboarding fee payment to trigger infrastructure setup.",
                points: 3,
                guideItems: ["Invoice will be generated upon signing", "Payment via wire transfer or CC"],
                requiresSubmission: false
            },
            {
                id: "task-3",
                title: "Conform primary decision maker",
                description: "Identify and confirm the individual authorized to make decisions.",
                points: 2,
                requiresSubmission: false
            },
            {
                id: "task-4",
                title: "Accept Slack invite",
                description: "Join the Slack workspace for real-time collaboration.",
                points: 4,
                requiresSubmission: false
            },
            {
                id: "task-5",
                title: "Submit brand asserts",
                description: "Provide high-resolution logos, brand fonts, and primary colors.",
                points: 10,
                requiresSubmission: true
            }
        ]
    }
    // Add more categories as needed...
]

const OperationalChecklist = ({ partner }: OperationalChecklistProps) => {
    const [categories, setCategories] = useState(mockChecklistCategories)
    const [selectedCategoryId, setSelectedCategoryId] = useState("category-2")
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(["task-1", "task-2", "task-3", "task-4"])

    // Determine active tab if applicable
    const isMultiMarket = partner?.marketType?.includes("Global") && partner?.marketType?.includes("USA")
    const [activeMarketTab, setActiveMarketTab] = useState("USA")

    const selectedCategory = categories.find(c => c.id === selectedCategoryId) || categories[0]
    const selectedTask = selectedCategory.tasks.find(t => t.id === selectedTaskId)

    // ... handlers ...

    const handleUpdateTask = (updatedTask: any) => {
        setCategories(prev => prev.map(cat => ({
            ...cat,
            tasks: cat.tasks.map(task => task.id === updatedTask.id ? { ...task, ...updatedTask } : task)
        })))
    }

    const handleDeleteTask = (taskId: string) => {
        setCategories(prev => prev.map(cat => ({
            ...cat,
            tasks: cat.tasks.filter(task => task.id !== taskId)
        })))
        if (selectedTaskId === taskId) setSelectedTaskId(null)
    }

    const handleCreateTask = (newTask: any) => {
        const id = `task-${Date.now()}`
        setCategories(prev => prev.map(cat => {
            if (cat.id === newTask.categoryId) {
                return {
                    ...cat,
                    tasks: [...cat.tasks, { ...newTask, id }]
                }
            }
            return cat
        }))
    }

    const totalTasks = categories.reduce((acc, cat) => acc + cat.tasks.length, 0)
    const progress = totalTasks > 0 ? Math.round((completedTaskIds.length / totalTasks) * 100) : 0

    return (
        <div className="flex flex-col gap-8 w-full">
            <ChecklistHeader
                showTabs={isMultiMarket}
                activeTab={activeMarketTab}
                onTabChange={setActiveMarketTab}
            />

            <ChecklistProgressBar progress={progress} />

            <div className="flex flex-col gap-0 w-full bg-card section-border rounded-xl">
                <CategoryNavigation
                    currentCategoryId={selectedCategoryId}
                    onCategoryChange={(id) => {
                        setSelectedCategoryId(id)
                        setSelectedTaskId(null)
                    }}
                />

            </div>
            <div className="flex gap-5 h-[500px] pt-0">
                <div className={cn("h-full transition-all duration-300", selectedTask ? "w-[70%]" : "w-full")}>
                    <TaskList
                        categories={categories}
                        category={selectedCategory}
                        completedTaskIds={completedTaskIds}
                        selectedTaskId={selectedTaskId}
                        onTaskSelect={setSelectedTaskId}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                        onCreateTask={handleCreateTask}
                    />
                </div>

                {selectedTask && (
                    <div className="w-[30%] h-full transition-all duration-300">
                        <TaskDetails task={selectedTask} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default OperationalChecklist
