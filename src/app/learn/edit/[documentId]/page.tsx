'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBlog } from '@/hooks/use-blog'
import { useUpdateBlog } from '@/hooks/use-update-blog'
import BlogEditor from '@/app/learn/create/_components/BlogEditor'
import { Loader2, X } from 'lucide-react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { getBlogs, getCategories } from '@/app/learn/actions'
import BackButton from '@/components/core/back-button'
import Button from '@/components/core/button'
import TabSelector from '@/components/core/tab-selector'
import InputField from '@/components/core/input-field'
import { SelectInput } from '@/components/core/select-input'
import ChipFilled from '@/components/core/chip-filled'
import ChipBordered from '@/components/core/chip-bordered'
import { cn } from '@/lib/utils'
import SuccessCheckSvg from '@/components/svg/success-check'

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
}

const glassmorphismStyle = {
    borderRadius: '12px',
    background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
    boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
    backdropFilter: 'blur(10px)',
}

export default function EditBlogPage({
    params,
}: {
    params: Promise<{ documentId: string }>
}) {
    const { documentId } = use(params)
    const router = useRouter()

    // Form State
    const [title, setTitle] = useState('')
    const [type, setType] = useState<'article' | 'video'>('article')
    const [videoUrl, setVideoUrl] = useState('')
    const [videoDescription, setVideoDescription] = useState('')
    const [content, setContent] = useState('')
    const [categoryId, setCategoryId] = useState<string>('')
    const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([])
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')
    const [market, setMarket] = useState<'GLOBAL' | 'USA' | ''>('')
    const [isPublished, setIsPublished] = useState(false)

    // Data Fetching
    const { data: blog, isLoading: isLoadingBlog, error } = useBlog(documentId)
    const updateMutation = useUpdateBlog()

    const { data: categories = [] } = useQuery({
        queryKey: ['blog-categories'],
        queryFn: getCategories
    })

    const { data: blogsData } = useQuery({
        queryKey: ['blogs-list'],
        queryFn: () => getBlogs()
    })
    const allBlogs = blogsData?.data || []

    // Initialize form with blog data
    useEffect(() => {
        if (blog) {
            setTitle(blog.title || '')
            setType(blog.type || 'article')
            setVideoUrl(blog.video_url || '')
            setVideoDescription(blog.video_description || '')
            setContent(blog.content || '')
            setCategoryId(blog.category?.documentId || '')
            setSelectedRecommendations(blog.recommended_blogs?.map((b: any) => b.documentId) || [])
            setDescription(blog.description || '')
            setTags(blog.tags || [])
            setMarket(blog.market || '')
            setIsPublished(!!blog.publishedAt)
        }
    }, [blog])

    const slug = slugify(title)

    const handleSave = (published: boolean | undefined = undefined) => {
        if (!title.trim()) return alert('Title is required')
        if (!market) return alert('Market is required')
        if (!categoryId) return alert('Category is required')

        const finalPublishedState = published !== undefined ? published : isPublished

        updateMutation.mutate({
            documentId,
            title,
            slug,
            type,
            market: market as 'GLOBAL' | 'USA',
            category: categoryId,
            recommended_blogs: selectedRecommendations,
            description,
            tags,
            publishedAt: finalPublishedState ? new Date().toISOString() : null,
            ...(type === 'article' ? { content } : {}),
            ...(type === 'video' ? {
                video_url: videoUrl,
                video_description: videoDescription
            } : {})
        })
    }

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault()
            const newTag = tagInput.trim()
            if (!tags.includes(newTag)) {
                setTags([...tags, newTag])
            }
            setTagInput('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    const handlePreview = () => {
        const previewPayload = {
            title,
            type,
            video_url: videoUrl,
            video_description: videoDescription,
            content: content,
            description,
            tags,
            market,
        }
        sessionStorage.setItem('blog-preview-data', JSON.stringify(previewPayload))
        window.open('/learn/preview', '_blank')
    }

    if (isLoadingBlog) {
        return (
            <div className="flex items-center justify-center p-24">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        )
    }

    if (error || !blog) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="p-4 rounded-lg bg-negative/10 border border-negative/30">
                    <h2 className="text-lg font-semibold text-negative mb-2">Error Loading Blog</h2>
                    <p className="text-sm text-text-mid">
                        {error instanceof Error ? error.message : 'Blog not found'}
                    </p>
                    <Link
                        href="/learn"
                        className="inline-flex items-center mt-4 text-sm text-primary-500 hover:underline"
                    >
                        <BackButton />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-8 mb-20">
            {/* Header Section */}
            <div className=''>
                <BackButton onClick={() => router.back()} />
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-[32px] font-medium leading-[40px] text-(--Primary-White,#FFF)">
                        Edit learning
                    </h1>

                    <div className="flex items-center gap-4">
                        <Button
                            className="border-none! bg-transparent! bg-none! hover:bg-none! hover:bg-transparent! hover:border-none! text-(--Primary-White,#FFF)"
                            onClick={handlePreview}
                        >
                            Preview
                        </Button>
                        <Button
                            className="border-none! bg-transparent! bg-none! hover:bg-none! hover:bg-transparent! hover:border-none! text-(--Primary-White,#FFF)"
                            onClick={() => handleSave(false)}
                            disabled={updateMutation.isPending}
                        >
                            Save to Draft
                        </Button>
                        <Button
                            className=""
                            onClick={() => handleSave(true)}
                            disabled={updateMutation.isPending}
                        >
                            {isPublished ? 'Update' : 'Publish'}
                            <SuccessCheckSvg className="size-4 ml-2" />
                        </Button>
                    </div>
                </div>

                <TabSelector
                    tabs={[
                        { id: 'article', label: 'Article' },
                        { id: 'video', label: 'Video' }
                    ]}
                    activeTab={type}
                    onTabChange={(id) => setType(id as any)}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                {/* Main Content Area */}
                <div
                    className="p-6 sm:p-8 flex flex-col gap-8"
                    style={glassmorphismStyle}
                >
                    <h2 className="text-[20px] font-medium leading-[24px] text-(--Primary-White,#FFF)">
                        Learning Content
                    </h2>

                    <div className="flex flex-col gap-6">
                        <SelectInput
                            label="Market"
                            placeholder="Select market type"
                            value={market}
                            onChange={(val) => setMarket(val as any)}
                            options={[
                                { value: 'GLOBAL', label: 'GLOBAL' },
                                { value: 'USA', label: 'USA' }
                            ]}
                        />

                        <SelectInput
                            label="Category"
                            placeholder="Select learning category"
                            value={categoryId}
                            onChange={(val) => setCategoryId(val)}
                            options={(categories as any[]).map((cat: any) => ({
                                value: cat.documentId,
                                label: cat.name
                            }))}
                        />

                        <InputField
                            id="title"
                            name="title"
                            label="Title"
                            placeholder="Write Title"
                            type="text"
                            inputClassName='h-[58px] justify-center'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <div className="flex flex-col gap-2">
                            <InputField
                                id="tags"
                                name="tags"
                                label="Tags"
                                placeholder="Add tags"
                                type="text"
                                inputClassName='h-[58px] justify-center'
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                            />
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {tags.map(tag => (
                                        <div key={tag} className="flex items-center gap-1 bg-white/5 text-gray-300 px-2.5 py-1 rounded-full text-xs border border-white/10">
                                            <span>{tag}</span>
                                            <button onClick={() => removeTag(tag)} className="hover:text-red-500 ml-1">
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[14px] font-normal leading-[24px] text-(--Primary-600,#888)">
                                {type === 'article' ? 'Add Content' : 'Video URL'}
                            </h3>

                            {type === 'article' ? (
                                <div className="min-h-[400px]">
                                    <BlogEditor value={content} onChange={setContent} />
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    <InputField
                                        id="videoUrl"
                                        name="videoUrl"
                                        placeholder="Attach Video link"
                                        type="text"
                                        inputClassName='h-[58px] justify-center'
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                    />

                                    <div className="flex flex-col gap-4">
                                        <h3 className="text-[14px] font-normal leading-[24px] text-(--Primary-600,#888)">
                                            Video overview
                                        </h3>
                                        <div className="min-h-[200px]">
                                            <BlogEditor value={videoDescription} onChange={setVideoDescription} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-6">
                    <div
                        className="p-6 flex flex-col gap-6 sticky top-8"
                        style={glassmorphismStyle}
                    >
                        <h2 className="text-[20px] font-medium leading-[24px] text-(--Primary-White,#FFF)">
                            Recommended Learning
                        </h2>

                        <div className="flex flex-col gap-4">
                            <SelectInput
                                label="Add Recommendation"
                                placeholder="Select publish materials"
                                value=""
                                onChange={(val) => {
                                    if (val && !selectedRecommendations.includes(val)) {
                                        setSelectedRecommendations([...selectedRecommendations, val])
                                    }
                                }}
                                options={allBlogs.map((blog: any) => ({
                                    value: blog.documentId,
                                    label: blog.title
                                }))}
                            />

                            <div className="flex flex-col gap-3 mt-2">
                                {selectedRecommendations.map(id => {
                                    const blog = allBlogs.find((b: any) => b.documentId === id)
                                    if (!blog) return null

                                    return (
                                        <div
                                            key={id}
                                            className="flex flex-col gap-3 p-4 relative group"
                                            style={{
                                                minHeight: '86px',
                                                borderRadius: '8px',
                                                background: 'var(--Neutral-Neutrals-03, rgba(255, 255, 255, 0.03))'
                                            }}
                                        >
                                            <button
                                                onClick={() => setSelectedRecommendations(selectedRecommendations.filter(r => r !== id))}
                                                className="absolute top-2 right-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="size-3" />
                                            </button>

                                            <h4 className="text-[18px] font-normal leading-[22px] text-white truncate">
                                                {blog.title}
                                            </h4>

                                            <div className="flex items-center gap-2">
                                                <ChipFilled className="px-2 py-0.5 text-[12px]">
                                                    {blog.category?.name || 'Uncategorized'}
                                                </ChipFilled>
                                                <ChipBordered className="px-2 py-0.5 text-[12px] text-system-positive">
                                                    Published
                                                </ChipBordered>
                                            </div>
                                        </div>
                                    )
                                })}
                                {selectedRecommendations.length === 0 && (
                                    <p className="text-sm text-gray-500 italic">No recommendations selected</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
