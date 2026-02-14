'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChevronDown from '@/components/svg/chevron-down';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import TaskCreationProgress from './task-creation-progress';
import { SelectInput } from '@/components/core/select-input';
import InputField from '@/components/core/input-field';
import TextareaField from '@/components/core/textarea-field';
import Button from '@/components/core/button';
import { Category } from '../data';
import ArrowSvg from '@/components/svg/arrow';
import SuccessCheckSvg from '@/components/svg/success-check';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    defaultCategoryId?: string;
}

import { useQuery } from '@tanstack/react-query';
import { getBlogs } from '@/app/learn/actions';

const CreateTaskModal = ({
    isOpen,
    onClose,
    categories,
    defaultCategoryId
}: CreateTaskModalProps) => {
    const [step, setStep] = useState(1);
    const [materialType, setMaterialType] = useState<string>('');
    const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        categoryId: defaultCategoryId || (categories.length > 0 ? categories[0].id : ''),
        market: 'GLOBAL',
        title: '',
        description: '',
        guide: '',
        points: '',
        docName: '',
        docDescription: '',
        docCategory: '',
    });

    const { data: blogsData, isLoading: isLoadingBlogs, isFetching } = useQuery({
        queryKey: ['blogs'],
        queryFn: () => getBlogs({ pageSize: 10, status: 'published' }),
        enabled: isOpen,
    });
    const blogs = blogsData?.data || [];

    const categoryOptions = categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }));

    const marketOptions = [
        { value: 'USA', label: 'USA' },
        { value: 'GLOBAL', label: 'GLOBAL' },
    ];

    const materialTypeOptions = [
        { value: 'Guidance', label: 'Guidance' },
        { value: 'Request For Documents', label: 'Request For Documents' },
    ];

    const docCategoryOptions = [
        { value: 'All', label: 'All' },
        { value: 'Company Incorporation', label: 'Company Incorporation' },
        { value: 'Brand Identity', label: 'Brand Identity' },
        { value: 'Platform Setup', label: 'Platform Setup' },
        { value: 'Legal & Compliance', label: 'Legal & Compliance' },
    ];

    const toggleBlogSelection = (blogId: string) => {
        setSelectedBlogs(prev =>
            prev.includes(blogId)
                ? prev.filter(id => id !== blogId)
                : [...prev, blogId]
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[540px] bg-card section-border p-0 overflow-hidden rounded-[12px] gap-0"
                overlayClassName='bg-neutral-01 backdrop-blur-2xl'
                hideClose>
                <div className="flex flex-col p-8 gap-0">
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-8">
                        <DialogTitle className="text-[16px] font-medium text-white leading-[20px]">
                            Create New Task
                        </DialogTitle>
                        <DialogClose
                            className="opacity-70 ring-offset-background transition-opacity hover:opacity-100 outline-none"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5 text-white" />
                            <span className="sr-only">Close</span>
                        </DialogClose>
                    </DialogHeader>

                    <TaskCreationProgress activeStep={step} progress={step === 1 ? 50 : 20} className="mb-8" />

                    <div className="flex flex-col gap-5">
                        {step === 1 ? (
                            <>
                                <SelectInput
                                    label="Category"
                                    value={formData.categoryId}
                                    options={categoryOptions}
                                    onChange={(val) => setFormData({ ...formData, categoryId: val })}
                                />

                                <SelectInput
                                    label="Market Type"
                                    value={formData.market}
                                    options={marketOptions}
                                    onChange={(val) => setFormData({ ...formData, market: val })}
                                />

                                <InputField
                                    id="task-title"
                                    name="title"
                                    label="Title"
                                    placeholder="Write new task name"
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    inputClassName='h-[58px] justify-center'
                                />

                                <InputField
                                    id="task-description"
                                    name="description"
                                    label="Task Description"
                                    placeholder="Write description for the new task"
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    inputClassName='h-[58px] justify-center'
                                />

                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[12px] font-normal text-neutral-40">
                                        Task Guide (Optional)
                                    </span>
                                    <TextareaField
                                        id="task-guide"
                                        name="guide"
                                        placeholder="Guide white label for this task"
                                        value={formData.guide}
                                        onChange={(e) => setFormData({ ...formData, guide: e.target.value })}
                                        rows={4}
                                    />
                                </div>

                                <InputField
                                    id="task-points"
                                    name="points"
                                    label="Points"
                                    placeholder="Number of points archived on completion of this task"
                                    type="text"
                                    value={formData.points}
                                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                                    inputClassName='h-[58px] justify-center'
                                />
                            </>
                        ) : (
                            <>
                                <SelectInput
                                    label="Attach Guidance & Requirements (Optional)"
                                    value={materialType}
                                    placeholder="Select material type"
                                    options={materialTypeOptions}
                                    onChange={(val) => setMaterialType(val)}
                                />

                                {materialType === 'Guidance' && (
                                    <div className="flex flex-col gap-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <div className="relative flex flex-col items-start gap-[2px] self-stretch rounded-xl px-4 py-1.5 h-[58px] justify-center cursor-pointer bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                                                    <span className="text-[12px] leading-[16px] font-normal uppercase text-neutral-40">
                                                        Add Guidance
                                                    </span>
                                                    <div className="relative w-full flex items-center justify-between">
                                                        <span className={cn(
                                                            "text-[16px] leading-[20px] font-normal truncate",
                                                            selectedBlogs.length > 0 ? "text-white" : "text-neutral-50"
                                                        )}>
                                                            {selectedBlogs.length > 0
                                                                ? `${selectedBlogs.length} blogs selected`
                                                                : 'Select guidance'}
                                                        </span>
                                                        <ChevronDown className="size-3 text-neutral-50" />
                                                    </div>
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                className="w-(--radix-popover-trigger-width) p-4 bg-[#1A1A1A] border border-white/10 rounded-[12px] shadow-2xl z-50 mt-2"
                                                align="start"
                                                sideOffset={4}
                                            >
                                                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                                                    {isLoadingBlogs || (isFetching && blogs.length === 0) ? (
                                                        <div className="text-center py-8 text-neutral-40 animate-pulse">
                                                            Loading blogs...
                                                        </div>
                                                    ) : blogs.length > 0 ? (
                                                        blogs.map((blog: any) => (
                                                            <GuidanceCard
                                                                key={blog.documentId}
                                                                blog={blog}
                                                                isSelected={selectedBlogs.includes(blog.documentId)}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleBlogSelection(blog.documentId);
                                                                }}
                                                            />
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-4 text-neutral-40">No blogs found.</div>
                                                    )}
                                                </div>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        {/* Selected Blogs List */}
                                        {selectedBlogs.length > 0 && (
                                            <div className="flex flex-col gap-3 mt-2">
                                                {blogs
                                                    .filter((blog: any) => selectedBlogs.includes(blog.documentId))
                                                    .map((blog: any) => (
                                                        <GuidanceCard
                                                            key={`selected-${blog.documentId}`}
                                                            blog={blog}
                                                            isSelected={true}
                                                            onClick={() => toggleBlogSelection(blog.documentId)}
                                                        />
                                                    ))
                                                }
                                            </div>
                                        )}
                                    </div>
                                )}

                                {materialType === 'Request For Documents' && (
                                    <div className="flex flex-col gap-5">
                                        <InputField
                                            id="doc-name"
                                            name="docName"
                                            label="Document Name"
                                            placeholder="Add document name"
                                            type="text"
                                            value={formData.docName}
                                            onChange={(e) => setFormData({ ...formData, docName: e.target.value })}
                                            inputClassName='h-[58px] justify-center'
                                        />
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[12px] font-normal text-neutral-40">
                                                Description
                                            </span>
                                            <TextareaField
                                                id="doc-description"
                                                name="docDescription"
                                                placeholder="Guide white label for this document submission"
                                                value={formData.docDescription}
                                                onChange={(e) => setFormData({ ...formData, docDescription: e.target.value })}
                                                rows={4}
                                            />
                                        </div>
                                        <SelectInput
                                            label="Document Category"
                                            value={formData.docCategory}
                                            placeholder="Choose the category this document belongs to"
                                            options={docCategoryOptions}
                                            onChange={(val) => setFormData({ ...formData, docCategory: val })}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-6 pt-10">
                        <Button
                            // variant="primary"
                            className="flex-1 bg-transparent! bg-none! border-none!"
                            onClick={onClose}
                        >
                            Discard
                        </Button>
                        <Button
                            className="flex-1 rounded-full"
                            onClick={() => {
                                if (step === 1) {
                                    setStep(2);
                                } else {
                                    // Handle completion
                                    console.log('Final Form Data:', { ...formData, selectedBlogs, materialType });
                                    onClose();
                                }
                            }}
                        >
                            {step === 1 ? (
                                <>
                                    Next <ArrowSvg className="ml-2 h-4 w-4" />
                                </>
                            ) : (
                                <>
                                    Done <SuccessCheckSvg className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};


const GuidanceCard = ({ blog, isSelected, onClick }: { blog: any, isSelected: boolean, onClick: (e: any) => void }) => (
    <div
        onClick={onClick}
        className={cn(
            "flex items-center gap-4 p-4 transition-all cursor-pointer",
            "border border-white/5 hover:border-white/10",
            isSelected ? "border-white/20 bg-white/5" : "bg-(--Neutral-Neutrals-03,rgba(255,255,255,0.03))"
        )}
        style={{ borderRadius: '8px' }}
    >
        <div
            className="flex shrink-0 size-4 items-center justify-center overflow-hidden transition-all duration-200"
            style={{
                borderRadius: '2.286px',
                border: isSelected ? '0.286px solid var(--Primary-White, #FFF)' : '0.286px solid var(--Primary-700, #636363)',
                background: isSelected
                    ? 'var(--Primary-White, #FFF)'
                    : 'linear-gradient(0deg, rgba(255, 255, 255, 0.10) -0.21%, rgba(255, 255, 255, 0.01) 105.1%)',
                padding: '3.429px'
            }}
        >
            {isSelected && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 1L3.5 6.5L1 4" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </div>
        <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[15px] font-light text-white/90 truncate">{blog.title}</span>
            <div className="flex items-center gap-2">
                <span className="text-[12px] text-neutral-40 bg-white/5 px-2 py-0.5 rounded-full capitalize">
                    {blog.category?.name || 'General'}
                </span>
                <span className="text-[12px] text-[#4ADE80] bg-[#4ADE80]/10 px-2 py-0.5 rounded-full">
                    {(blog.blog_status?.toLowerCase() === 'published' || blog.publishedAt) ? 'Published' : 'Draft'}
                </span>
            </div>
        </div>
    </div>
);

export default CreateTaskModal;
