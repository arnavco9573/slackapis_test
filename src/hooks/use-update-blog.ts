import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBlog } from "@/app/learn/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useUpdateBlog() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: updateBlog,
        onSuccess: (data) => {
            toast.success("Blog updated successfully");

            // Invalidate the specific blog query
            if (data?.documentId) {
                queryClient.invalidateQueries({ queryKey: ["blog", data.documentId] });
            }

            // Redirect to the view page
            if (data?.documentId) {
                router.push(`/learn/${data.documentId}`);
            }
        },
        onError: (error) => {
            console.error("Error updating blog:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update blog");
        },
    });
}
