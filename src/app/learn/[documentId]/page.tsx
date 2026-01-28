'use client'

import { use, useMemo } from 'react'
import { useBlog } from '@/hooks/use-blog'

export default function LearnDocumentPage({
    params,
}: {
    params: Promise<{ documentId: string }>
}) {
    const { documentId } = use(params)
    const { data: blog, isLoading, error } = useBlog(documentId)

    console.log("Document ID", documentId)
    console.log("Blog data:", blog)

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-neutral-10 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-neutral-10 rounded w-1/2 mb-8"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-neutral-10 rounded"></div>
                        <div className="h-4 bg-neutral-10 rounded"></div>
                        <div className="h-4 bg-neutral-10 rounded w-5/6"></div>
                    </div>
                </div>
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
                </div>
            </div>
        )
    }

    if (!blog) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="p-4 rounded-lg bg-neutral-05 border border-neutral-10">
                    <p className="text-text-mid">Blog not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6 mb-20">
            <article className="space-y-12">
                {/* Title */}
                <h1 className="text-4xl font-bold text-text-highest">
                    {blog.title}
                </h1>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-text-mid">
                    {blog.slug && (
                        <span className="px-3 py-1 rounded-full bg-neutral-05 border border-neutral-10">
                            {blog.slug}
                        </span>
                    )}
                    {blog.publishedAt && (
                        <span>
                            Published: {new Date(blog.publishedAt).toLocaleDateString()}
                        </span>
                    )}
                </div>

                {/* Content */}
                {blog.type === 'video' ? (
                    <>
                        {blog.video_url && <VideoPlayer url={blog.video_url} />}
                        <BlogContent content={blog.video_description || ''} />
                    </>
                ) : (
                    <BlogContent content={blog.content || ''} />
                )}
            </article>
        </div>
    )
}

// Helper to get embed URL from common video links
function getEmbedUrl(url: string) {
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
        const videoId = url.split('/').pop()?.split('?')[0] // Remove query params if any
        return videoId ? `https://www.loom.com/embed/${videoId}` : null
    }

    // Google Drive (Preview)
    if (url.includes('drive.google.com/file/d/')) {
        // Convert view/edit links to preview
        return url.replace(/\/view.*$/, '/preview').replace(/\/edit.*$/, '/preview')
    }

    return url // Return as is for other potential embed sources or let iframe fail gracefully
}

function VideoPlayer({ url }: { url: string }) {
    const embedUrl = getEmbedUrl(url)

    if (!embedUrl) {
        return (
            <div className="p-4 bg-neutral-10 text-neutral-500 rounded-lg text-sm mb-8">
                Invalid or missing video URL
            </div>
        )
    }

    return (
        <div className="relative w-full mb-8 rounded-xl overflow-hidden bg-black aspect-video shadow-sm border border-neutral-10">
            <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    )
}

// Separate component to handle content sanitization on client side
function BlogContent({ content }: { content: string }) {
    const sanitizedContent = useMemo(() => {
        if (!content) return ''

        // Create a temporary div to parse HTML
        const temp = document.createElement('div')
        temp.innerHTML = content

        // Find all iframes
        const iframes = Array.from(temp.querySelectorAll('iframe'))

        iframes.forEach((iframe) => {
            const src = iframe.getAttribute('src') || ''

            // Standardize iframe attributes
            iframe.setAttribute('allowfullscreen', 'true')

            // Wrap in responsive container
            wrapIframeResponsively(iframe)
        })

        return temp.innerHTML
    }, [content])

    return (
        <div
            className="prose prose-invert max-w-none space-y-12"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
    )
}

// Helper function to wrap iframes in responsive containers
function wrapIframeResponsively(iframe: HTMLIFrameElement) {
    // Check if already wrapped to avoid double wrapping
    if (iframe.parentNode && (iframe.parentNode as HTMLElement).className?.includes('relative w-full my-6')) {
        return
    }

    // Create wrapper div for responsive video
    const wrapper = document.createElement('div')
    wrapper.className = 'relative w-full my-6 rounded-lg overflow-hidden'
    wrapper.style.paddingBottom = '56.25%' // 16:9 aspect ratio

    // Clone iframe with responsive classes
    const responsiveIframe = iframe.cloneNode(true) as HTMLIFrameElement
    responsiveIframe.className = 'absolute top-0 left-0 w-full h-full'
    responsiveIframe.removeAttribute('width')
    responsiveIframe.removeAttribute('height')

    if (iframe.parentNode) {
        wrapper.appendChild(responsiveIframe)
        iframe.parentNode.replaceChild(wrapper, iframe)
    }
}
