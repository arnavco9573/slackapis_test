'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBugReportsAction, submitBugReportAction, getMasterProfileAction, updateBugStatusAction } from './actions';
// import { BugReportPortal, BugReportStatus } from '@/lib/types';
import { createClientBrowser } from '@/lib/supabase/client';

export type BugReportPortal = 'master' | 'investor' | 'wl';
export type BugReportStatus = 'pending' | 'resolved';

// Hook to get current master session
export function useMasterSession() {
    return useQuery({
        queryKey: ['master-session'],
        queryFn: () => getMasterProfileAction(),
    });
}

export interface FetchReportsParams {
    portal: BugReportPortal;
    search?: string;
    status?: BugReportStatus;
    page?: number;
    pageSize?: number;
    enabled?: boolean;
}

// Unified hook for Bug Reports with 'enabled' support to prevent background fetching
export function useBugReports({ portal, search, status, page = 1, pageSize = 10, enabled = true }: FetchReportsParams) {
    return useQuery({
        queryKey: ['bug-reports', portal, { search, status, page, pageSize }],
        queryFn: () => getBugReportsAction({ portal, search, status, page, pageSize }),
        enabled: enabled,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

// Hook to submit bug report
export function useSubmitBugReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitBugReportAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bug-reports'] });
        }
    });
}

// Hook to upload files
export function useUploadBugReportFile() {
    const supabase = createClientBrowser();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const file = formData.get('file') as File;
            const userId = formData.get('userId') as string;

            if (!file || !userId) {
                throw new Error('Missing file or userId');
            }

            // ---- Validation ----
            const MAX_SIZE_MB = 5;
            const allowedTypes = [
                'image/jpeg',
                'image/png',
                'image/webp',
                'application/pdf'
            ];

            if (file.size === 0) {
                throw new Error('File is empty or corrupted');
            }

            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                throw new Error(`File must be smaller than ${MAX_SIZE_MB}MB`);
            }

            if (!allowedTypes.includes(file.type)) {
                throw new Error('Only JPEG, PNG, WEBP, and PDF files are supported');
            }

            // ---- Safe filename ----
            const sanitizedFileName = file.name
                .replace(/\s+/g, '_')                // spaces → _
                .replace(/[^a-zA-Z0-9._-]/g, '');   // remove unsafe chars

            const fileName = `Master/${userId}/${Date.now()}-${sanitizedFileName}`;

            // ---- Upload ----
            const { error } = await supabase.storage
                .from('BugReport')
                .upload(fileName, file, {
                    upsert: false
                });

            if (error) {
                console.error('Supabase upload error:', error);
                throw new Error(error.message || 'File upload failed');
            }

            // ---- Get public URL ----
            const { data } = supabase.storage
                .from('BugReport')
                .getPublicUrl(fileName);

            if (!data?.publicUrl) {
                throw new Error('Failed to generate file URL');
            }

            return data.publicUrl;
        }
    });
}


// Hook to update bug status (Resolve/Duplicate)
export function useUpdateBugStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateBugStatusAction,
        onSuccess: () => {
            // Invalidate all bug-reports queries as resolving one might affect others (duplicates) via backend logic
            queryClient.invalidateQueries({ queryKey: ['bug-reports'] });
        }
    });
}
