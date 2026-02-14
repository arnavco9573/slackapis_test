"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/core/button";

import { cn } from "@/lib/utils";
import InputField from "@/components/core/input-field";
import TextareaField from "@/components/core/textarea-field";
import UploadSvg from "@/components/svg/upload";
import ArrowSvg from "@/components/svg/arrow";
import { toast } from "sonner";
import { CheckCircle, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSubmitBugReport, useMasterSession, useUploadBugReportFile } from "../hooks";
import { SelectInput } from "@/components/core/select-input";

// Simple file validation helper
const validateFile = (file: File, maxSizeMB: number) => {
    const isValidSize = file.size <= maxSizeMB * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const isValidType = allowedTypes.includes(file.type);

    if (!isValidType) return { isValid: false, error: "Only JPEG, PNG and PDF files are supported" };
    if (!isValidSize) return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };

    return { isValid: true };
};

const optionLabels: Record<string, string> = {
    "report-bug": "Report a Bug",
    "feature-request": "Feature Request",
    "suggestion": "Suggestion",
    "other": "Other",
};

export default function BugReportForm() {
    const router = useRouter();
    // const queryClient = useQueryClient();
    // const { data: masterProfile, isLoading: isSessionLoading } = useMasterSession();

    const [formData, setFormData] = useState({
        category: "",
        title: "",
        description: "",
    });
    const [files, setFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // const uploadFileMutation = useUploadBugReportFile();
    // const submitReportMutation = useSubmitBugReport();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({ ...prev, category: value }));
    };

    const processFiles = (newFiles: File[]) => {
        const currentFilesCount = files.length;
        const remainingCapacity = 5 - currentFilesCount;

        if (remainingCapacity <= 0) {
            setFileError("Maximum 5 attachments allowed");
            toast.error("You can only attach up to 5 files");
            return;
        }

        let filesToAdd = newFiles;
        let limitExceeded = false;

        if (newFiles.length > remainingCapacity) {
            filesToAdd = newFiles.slice(0, remainingCapacity);
            limitExceeded = true;
        }

        const validFiles: File[] = [];
        let errorMsg: string | null = null;

        filesToAdd.forEach(file => {
            const validation = validateFile(file, 5);
            if (!validation.isValid) {
                // If specific file fails, we capture the error but generally we want to add the valid ones
                // We'll set the error state to the last error encountered for visibility
                errorMsg = validation.error || `Invalid file type or size: ${file.name}`;
                toast.error(`Skipped: ${file.name} - ${validation.error}`);
            } else {
                validFiles.push(file);
            }
        });

        if (validFiles.length > 0) {
            setFiles(prev => [...prev, ...validFiles]);
            setFileError(null);
        }

        if (limitExceeded) {
            toast.warning(`Only first ${remainingCapacity} files were processed. Maximum 5 attachments allowed.`);
            if (!errorMsg) errorMsg = "Maximum 5 attachments allowed. Excess files were ignored.";
        }

        if (errorMsg && validFiles.length === 0) {
            setFileError(errorMsg);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        processFiles(Array.from(selectedFiles));

        // Reset input to allow selecting the same file again if removed
        e.target.value = '';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFiles = e.dataTransfer.files;
        if (!droppedFiles || droppedFiles.length === 0) return;

        processFiles(Array.from(droppedFiles));
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setFileError(null);
    };

    const handleSubmit = async () => {
        // // Mocking the submission process
        // if (!masterProfile?.user_id) {
        //     toast.error("You must be logged in to report a bug");
        //     return;
        // }

        const { category, title, description } = formData;

        if (!category) {
            toast.error("Please select a category");
            return;
        }

        if (!title.trim()) {
            toast.error("Please enter a title");
            return;
        }

        if (!description.trim()) {
            toast.error("Please enter a description");
            return;
        }

        // const attachmentUrls: string[] = [];

        // // Upload files if present
        // if (files.length > 0) {
        //     try {
        //         for (const file of files) {
        //             const data = new FormData();
        //             data.append('file', file);
        //             data.append('userId', masterProfile.user_id);
        //             const url = await uploadFileMutation.mutateAsync(data);
        //             if (url) attachmentUrls.push(url);
        //         }
        //     } catch (err) {
        //         toast.error(err instanceof Error ? err.message : "Failed to upload files");
        //         return;
        //     }
        // }

        // // Submit bug report
        // try {
        //     await submitReportMutation.mutateAsync({
        //         reporterId: masterProfile.user_id,
        //         title,
        //         description,
        //         category, // Storing key directly
        //         attachmentUrls,
        //         portal: 'master' // Master platform
        //     });

        //     // Invalidate queries to refetch the bug reports table
        //     queryClient.invalidateQueries({ queryKey: ['bug-reports'] });

        toast.success("Bug report submitted successfully (Demo)");
        setFormData({
            category: "",
            title: "",
            description: "",
        });
        setFiles([]);
        setFileError(null);
        router.push('/report-bug');
        // } catch (err) {
        //     toast.error(err instanceof Error ? err.message : "Failed to submit report");
        // }
    };

    const isLoading = false; // uploadFileMutation.isPending || submitReportMutation.isPending;

    return (
        <div className="flex flex-col gap-8 w-full max-w-[664px]">
            <div className="flex flex-col gap-6">
                {/* Category Section */}
                <div className="flex flex-col gap-3">
                    <SelectInput
                        label="I would like to"
                        options={[
                            { label: 'Report a Bug', value: 'report-bug' },
                            { label: 'Feature Request', value: 'feature-request' },
                            { label: 'Suggestion', value: 'suggestion' },
                            { label: 'Other', value: 'other' },
                        ]}
                        value={formData.category}
                        onChange={handleCategoryChange}
                        placeholder="Select an option"
                        inputClassName="h-[58px] justify-center! items-center"
                        className="w-full"
                    />
                </div>

                {/* Title Section */}
                <div className="flex flex-col gap-3">
                    <InputField
                        id="title"
                        label="title"
                        name="title"
                        placeholder="Write a title"
                        type="text"
                        value={formData.title}
                        onChange={handleInputChange}
                        inputClassName="h-[58px] justify-center"
                    />
                </div>

                {/* Description Section */}
                <div className="flex flex-col gap-3">
                    {/* <label className="text-sm font-medium text-text-mid">Description</label> */}
                    <TextareaField
                        id="description"
                        label="description"
                        name="description"
                        placeholder="Enter a description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={5}
                        inputClassName="min-h-[160px]"
                    />
                </div>

                {/* Attachment Section */}
                <div className="flex flex-col gap-4">
                    <label className="text-sm font-medium text-text-highest">
                        Attachment (Optional)
                    </label>

                    {/* Upload Area */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                            "relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center min-h-[120px] transition-colors",
                            isDragging
                                ? "border-text-cta bg-text-cta/5"
                                : "border-neutral-10 hover:border-neutral-05",
                            files.length > 0 ? "bg-neutral-02/50" : "bg-white/1"
                        )}
                        style={{
                            background: isDragging ? undefined : 'rgba(255, 255, 255, 0.01)',
                        }}
                    >
                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                            <input
                                type="file"
                                className="hidden"
                                multiple
                                onChange={handleFileChange}
                                disabled={isLoading}
                            />
                            <div className="flex flex-col items-center">
                                <UploadSvg className="w-8 h-8 text-text-mid mb-2" />
                                <span className="text-sm font-medium text-text-mid">
                                    Drag or drop file
                                </span>
                                <span className="text-xs text-text-low-disabled mt-1">
                                    Images or PDFs support (Max 5 files, 5MB each)
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {files.map((file, index) => (
                                <div key={`${file.name}-${index}`} className="flex items-center justify-between bg-neutral-03 border border-neutral-05 rounded-lg px-4 py-2">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                        <span className="text-sm text-text-high truncate">{file.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="text-text-low-disabled hover:text-red-500 transition-colors p-1 cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {files.length === 0 && !fileError && (
                        <p className="text-xs text-text-low-disabled font-normal">
                            No file chosen
                        </p>
                    )}

                    {fileError && (
                        <p className="text-xs text-red-500">{fileError}</p>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end items-center gap-4 w-full mt-8">
                <Button
                    className="h-10 w-[222px] rounded-full bg-transparent! bg-none! border-none! hover:bg-none hover:border-none text-text-mid"
                    onClick={() => router.back()}
                    disabled={isLoading}
                >
                    Discard
                </Button>

                <Button
                    className="h-10 w-[222px] px-6 rounded-full flex items-center justify-center gap-2"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'Submitting...' : 'Submit'}
                    {!isLoading && <ArrowSvg className="w-4 h-4" />}
                </Button>
            </div>
        </div>
    );
}
