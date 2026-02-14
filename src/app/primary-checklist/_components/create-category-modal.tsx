'use client';

import React, { useState, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import { X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SelectInput } from '@/components/core/select-input';
import InputField from '@/components/core/input-field';
import Button from '@/components/core/button';
import UploadSvg from '@/components/svg/upload';

interface CreateCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateCategoryModal = ({
    isOpen,
    onClose,
}: CreateCategoryModalProps) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        market: 'Global',
    });
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const marketOptions = [
        { value: 'Global', label: 'Global' },
        { value: 'USA', label: 'USA' },
    ];

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            setFile(files[0]);
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[486px] bg-card !section-border p-0 overflow-hidden rounded-[12px] gap-0 border-none shadow-2xl"
                overlayClassName='bg-neutral-03 backdrop-blur-2xl'
                hideClose>
                <div className="flex flex-col p-8 gap-0">
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-8">
                        <DialogTitle className="text-[20px] font-medium text-white leading-[24px]">
                            Create New Task Category
                        </DialogTitle>
                        <DialogClose
                            className="opacity-70 ring-offset-background transition-opacity hover:opacity-100 outline-none"
                            onClick={onClose}
                        >
                            <X className="h-6 w-6 text-white" />
                            <span className="sr-only">Close</span>
                        </DialogClose>
                    </DialogHeader>

                    <div className="flex flex-col gap-5">
                        <InputField
                            id="cat-title"
                            name="title"
                            label="Category Title"
                            placeholder="Write new category name"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            inputClassName='h-[58px] justify-center'
                        />

                        <InputField
                            id="cat-description"
                            name="description"
                            label="Category Description"
                            placeholder="Write description for the new category"
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            inputClassName='h-[58px] justify-center'
                        />

                        <SelectInput
                            label="Market Type"
                            value={formData.market}
                            options={marketOptions}
                            onChange={(val) => setFormData({ ...formData, market: val })}
                        />

                        <div className="flex flex-col gap-4">
                            <span className="text-[16px] font-medium text-white">Upload Icon</span>

                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={cn(
                                    "relative flex flex-col items-center justify-center p-6 gap-3 transition-all",
                                    isDragging ? "border-white/40 bg-white/10" : "bg-(--Neutral-Neutrals-03,rgba(255,255,255,0.03)) hover:border-white/20"
                                )}
                                style={{
                                    borderRadius: '8px',
                                    border: '0.5px dashed var(--Primary-700, #636363)',
                                }}
                            >
                                <input
                                    type="file"
                                    id="icon-upload"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                                <label
                                    htmlFor="icon-upload"
                                    className="flex flex-col items-center justify-center cursor-pointer gap-3 w-full h-full"
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="size-10 flex items-center justify-center">
                                            <UploadSvg />
                                        </div>
                                        <span className="text-[16px] text-(--Primary-600)">Drag or drop file</span>
                                    </div>
                                </label>
                            </div>

                            <span className="text-[12px] text-(--Primary-600)">
                                {file ? file.name : 'No file chosen'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-10">
                        <Button
                            className="flex-1 px-6 py-3 text-[16px] bg-none! border-none! bg-transparent!"
                            onClick={onClose}
                        >
                            Discard
                        </Button>
                        <Button
                            className="flex-1 px-6 py-2"
                            onClick={() => {
                                console.log('Create Category:', { ...formData, file });
                                onClose();
                            }}
                        >
                            Create
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateCategoryModal;
