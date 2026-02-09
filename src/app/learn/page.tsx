'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Copy, MoreVertical, Search, Loader2 } from 'lucide-react'
import { getBlogs, getCategories, toggleBlogVisibility, deleteBlog, getProgressAndPartners } from './actions'
import TabSelector from '@/components/core/tab-selector'
import Button from '@/components/core/button'
import GradientSeparator from '@/components/core/gradient-separator'
import InputField from '@/components/core/input-field'
import { CategoryDropdown } from './_components/category-dropdown'
import { FilterDropdown } from './_components/filter-dropdown'
import { SortDropdown } from './_components/sort-dropdown'
import { DataTable } from '@/components/core/data-table'
import { Pagination } from '@/components/core/pagination'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { TooltipWrapper } from '@/components/core/info-tooltip'
import ChipBordered from '@/components/core/chip-bordered'
import SearchSvg from '@/components/svg/search'
import { CategoryManagement } from './_components/category-management'

export default function LearnPage() {
    const queryClient = useQueryClient()
    const router = useRouter()

    // --- Helpers ---
    const truncateTextByWords = (text: string, maxWords: number) => {
        const words = text.split(/\s+/)
        if (words.length <= maxWords) return { truncated: false, text }
        return {
            truncated: true,
            text: words.slice(0, maxWords).join(' ') + '...'
        }
    }

    // --- State Management ---
    const [activeMainTab, setActiveMainTab] = useState<'learning' | 'categories'>('learning')
    const [blogStatus, setBlogStatus] = useState<'published' | 'draft'>('published')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [contentType, setContentType] = useState('ALL')
    const [marketType, setMarketType] = useState('ALL')
    const [sortOrder, setSortOrder] = useState('newest')
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    // --- Data Fetching ---
    const { data: categories = [] } = useQuery({
        queryKey: ['categories-list'],
        queryFn: getCategories
    })

    const { data: blogsData, isLoading: isLoadingBlogs } = useQuery({
        queryKey: ['blogs-list', {
            page: currentPage,
            pageSize,
            categorySlug: selectedCategory,
            marketType,
            contentType,
            sortOrder,
            search: searchQuery,
            status: blogStatus
        }],
        queryFn: () => getBlogs({
            page: currentPage,
            pageSize,
            categorySlug: selectedCategory,
            marketType,
            contentType,
            sortOrder,
            search: searchQuery,
            status: blogStatus
        })
    })

    const { data: blogs = [], meta = { total: 0, pageCount: 1 } } = blogsData || {}

    // --- Progress Data Fetching ---
    const blogDocumentIds = React.useMemo(() => blogs.map((b: any) => b.documentId), [blogs])

    const { data: progressInfo } = useQuery({
        queryKey: ['blogs-progress', blogDocumentIds],
        queryFn: () => getProgressAndPartners(blogDocumentIds),
        enabled: blogDocumentIds.length > 0
    })

    const readCounts = React.useMemo(() => {
        if (!progressInfo || !progressInfo.progress) return {}
        const counts: Record<string, number> = {}
        progressInfo.progress.forEach((p: any) => {
            if (!counts[p.blog_document_id]) {
                counts[p.blog_document_id] = 0
            }
            counts[p.blog_document_id]++
        })
        return counts
    }, [progressInfo])

    // --- Mutations ---
    const toggleVisibilityMutation = useMutation({
        mutationFn: ({ id, isLive }: { id: string, isLive: boolean }) => toggleBlogVisibility(id, isLive),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs-list'] })
        }
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteBlog(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs-list'] })
        }
    })

    // --- Table Columns ---
    const columns = [
        {
            header: 'Learning Title',
            flex: 3,
            cell: (blog: any) => {
                const title = blog.title || ''
                const words = title.split(/\s+/)
                // Truncate if > 25 words OR > 50 characters to ensure safe single-line display
                const isTruncated = words.length > 25 || title.length > 50
                const displayText = isTruncated
                    ? title.substring(0, 50).trim() + '...'
                    : title

                return (
                    <div className="flex flex-col min-w-0">
                        {isTruncated ? (
                            <TooltipWrapper content={title}>
                                <span className="text-text-highest truncate block" title={title}>
                                    {displayText}
                                </span>
                            </TooltipWrapper>
                        ) : (
                            <span className="text-text-highest truncate block" title={title}>
                                {title}
                            </span>
                        )}
                    </div>
                )
            }
        },
        {
            header: 'Category',
            flex: 1.5,
            cell: (blog: any) => blog.category?.name || 'Uncategorized'
        },
        {
            header: 'Type',
            flex: 1,
            cell: (blog: any) => (
                <ChipBordered className='w-fit'>
                    <span className="text-text-highest text-sm">{blog.type}</span>
                </ChipBordered>
            )
        },
        {
            header: 'Date',
            flex: 1.2,
            cell: (blog: any) => new Date(blog.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        },
        {
            header: 'Market Type',
            flex: 1.2,
            cell: (blog: any) => blog.market || '-'
        },
        {
            header: 'Read Count',
            flex: 1,
            cell: (blog: any) => readCounts[blog.documentId] || '0'
        },
        {
            header: 'Actions',
            flex: 1,
            className: "text-right",
            cell: (blog: any) => {
                const isLive = !!blog.publishedAt
                return (
                    <div className="flex items-center justify-end gap-3">
                        {/* Custom Switch Toggle */}
                        {/* <div
                            className={cn(
                                "w-10 h-6 p-1 cursor-pointer transition-all relative",
                            )}
                            style={{
                                borderRadius: '90px',
                                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.01) 0%, rgba(255, 255, 255, 0.40) 100%)',
                            }}
                            onClick={(e) => {
                                e.stopPropagation()
                                toggleVisibilityMutation.mutate({ id: blog.documentId, isLive: !isLive })
                            }}
                        >
                            <div className={cn(
                                "w-4 h-4 rounded-full transition-transform shadow-sm",
                                isLive ? "translate-x-4 bg-white" : "translate-x-0 bg-white/90"
                            )}
                                style={{
                                    fill: 'var(--Primary-White, #FFF)',
                                    background: 'var(--Primary-White, #FFF)'
                                }} />
                        </div> */}

                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1 hover:bg-neutral-10 rounded transition-colors text-text-mid hover:text-text-high"
                                >
                                    <MoreVertical size={18} />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-36 p-2 space-y-1 border-0"
                                align="end"
                                style={{
                                    borderRadius: '12px',
                                    background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
                                    boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                                    backdropFilter: 'blur(10px)'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Link
                                    href={`/learn/edit/${blog.documentId}`}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-high hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <Edit size={14} />
                                    Edit
                                </Link>
                                {/* <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        const url = `${window.location.origin}/learn/${blog.documentId}`
                                        navigator.clipboard.writeText(url)
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-high hover:bg-white/5 rounded-lg transition-colors text-left"
                                >
                                    <Copy size={14} />
                                    Copy Link
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (confirm('Are you sure you want to delete this learning?')) {
                                            deleteMutation.mutate(blog.documentId)
                                        }
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors text-left"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button> */}
                            </PopoverContent>
                        </Popover>
                    </div>
                )
            }
        }
    ]

    return (
        <div className="p-6 space-y-8 h-auto">
            {/* Header Section */}
            <div className="space-y-6">
                <h1 className="text-[42px] font-medium leading-[46px] text-[#FFF]">
                    Learning
                </h1>

                <div className="flex items-center justify-between">
                    <TabSelector
                        tabs={[
                            { id: 'learning', label: 'Learning' },
                            { id: 'categories', label: 'Categories' }
                        ]}
                        activeTab={activeMainTab}
                        onTabChange={(id) => setActiveMainTab(id as any)}
                        className='gap-10 text-base'
                    />

                    {activeMainTab === 'learning' && (
                        <Link href="/learn/create">
                            <Button className="h-10">
                                Create New Learning
                                <Plus size={20} className="ml-1" />
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <GradientSeparator opacity={0.3} />

            {activeMainTab === 'learning' ? (
                <div className="space-y-6">
                    {/* Filters Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Button
                                className={cn(
                                    "px-6 h-10",
                                    blogStatus === 'published' ? "" : "bg-none! border-none! bg-transparent!"
                                )}
                                onClick={() => setBlogStatus('published')}
                            >
                                Published
                            </Button>
                            <Button
                                className={cn(
                                    "px-6 h-10",
                                    blogStatus === 'draft' ? "" : "bg-none! border-none! bg-transparent!"
                                )}
                                onClick={() => setBlogStatus('draft')}
                            >
                                Draft
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 flex-1 max-w-2xl justify-end">
                            <div className="w-full max-w-xs">
                                <InputField
                                    id="search"
                                    name="search"
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    wrapperClassName="!gap-0"
                                    startAdornment={<SearchSvg className="text-text-mid" />}
                                    inputClassName="h-[40px] justify-center pl-10 rounded-full!"
                                    placeholderClassName='mt-1'
                                />
                            </div>

                            <CategoryDropdown
                                categories={categories}
                                selectedCategoryName={selectedCategory === 'all' ? 'Category' : categories.find((c: any) => c.slug === selectedCategory)?.name || 'Category'}
                                selectedCategorySlug={selectedCategory}
                                onSelectCategory={setSelectedCategory}
                            />

                            <FilterDropdown
                                contentType={contentType}
                                onContentTypeChange={setContentType}
                                marketType={marketType}
                                onMarketTypeChange={setMarketType}
                            />

                            <SortDropdown
                                sortOrder={sortOrder}
                                onSortChange={setSortOrder}
                            />
                        </div>
                    </div>

                    <GradientSeparator opacity={0.3} />

                    {/* Table Section */}
                    <div className="space-y-6">
                        {isLoadingBlogs ? (
                            <div className="h-64 flex items-center justify-center bg-neutral-01 section-border rounded-xl">
                                <Loader2 className="animate-spin text-text-mid" size={32} />
                            </div>
                        ) : (
                            <>
                                <DataTable
                                    title="Learning"
                                    data={blogs}
                                    columns={columns}
                                    onRowClick={(blog) => router.push(`/learn/${blog.documentId}`)}
                                />

                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={meta.pageCount}
                                    onPageChange={setCurrentPage}
                                />
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <CategoryManagement categories={categories} />
            )}
        </div>
    )
}
