"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import Button from "@/components/core/button"
import EditPencilSvg from "@/components/svg/edit-pencil"
import Trash2 from "@/components/svg/trash2"

import ManageTaskModal from "./ManageTaskModal"
import DeleteTaskModal from "./DeleteTaskModal"
import PlusSvg from "@/components/svg/plus"
import CreateTaskPartnerModal from "./CreateTaskPartnerModal"

interface Task {
    id: string
    title: string
    description: string
    points: number
    requiresSubmission: boolean
    isLive?: boolean
}

interface Category {
    id: string
    name: string
    description: string
    tasks: Task[]
}

interface TaskListProps {
    categories: Category[]
    category: Category
    completedTaskIds: string[]
    selectedTaskId: string | null
    onTaskSelect: (taskId: string) => void
    onUpdateTask: (task: any) => void
    onDeleteTask: (taskId: string) => void
    onCreateTask: (task: any) => void
}

const TaskList = ({
    categories,
    category,
    completedTaskIds,
    selectedTaskId,
    onTaskSelect,
    onUpdateTask,
    onDeleteTask,
    onCreateTask
}: TaskListProps) => {
    const [isManageModalOpen, setIsManageModalOpen] = React.useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [editingTask, setEditingTask] = React.useState<Task | null>(null)
    const [taskToDelete, setTaskToDelete] = React.useState<{ id: string, title: string } | null>(null)

    const handleEditClick = (task: Task) => {
        setEditingTask(task)
        setIsManageModalOpen(true)
    }

    const handleDeleteClick = (taskId: string, taskTitle: string) => {
        setTaskToDelete({ id: taskId, title: taskTitle })
        setIsDeleteModalOpen(true)
    }

    const handleCreateClick = () => {
        setIsCreateModalOpen(true)
    }
    return (
        <div className="flex flex-col gap-8 h-full bg-card section-border p-6 overflow-hidden">
            <div className="flex flex-col gap-4 shrink-0">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1 max-w-[90%]">
                        <h2 className="text-[18px] font-medium text-white leading-[22px]">{category.name}</h2>
                        <p className="text-[14px] font-normal text-neutral-40 leading-[18px] overflow-hidden text-ellipsis whitespace-nowrap">
                            {category.description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2 no-scrollbar">
                {category.tasks.map((task) => (
                    <div
                        key={task.id}
                        className={cn(
                            "group flex items-center justify-between px-4 py-2.5 rounded-[12px] border transition-all duration-300 cursor-pointer",
                            selectedTaskId === task.id
                                ? "bg-white/10 border-[#636363]"
                                : "bg-[#1A1A1A]/40 border-transparent hover:bg-white/5"
                        )}
                        onClick={() => onTaskSelect(task.id)}
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <div className="flex items-center gap-3 flex-1">
                                <div onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        id={task.id}
                                        checked={completedTaskIds.includes(task.id)}
                                        disabled
                                        className="w-4 h-4 rounded-[4px] border-white/20 data-[state=checked]:bg-white/80 data-[state=checked]:text-black disabled:opacity-100 disabled:cursor-default"
                                    />
                                </div>
                                <label
                                    className={cn(
                                        "text-[15px] font-light transition-colors duration-300 cursor-pointer flex items-center gap-2",
                                        completedTaskIds.includes(task.id) ? "text-neutral-40" : "text-white/90"
                                    )}
                                >
                                    {task.title}
                                </label>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[12px] text-neutral-40">{task.points} pts</span>
                            <div className="flex items-center gap-4 ml-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className="text-neutral-60 hover:text-white transition-colors"
                                    onClick={() => handleEditClick(task)}
                                >
                                    <EditPencilSvg className="size-[18px]" />
                                </button>
                                <button
                                    className="text-[#FF5353]/60 hover:text-[#FF5353] transition-colors"
                                    onClick={() => handleDeleteClick(task.id, task.title)}
                                >
                                    <Trash2 className="size-[18px]" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-start items-center shrink-0 pt-4 mt-auto">
                <Button
                    className="gap-2 text-text-highest text-[14px] font-normal rounded-full px-6 py-2"
                    onClick={handleCreateClick}
                >
                    Create New Task <PlusSvg className="size-[18px]" />
                </Button>
            </div>

            <ManageTaskModal
                isOpen={isManageModalOpen}
                onClose={() => setIsManageModalOpen(false)}
                onSave={onUpdateTask}
                categories={categories}
                defaultCategoryId={category.id}
                editTask={editingTask}
            />

            <CreateTaskPartnerModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={(task) => {
                    // In real world, logic would be added here to ensure this task is specially created for this white label
                    onCreateTask(task)
                }}
                categories={categories}
                defaultCategoryId={category.id}
            />

            <DeleteTaskModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => onDeleteTask(taskToDelete?.id || "")}
                taskTitle={taskToDelete?.title}
            />
        </div>
    )
}

export default TaskList
