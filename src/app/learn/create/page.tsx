'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, X } from 'lucide-react'

import { createBlog, createCategory, getBlogs, getCategories } from '../actions'
import BlogEditor from './_components/BlogEditor'

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
}

export default function CreateBlogPage() {
    const queryClient = useQueryClient()

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
    const [newCategoryName, setNewCategoryName] = useState('')
    const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([])

    // New Fields
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')

    const slug = slugify(title)

    // Data Fetching
    const { data: categories = [] } = useQuery({
        queryKey: ['blog-categories'],
        queryFn: getCategories
    })

    const { data: allBlogs = [] } = useQuery({
        queryKey: ['blogs-list'],
        queryFn: getBlogs
    })

    // Mutations
    const createMutation = useMutation({
        mutationFn: createBlog,
        onSuccess: () => {
            alert('Blog created successfully!')
            // Reset form
            setTitle('')
            setVideoUrl('')
            setVideoDescription('')
            setContent('')
            setCategoryId('')
            setCategoryId('')
            setSelectedRecommendations([])
            setDescription('')
            setTags([])
            setTagInput('')
        },
        onError: (err) => {
            alert(`Error creating blog: ${err.message}`)
        }
    })

    const createCategoryMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: (newCat) => {
            queryClient.invalidateQueries({ queryKey: ['blog-categories'] })
            setCategoryId(newCat.documentId) // Auto-select new category
            setNewCategoryName('')
        },
        onError: (err) => {
            alert(`Error creating category: ${err.message}`)
        }
    })

    const handleSubmit = async () => {
        if (!title) return alert('Title is required')
        if (!categoryId) return alert('Category is required')

        if (type === 'video' && !videoUrl) return alert('Video URL is required')

        createMutation.mutate({
            title,
            slug,
            type,
            category: categoryId,
            recommended_blogs: selectedRecommendations,
            description,
            tags,
            // Only send content if Article
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

    return (
        <div className="space-y-6 p-6 mb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create New {type === 'video' ? 'Video' : 'Article'}</h1>
                <button
                    onClick={handleSubmit}
                    disabled={createMutation.isPending}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                    {createMutation.isPending ? 'Publishing...' : 'Publish'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area (Left 2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input
                            className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-3 text-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                            placeholder="Enter blog title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description / Summary</label>
                        <textarea
                            className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none h-24"
                            placeholder="Brief summary of the content..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Slug Preview */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</label>
                        <input
                            className="w-full bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-gray-500 font-mono cursor-not-allowed outline-none"
                            value={slug}
                            readOnly
                        />
                    </div>

                    {/* Content Editor based on Type */}
                    {type === 'article' ? (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                            <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                                <BlogEditor value={content} onChange={setContent} />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Video URL</label>
                                <input
                                    className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                />
                                <p className="text-xs text-gray-500">Supports YouTube and Loom links.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Video Description</label>
                                <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                                    <BlogEditor value={videoDescription} onChange={setVideoDescription} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Settings (Right 1/3) */}
                <div className="space-y-6 h-fit sticky top-6">
                    {/* Blog Type Selector */}
                    <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Content Type</label>
                        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-zinc-800 rounded-lg">
                            <button
                                onClick={() => setType('article')}
                                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${type === 'article'
                                    ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                Article
                            </button>
                            <button
                                onClick={() => setType('video')}
                                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${type === 'video'
                                    ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                Video
                            </button>
                        </div>
                    </div>

                    {/* Category Selector */}
                    <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Category</label>
                        <div className="space-y-3">
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="" disabled>Select a category</option>
                                {categories.map((cat: any) => (
                                    <option key={cat.documentId} value={cat.documentId}>{cat.name}</option>
                                ))}
                            </select>

                            {/* Create New Category */}
                            <div className="pt-2 border-t border-gray-100 dark:border-zinc-800">
                                <p className="text-xs text-gray-500 mb-2">Or create new:</p>
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                                        placeholder="New category name"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                    />
                                    <button
                                        onClick={() => createCategoryMutation.mutate(newCategoryName)}
                                        disabled={!newCategoryName.trim() || createCategoryMutation.isPending}
                                        className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommended Blogs Selector */}
                    <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recommended Blogs</label>
                        <div className="space-y-3">
                            <select
                                onChange={(e) => {
                                    if (e.target.value && !selectedRecommendations.includes(e.target.value)) {
                                        setSelectedRecommendations([...selectedRecommendations, e.target.value])
                                    }
                                }}
                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                value=""
                            >
                                <option value="" disabled>Add a recommendation...</option>
                                {allBlogs.map((blog: any) => (
                                    <option key={blog.documentId} value={blog.documentId} disabled={selectedRecommendations.includes(blog.documentId)}>
                                        {blog.title}
                                    </option>
                                ))}
                            </select>

                            {/* Selected Tags */}
                            <div className="flex flex-wrap gap-2">
                                {selectedRecommendations.map(id => {
                                    const blog = allBlogs.find((b: any) => b.documentId === id)
                                    return (
                                        <div key={id} className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs border border-blue-100 dark:border-blue-800">
                                            <span className="max-w-[150px] truncate">{blog?.title || id}</span>
                                            <button
                                                onClick={() => setSelectedRecommendations(selectedRecommendations.filter(r => r !== id))}
                                                className="hover:text-red-500"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )
                                })}
                                {selectedRecommendations.length === 0 && (
                                    <span className="text-xs text-gray-400 italic">No recommendations selected</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tags</label>
                        <div className="space-y-3">
                            <input
                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Type tag & press enter..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                            />

                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <div key={tag} className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full text-xs">
                                        <span>{tag}</span>
                                        <button
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-red-500 ml-1"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                {tags.length === 0 && (
                                    <span className="text-xs text-gray-400 italic">No tags added</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
