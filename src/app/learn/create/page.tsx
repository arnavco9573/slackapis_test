'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, X, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner' // Import toast

import { createBlog, getBlogs, getCategories } from '../actions'
import BlogEditor from './_components/BlogEditor'
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

export default function CreateBlogPage() {
    const queryClient = useQueryClient()
    const router = useRouter()

    // Form State
    const [title, setTitle] = useState('')
    const [type, setType] = useState<'article' | 'video'>('article')

    // Video specific
    const [videoUrl, setVideoUrl] = useState('')
    const [videoDescription, setVideoDescription] = useState('')

    // Article specific
    const [content, setContent] = useState('')

    // Metadata
    const [categoryId, setCategoryId] = useState<string>('')
    const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([])

    // New Fields
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')
    const [market, setMarket] = useState<'GLOBAL' | 'USA' | ''>('')

    const slug = slugify(title)

    // Data Fetching
    const { data: categories = [] } = useQuery({
        queryKey: ['blog-categories'],
        queryFn: getCategories
    })

    const { data: blogsData } = useQuery({
        queryKey: ['blogs-list'],
        queryFn: () => getBlogs()
    })
    const allBlogs = blogsData?.data || []

    // Mutations
    const createMutation = useMutation({
        mutationFn: createBlog,
        onSuccess: (_, variables) => {
            const isDraft = !variables.publishedAt
            toast.success(isDraft ? 'Blog saved as draft successfully!' : 'Blog published successfully!')
            router.push('/learn')
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        },
        onError: (err) => {
            toast.error(`Error creating blog: ${err.message}`)
        }
    })

    const handleSubmit = async (published: boolean = false) => {
        if (!title) return toast.error('Title is required')
        if (!market) return toast.error('Market is required')
        if (!categoryId) return toast.error('Category is required')

        if (type === 'video' && !videoUrl) return toast.error('Video URL is required')

        const payload: any = {
            title,
            slug,
            type,
            market: market as 'GLOBAL' | 'USA',
            category: categoryId,
            recommended_blogs: selectedRecommendations,
            description,
            tags,
            ...(type === 'article' ? { content } : {}),
            ...(type === 'video' ? {
                video_url: videoUrl,
                video_description: videoDescription
            } : {})
        }

        if (published) {
            payload.publishedAt = new Date().toISOString()
            payload.blog_status = 'published'
        } else {
            payload.publishedAt = null
            payload.blog_status = 'draft'
        }

        createMutation.mutate(payload)
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

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-8 mb-20">
            {/* Header Section */}
            <div className=''>
                <BackButton onClick={() => router.back()} />
            </div>
            <div className="flex flex-col gap-6">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-[32px] font-medium leading-[40px] text-(--Primary-White,#FFF)">
                        New learning
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
                            onClick={() => handleSubmit(false)}
                            disabled={createMutation.isPending}
                        >
                            Save to Draft
                        </Button>
                        <Button
                            className=""
                            onClick={() => handleSubmit(true)}
                            disabled={createMutation.isPending}
                        >
                            Publish
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
                            options={categories.map((cat: any) => ({
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
                                                <ChipBordered className="px-2 py-0.5 text-[12px] text-(--system-positive)">
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
