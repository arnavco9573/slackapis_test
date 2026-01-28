'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBlog } from '@/hooks/use-blog'
import { useUpdateBlog } from '@/hooks/use-update-blog'
import BlogEditor from '@/app/learn/create/_components/BlogEditor'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditBlogPage({
    params,
}: {
    params: Promise<{ documentId: string }>
}) {
    const { documentId } = use(params)
    const router = useRouter()

    // Fetch existing blog data
    const { data: blog, isLoading: isLoadingBlog, error } = useBlog(documentId)

    // Update mutation
    const updateMutation = useUpdateBlog()

    // Form state
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [content, setContent] = useState('')

    // Initialize form with blog data
    useEffect(() => {
        if (blog) {
            setTitle(blog.title || '')
            setSlug(blog.slug || '')
            setContent(blog.content || '')
        }
    }, [blog])

    const handleSave = () => {
        if (!title.trim() || !slug.trim()) {
            return
        }

        updateMutation.mutate({
            documentId,
            title,
            slug,
            content
        })
    }

    if (isLoadingBlog) {
        return (
            <div className="flex items-center justify-center p-24">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="p-4 rounded-lg bg-negative/10 border border-negative/30">
                    <h2 className="text-lg font-semibold text-negative mb-2">Error Loading Blog</h2>
                    <p className="text-sm text-text-mid">
                        {error instanceof Error ? error.message : 'Failed to load blog'}
                    </p>
                    <Link
                        href={`/learn/${documentId}`}
                        className="inline-flex items-center mt-4 text-sm text-primary-500 hover:underline"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to View
                    </Link>
                </div>
            </div>
        )
    }

    if (!blog) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="p-4 rounded-lg bg-neutral-05 border border-neutral-10">
                    <p className="text-text-mid">Blog not found</p>
                    <Link
                        href="/learn"
                        className="inline-flex items-center mt-4 text-sm text-primary-500 hover:underline"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Learn
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6 mb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/learn/${documentId}`}
                        className="p-2 -ml-2 rounded-lg hover:bg-neutral-05 transition-colors text-text-mid hover:text-text-high"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-text-highest">Edit Blog</h1>
                </div>

                <button
                    onClick={handleSave}
                    disabled={updateMutation.isPending || !title.trim() || !slug.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--Primary-500)] text-white rounded-lg hover:bg-[var(--Primary-600)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {updateMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Save Changes
                </button>
            </div>

            <div className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-mid">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Blog Title"
                        className="w-full px-4 py-2 bg-neutral-05 border border-neutral-10 rounded-lg text-text-high placeholder:text-text-mid focus:outline-none focus:border-[var(--Primary-500)] transition-colors"
                    />
                </div>

                {/* Slug Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-mid">Slug</label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="blog-slug"
                        className="w-full px-4 py-2 bg-neutral-05 border border-neutral-10 rounded-lg text-text-high placeholder:text-text-mid focus:outline-none focus:border-[var(--Primary-500)] transition-colors font-mono text-sm"
                    />
                </div>

                {/* Editor */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-mid">Content</label>
                    <div className="bg-neutral-05 rounded-lg border border-neutral-10 focus-within:border-[var(--Primary-500)] transition-colors overflow-hidden">
                        <BlogEditor
                            value={content}
                            onChange={setContent}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
