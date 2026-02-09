'use client'

import { use, useMemo, useState, useEffect } from 'react'
import { useBlog } from '@/hooks/use-blog'
import BackButton from '@/components/core/back-button'
import Button from '@/components/core/button'
import ChipBordered from '@/components/core/chip-bordered'
import CopyLinkMiniSvg from '@/components/svg/copy-link-mini'
import EditMiniSvg from '@/components/svg/edit-mini'
import ChevronDown from '@/components/svg/chevron-down'
import { ReadCountPopover } from '../_components/read-count-popover'
import { getProgressAndPartners } from '../actions'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import EditPencilSvg from '@/components/svg/edit-pencil'

export default function LearnDocumentPage({
    params,
}: {
    params: Promise<{ documentId: string }>
}) {
    const router = useRouter()
    const { documentId } = use(params)
    const isPreview = documentId === 'preview'

    // Preview state
    const [previewData, setPreviewData] = useState<any>(null)

    useEffect(() => {
        if (isPreview) {
            const savedData = sessionStorage.getItem('blog-preview-data')
            if (savedData) {
                try {
                    setPreviewData(JSON.parse(savedData))
                } catch (e) {
                    console.error('Failed to parse preview data', e)
                }
            }
        }
    }, [isPreview])

    // Real data fetch
    const { data: realBlog, isLoading: isBlogLoading, error } = useBlog(isPreview ? '' : documentId)

    const blog = isPreview ? previewData : realBlog

    // Fetch progress data
    const { data: progressInfo } = useQuery({
        queryKey: ['blog-progress', documentId],
        queryFn: () => getProgressAndPartners([documentId]),
        enabled: !isPreview && !!documentId
    })

    const partnerProgress = useMemo(() => {
        if (!progressInfo) return []
        return progressInfo.partners.map((partner: any) => {
            const progress = progressInfo.progress.find((p: any) => p.wl_partner_id === partner.id)
            return {
                id: partner.id,
                business_name: partner.business_name,
                progress: progress?.progress || 0,
                status: progress?.completed ? 'Completed' : 'In Progress',
                manager: `${partner.first_name || ''} ${partner.last_name || ''}`.trim() || 'Unassigned',
                market: 'Global & USA', // This might need mapping from elsewhere
                started_at: progress?.last_read_at ? new Date(progress.last_read_at).toLocaleDateString() : 'Not started'
            }
        })
    }, [progressInfo])

    if (isBlogLoading && !isPreview) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-8">
                    <div className="h-10 bg-white/5 rounded w-full"></div>
                    <div className="h-64 bg-white/5 rounded-xl w-full"></div>
                    <div className="space-y-4">
                        <div className="h-8 bg-white/5 rounded w-3/4"></div>
                        <div className="h-4 bg-white/5 rounded w-full"></div>
                        <div className="h-4 bg-white/5 rounded w-full"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!blog && !isBlogLoading) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-text-mid">
                    {isPreview ? 'No preview data found. Please go back and click Preview again.' : 'Learning material not found.'}
                </div>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    const handleCopyLink = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
    }

    console.log('Rendering Blog Content:', {
        type: blog.type,
        content: blog.content,
        video_description: blog.video_description
    })

    return (
        <div className="flex flex-col gap-12 p-6 lg:p-6 min-h-screen bg-transparent items-center w-full">
            <div className="w-full flex flex-col gap-12">
                {/* Action Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <BackButton onClick={() => router.back()} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleCopyLink}
                            className="text-sm h-[30px] px-4!"
                        >
                            Copy Link
                            <CopyLinkMiniSvg className="size-3 text-white" />
                        </Button>

                        {!isPreview && (
                            <Link href={`/learn/edit/${blog.documentId || ''}`}>
                                <Button className="text-sm h-[30px] px-4!">
                                    Edit
                                    <EditPencilSvg className="size-4" />
                                </Button>
                            </Link>
                        )}

                        <ReadCountPopover progressData={partnerProgress as any} />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col gap-8 max-w-[60%]">
                    {/* Meta Chips */}
                    <div className="flex flex-wrap gap-2">
                        <ChipBordered>
                            <span className="text-[12px] text-(--System-Positive,#6DAB9C)">Active</span>
                        </ChipBordered>
                        {blog.category?.name && (
                            <ChipBordered>
                                <span className="text-[12px] text-text-high">{blog.category.name}</span>
                            </ChipBordered>
                        )}
                        {blog.tags?.map((tag: string) => (
                            <ChipBordered key={tag}>
                                <span className="text-[12px] text-text-high">{tag}</span>
                            </ChipBordered>
                        ))}
                    </div>

                    {/* Title */}
                    <h1 className="text-[42px] font-medium leading-[46px] text-white">
                        {blog.title}
                    </h1>

                    {/* Main Content */}
                    <div className="flex flex-col gap-12">
                        {/* Description/Body */}
                        {blog.type === 'article' ? (
                            <div
                                className="prose prose-invert max-w-none text-lg text-text-high leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                        ) : (
                            <div className="space-y-12">
                                {blog.video_url && <VideoPlayer url={blog.video_url} />}
                                <div className="p-6 flex flex-col gap-4 bg-neutral-01 section-border">
                                    <h2 className="text-left text-[20px] font-medium leading-[24px] text-(--Primary-White,#FFF)">
                                        Overview
                                    </h2>
                                    <div
                                        className="prose prose-invert max-w-none text-[16px] font-normal leading-[20px] text-(--Text-High,#DCDCDC) text-left"
                                        dangerouslySetInnerHTML={{ __html: blog.video_description }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function VideoPlayer({ url }: { url: string }) {
    const embedUrl = useMemo(() => {
        if (!url) return null
        // YouTube
        if (url.includes('youtube.com/watch')) {
            const videoId = new URL(url).searchParams.get('v')
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null
        }
        if (url.includes('youtu.be')) {
            const videoId = url.split('/').pop()
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null
        }
        // Loom
        if (url.includes('loom.com/share')) {
            const videoId = url.split('/').pop()?.split('?')[0]
            return videoId ? `https://www.loom.com/embed/${videoId}` : null
        }
        // Google Drive
        if (url.includes('drive.google.com/file/d/')) {
            return url.replace(/\/view.*$/, '/preview').replace(/\/edit.*$/, '/preview')
        }
        return url
    }, [url])

    if (!embedUrl) return null

    return (
        <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl border border-white/5">
            <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    )
}
