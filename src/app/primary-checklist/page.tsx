'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import PrimaryChecklistHeader from './_sections/header';
import ChecklistStickyHeader from './_sections/checklist-sticky-header';
import ChecklistTaskList from './_sections/checklist-task-list';
import TaskDetailsPanel from './_sections/task-details-panel';
import { mockCategories } from './data';

export default function PrimaryChecklistPage() {
    const [selectedCategoryId, setSelectedCategoryId] = useState('category-2');
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

    const selectedCategory = mockCategories.find(c => c.id === selectedCategoryId) || mockCategories[0];
    const selectedTask = selectedCategory.tasks.find(t => t.id === selectedTaskId);

    const handleTaskToggle = (id: string) => {
        setCompletedTaskIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleNextCategory = () => {
        console.log('Next category');
    };

    return (
        <div className="p-8 pl-10 flex flex-col gap-9">
            <PrimaryChecklistHeader />

            <div className="flex flex-col gap-8 w-full">
                <ChecklistStickyHeader
                    currentCategoryId={selectedCategoryId}
                    onCategoryChange={(id) => {
                        setSelectedCategoryId(id);
                        setSelectedTaskId(null);
                    }}
                />

                <div className="flex gap-5 h-[600px]">
                    <div className={cn("h-full transition-all duration-300", selectedTask ? 'w-[60%]' : 'w-full')}>
                        <ChecklistTaskList
                            categories={mockCategories}
                            category={selectedCategory}
                            completedTaskIds={completedTaskIds}
                            selectedTaskId={selectedTaskId}
                            onTaskToggle={handleTaskToggle}
                            onTaskSelect={setSelectedTaskId}
                            onNextCategory={handleNextCategory}
                        />
                    </div>

                    {selectedTask && (
                        <div className="w-[40%] h-full transition-all duration-300">
                            <TaskDetailsPanel
                                task={selectedTask}
                                onUploadClick={() => {
                                    console.log('Upload clicked');
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
