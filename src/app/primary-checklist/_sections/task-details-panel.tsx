'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Task } from '../data';
import { Play } from 'lucide-react';
import Button from '@/components/core/button';
import EditPencilSvg from '@/components/svg/edit-pencil';

interface TaskDetailsPanelProps {
    task: Task;
    onUploadClick?: () => void;
}

const TaskDetailsPanel = ({ task, onUploadClick }: TaskDetailsPanelProps) => {
    return (
        <div className="flex flex-col gap-8 h-full bg-card section-border p-6 overflow-hidden">
            <h2 className="text-[24px] font-medium text-white leading-[28px]">{task.title}</h2>

            <div className="flex-1 flex flex-col gap-6 p-6 rounded-2xl bg-card section-border overflow-y-auto no-scrollbar">
                <div className="flex flex-col gap-3">
                    <p className="text-base text-text-high leading-relaxed font-light">
                        {task.description.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </p>
                </div>

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
                    <p className="text-sm text-neutral-40">Edit Document requirement</p>
                    <p className="text-sm text-neutral-40">by White label</p>
                </div>
                <Button
                    className="px-6 gap-2"
                >
                    Edit <EditPencilSvg className="size-4" />
                </Button>
            </div>
        </div>
    );
};

export default TaskDetailsPanel;
