"use client"

import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { SelectInput } from "@/components/core/select-input"
import InputField from "@/components/core/input-field"
import TextareaField from "@/components/core/textarea-field"
import Button from "@/components/core/button"
import SuccessCheckSvg from "@/components/svg/success-check"
import { Switch } from "@/components/ui/switch"

interface Task {
    id: string
    title: string
    description: string
    points: number
    isLive?: boolean
}

interface Category {
    id: string
    name: string
}

interface ManageTaskModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (task: any) => void
    categories: Category[]
    defaultCategoryId?: string
    editTask?: Task | null
}

const ManageTaskModal = ({
    isOpen,
    onClose,
    onSave,
    categories,
    defaultCategoryId,
    editTask
}: ManageTaskModalProps) => {
    const [formData, setFormData] = useState({
        categoryId: defaultCategoryId || (categories.length > 0 ? categories[0].id : ""),
        title: "",
        description: "",
        guide: "",
        points: "",
        isLive: true
    })

    useEffect(() => {
        if (editTask) {
            setFormData({
                categoryId: defaultCategoryId || "",
                title: editTask.title,
                description: editTask.description,
                guide: "", // Guide isn't in Task interface but we have it in TaskDetails
                points: editTask.points.toString(),
                isLive: editTask.isLive ?? true
            })
        } else {
            setFormData({
                categoryId: defaultCategoryId || (categories.length > 0 ? categories[0].id : ""),
                title: "",
                description: "",
                guide: "",
                points: "",
                isLive: true
            })
        }
    }, [editTask, isOpen, defaultCategoryId, categories])

    const categoryOptions = categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }))

    const handleSave = () => {
        onSave({
            ...editTask,
            ...formData,
            points: parseInt(formData.points) || 0
        })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[540px] bg-card section-border p-0 overflow-hidden rounded-[12px] gap-0"
                overlayClassName="bg-neutral-01 backdrop-blur-2xl"
                hideClose>
                <div className="flex flex-col p-8 gap-0">
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-8">
                        <DialogTitle className="text-[16px] font-medium text-white leading-[20px]">
                            {editTask ? "Edit Task" : "Create New Task"}
                        </DialogTitle>
                        <DialogClose
                            className="opacity-70 ring-offset-background transition-opacity hover:opacity-100 outline-none"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5 text-white" />
                            <span className="sr-only">Close</span>
                        </DialogClose>
                    </DialogHeader>

                    <div className="flex flex-col gap-5">
                        <SelectInput
                            label="Category"
                            value={formData.categoryId}
                            options={categoryOptions}
                            onChange={(val) => setFormData({ ...formData, categoryId: val })}
                        />

                        <InputField
                            id="task-title"
                            name="title"
                            label="Title"
                            placeholder="Write task name"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            inputClassName="h-[58px] justify-center"
                        />

                        <InputField
                            id="task-description"
                            name="description"
                            label="Task Description"
                            placeholder="Write description for the task"
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            inputClassName="h-[58px] justify-center"
                        />

                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex flex-col gap-1">
                                <span className="text-[14px] font-medium text-white">Live Status</span>
                                <span className="text-[12px] text-neutral-40">Whether this task is visible to the white label</span>
                            </div>
                            <Switch
                                checked={formData.isLive}
                                onCheckedChange={(val: boolean) => setFormData({ ...formData, isLive: val })}
                            />
                        </div>

                        <InputField
                            id="task-points"
                            name="points"
                            label="Points"
                            placeholder="Points archived on completion"
                            type="text"
                            value={formData.points}
                            onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                            inputClassName="h-[58px] justify-center"
                        />
                    </div>

                    <div className="flex items-center justify-between gap-6 pt-10">
                        <Button
                            className="flex-1 bg-transparent! bg-none! border-none!"
                            onClick={onClose}
                        >
                            Discard
                        </Button>
                        <Button
                            className="flex-1 rounded-full px-6 py-2.5"
                            onClick={handleSave}
                        >
                            Done <SuccessCheckSvg className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ManageTaskModal
