'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Plus, Edit, CheckCircle, Loader2 } from 'lucide-react'
import { getBlogs, getProgressAndPartners } from './actions'

export default function LearnPage() {
    // 1. Fetch Blogs
    const { data: blogs = [], isLoading: isLoadingBlogs } = useQuery({
        queryKey: ['blogs-list-full'],
        queryFn: getBlogs
    })

    // 2. Prepare IDs for progress fetch
    // Ensure we handle both documentId (Strapi v5) and attributes.documentId (legacy/fallback)
    const blogDocumentIds = blogs.map(
        (b: any) => b.documentId || b.attributes?.documentId
    ).filter(Boolean)

    // 3. Fetch Progress (dependent on blogs)
    const { data: progressData } = useQuery({
        queryKey: ['blogs-progress', blogDocumentIds],
        queryFn: () => getProgressAndPartners(blogDocumentIds),
        enabled: blogDocumentIds.length > 0
    })

    const { progress = [], partners = [] } = progressData || {}

    // Helper to get partners who completed a specific blog
    const getCompletedPartners = (docId: string) => {
        const blogProgress = progress.filter(
            (p: any) => p.blog_document_id === docId
        )
        return blogProgress
            .map((p: any) => partners.find((partner: any) => partner.id === p.wl_partner_id))
            .filter(Boolean)
    }

    if (isLoadingBlogs) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-text-high">Learn</h1>
                <Link
                    href="/learn/create"
                    className="flex items-center gap-2 bg-neutral-90 text-background px-4 py-2 rounded-lg hover:bg-neutral-100 transition-colors font-medium"
                >
                    <Plus size={20} />
                    Create Blog
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog: any) => {
                    // Handle both Strapi v4 (attributes) and flattened formats just in case
                    const data = blog.attributes || blog
                    const { title, slug, documentId, type, category } = data
                    const completedBy = getCompletedPartners(documentId)
                    const categoryName = category?.name || category?.attributes?.Name || 'Uncategorized'

                    return (
                        <div
                            key={documentId}
                            className="bg-card border border-neutral-10 rounded-xl p-5 hover:border-neutral-20 transition-colors group flex flex-col justify-between h-auto min-h-[12rem]"
                        >
                            <Link href={`/learn/${documentId}`} className="flex-1 space-y-3">
                                <div className="flex items-center gap-2 text-xs font-medium">
                                    <span className={`px-2 py-1 rounded-md ${type === 'video'
                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                        }`}>
                                        {type === 'video' ? 'Video' : 'Article'}
                                    </span>
                                    {categoryName && (
                                        <span className="text-text-mid px-2 py-1 bg-neutral-05 rounded-md border border-neutral-10">
                                            {categoryName}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-text-high mb-1 line-clamp-2 hover:text-primary transition-colors">
                                        {title}
                                    </h2>
                                    <p className="text-sm text-text-mid font-mono">
                                        /{slug}
                                    </p>
                                </div>

                                {completedBy.length > 0 && (
                                    <div className="pt-2">
                                        <p className="text-xs text-text-mid uppercase font-semibold mb-2 flex items-center gap-1">
                                            <CheckCircle size={12} />
                                            Completed by
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {completedBy.map((partner: any) => (
                                                <span
                                                    key={partner.id}
                                                    className="text-xs bg-neutral-10 text-text-high px-2 py-1 rounded-full"
                                                >
                                                    {partner.first_name + " " + partner.last_name || partner.business_name || ""}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Link>

                            <div className="flex justify-end pt-4 border-t border-neutral-05 mt-auto">
                                <Link
                                    href={`/learn/edit/${documentId}`}
                                    className="flex items-center gap-2 text-text-mid hover:text-text-high transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-neutral-10"
                                >
                                    <Edit size={16} />
                                    Edit
                                </Link>
                            </div>
                        </div>
                    )
                })}

                {blogs.length === 0 && (
                    <div className="col-span-full py-12 text-center text-text-mid bg-neutral-05 rounded-xl border border-dashed border-neutral-10">
                        <p>No blogs found. Create your first one!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
