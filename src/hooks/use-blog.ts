import { useQuery } from "@tanstack/react-query";
import { getBlogByDocumentId } from "@/app/learn/actions";

export function useBlog(documentId: string) {
    return useQuery({
        queryKey: ["blog", documentId],
        queryFn: () => getBlogByDocumentId(documentId),
        enabled: !!documentId,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    });
}
