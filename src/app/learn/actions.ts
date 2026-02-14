'use server'

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
}

export async function getBlogByDocumentId(documentId: string) {
    const baseUrl = process.env.STRAPI_URL
    const token = process.env.STRAPI_API_TOKEN

    if (!baseUrl || !token) {
        throw new Error('Missing STRAPI_URL or STRAPI_API_TOKEN environment variables')
    }

    try {
        const res = await fetch(`${baseUrl}/api/blogs/${documentId}?populate=*`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        })

        const json = await res.json()
        console.log('--- STRAPI DEBUG: getBlogByDocumentId ---')
        console.log('URL:', res.url)
        console.log('DATA:', JSON.stringify(json.data, null, 2))
        return json.data
    } catch (error: any) {
        console.error('Error fetching blog:', error)
        throw error
    }
}

// Superseded by getBlogs with full data
// export async function getBlogsList() { ... } 

export async function getBlogs(params: {
    page?: number
    pageSize?: number
    categorySlug?: string
    marketType?: string
    contentType?: string
    sortOrder?: string
    search?: string
    status?: 'published' | 'draft' | 'all'
} = {}) {
    const baseUrl = process.env.STRAPI_URL
    const token = process.env.STRAPI_API_TOKEN

    if (!baseUrl || !token) {
        throw new Error('Missing STRAPI_URL or STRAPI_API_TOKEN environment variables')
    }

    const {
        page = 1,
        pageSize = 10,
        categorySlug,
        marketType,
        contentType,
        sortOrder = 'createdAt:desc',
        search,
        status = 'all'
    } = params

    try {
        let url = `${baseUrl}/api/blogs?populate=category`

        // Pagination
        url += `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`

        // Sorting
        url += `&sort=${sortOrder === 'newest' ? 'createdAt:desc' : sortOrder === 'oldest' ? 'createdAt:asc' : sortOrder === 'recently_updated' ? 'updatedAt:desc' : 'createdAt:desc'}`

        // Filters
        if (categorySlug && categorySlug !== 'all') {
            url += `&filters[category][slug][$eq]=${categorySlug}`
        }

        if (marketType && marketType !== 'ALL') {
            url += `&filters[market][$eq]=${marketType.toUpperCase()}`
        }

        if (contentType && contentType !== 'ALL') {
            url += `&filters[type][$eq]=${contentType.toLowerCase()}`
        }

        if (search) {
            url += `&filters[title][$containsi]=${search}`
        }

        // Custom Status Field Handling
        url += `&publicationState=preview` // Always fetch all states

        // Note: Moving status filtering to client-side to avoid 400 errors if field is missing/misconfigured
        // if (status === 'draft') {
        //     url += `&filters[blog_status][$eq]=draft`
        // } else if (status === 'published') {
        //     url += `&filters[blog_status][$eq]=published`
        // }

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        })

        if (!res.ok) {
            const text = await res.text()
            console.error('Strapi getBlogs Error:', text)
            throw new Error(`Failed to fetch blogs: ${res.status}`)
        }

        const json = await res.json()
        let blogs = json.data || []

        if (status === 'draft') {
            blogs = blogs.filter((blog: any) => blog.blog_status?.toLowerCase() === 'draft')
        } else if (status === 'published') {
            // Include items with blog_status='published' OR items without blog_status but with publishedAt (backward compatibility)
            blogs = blogs.filter((blog: any) =>
                blog.blog_status?.toLowerCase() === 'published' ||
                (!blog.blog_status && blog.publishedAt)
            )
        }

        console.log('--- STRAPI DEBUG: getBlogs ---')
        console.log('URL:', res.url)
        console.log('BLOGS COUNT (Filtered):', blogs.length)
        return {
            data: blogs,
            meta: json.meta?.pagination || { page: 1, pageSize: 10, pageCount: 1, total: 0 }
        }
    } catch (error: any) {
        console.error('Error fetching blogs list:', error)
        return { data: [], meta: { page: 1, pageSize: 10, pageCount: 0, total: 0 } }
    }
}

export async function toggleBlogVisibility(documentId: string, isLive: boolean) {
    const baseUrl = process.env.STRAPI_URL
    const token = process.env.STRAPI_API_TOKEN

    if (!baseUrl || !token) {
        throw new Error('Missing STRAPI_URL or STRAPI_API_TOKEN environment variables')
    }

    try {
        const res = await fetch(`${baseUrl}/api/blogs/${documentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                data: {
                    publishedAt: isLive ? new Date().toISOString() : null,
                    blog_status: isLive ? 'published' : 'draft'
                }
            }),
        })

        if (!res.ok) {
            throw new Error(`Failed to toggle visibility: ${res.status}`)
        }

        const json = await res.json()
        console.log('--- STRAPI DEBUG: toggleBlogVisibility ---')
        console.log('DATA:', JSON.stringify(json.data, null, 2))
        return json
    } catch (error) {
        console.error('Error toggling visibility:', error)
        throw error
    }
}

export async function deleteBlog(documentId: string) {
    const baseUrl = process.env.STRAPI_URL
    const token = process.env.STRAPI_API_TOKEN

    if (!baseUrl || !token) {
        throw new Error('Missing STRAPI_URL or STRAPI_API_TOKEN environment variables')
    }

    try {
        const res = await fetch(`${baseUrl}/api/blogs/${documentId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            },
        })

        if (!res.ok) {
            throw new Error(`Failed to delete blog: ${res.status}`)
        }

        return true
    } catch (error) {
        console.error('Error deleting blog:', error)
        throw error
    }
}

import { createAdminClient } from '@/lib/supabase/server'

export async function getProgressAndPartners(blogDocumentIds: string[]) {
    if (!blogDocumentIds || blogDocumentIds.length === 0) return { progress: [], partners: [] }

    try {
        // Use Admin Client to bypass RLS and see everyone's progress
        const supabase = createAdminClient()

        // Fetch progress for these blogs
        const { data: progressData, error: progressError } = await supabase
            .from('learning_progress')
            .select('*')
            .in('blog_document_id', blogDocumentIds)
            .eq('completed', true)

        if (progressError) {
            console.error('Error fetching progress:', progressError)
            return { progress: [], partners: [] }
        }

        if (!progressData || progressData.length === 0) {
            return { progress: [], partners: [] }
        }

        // Get unique partner IDs
        const partnerIds = Array.from(
            new Set(progressData.map((p) => p.wl_partner_id))
        )

        // Fetch partners
        const { data: partnersData, error: partnersError } = await supabase
            .from('wl_partners')
            .select('id, business_name, first_name, last_name')
            .in('id', partnerIds)

        if (partnersError) {
            console.error('Error fetching partners:', partnersError)
            return { progress: progressData || [], partners: [] }
        }

        const result = {
            progress: progressData || [],
            partners: partnersData || [],
        }
        console.log('--- SUPABASE DEBUG: getProgressAndPartners ---')
        console.log('PROGRESS COUNT:', result.progress.length)
        console.log('PARTNERS COUNT:', result.partners.length)
        return result
    } catch (error) {
        console.error('Error in getProgressAndPartners action:', error)
        return { progress: [], partners: [] }
    }
}


export async function getCategories() {
    const baseUrl = process.env.STRAPI_URL
    const token = process.env.STRAPI_API_TOKEN

    if (!baseUrl || !token) {
        throw new Error('Missing STRAPI_URL or STRAPI_API_TOKEN environment variables')
    }

    try {
        // Sort by 'name' (lowercase) which is likely the API ID for field 'Name'
        // Populating blogs to get the count of materials
        const res = await fetch(`${baseUrl}/api/categories?sort=name:asc&populate=blogs`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        })

        const json = await res.json()
        console.log('--- STRAPI DEBUG: getCategories ---')
        console.log('CATEGORIES COUNT:', json.data?.length || 0)
        return json.data
    } catch (error: any) {
        console.error('Error fetching categories:', error)
        return []
    }
}

export async function createCategory(name: string) {
    const baseUrl = process.env.STRAPI_URL
    const token = process.env.STRAPI_API_TOKEN

    if (!baseUrl || !token) {
        throw new Error('Missing STRAPI_URL or STRAPI_API_TOKEN environment variables')
    }

    try {
        const res = await fetch(`${baseUrl}/api/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                data: {
                    name: name,
                    slug: slugify(name)
                }
            }),
        })

        const json = await res.json()
        console.log('--- STRAPI DEBUG: createCategory ---')
        console.log('NEW CATEGORY:', JSON.stringify(json.data, null, 2))
        return json.data
    } catch (error: any) {
        console.error('Error creating category:', error)
        throw error
    }
}

export async function deleteCategory(documentId: string) {
    const baseUrl = process.env.STRAPI_URL
    const token = process.env.STRAPI_API_TOKEN

    if (!baseUrl || !token) {
        throw new Error('Missing STRAPI_URL or STRAPI_API_TOKEN environment variables')
    }

    try {
        const res = await fetch(`${baseUrl}/api/categories/${documentId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error('Strapi Delete Category Error:', errorText)
            throw new Error(`Failed to delete category: ${res.status} ${errorText}`)
        }

        console.log('--- STRAPI DEBUG: deleteCategory ---')
        console.log('DELETED:', documentId)
        return true
    } catch (error: any) {
        console.error('Error deleting category:', error)
        throw error
    }
}

export async function updateCategory(documentId: string, name: string) {
    const baseUrl = process.env.STRAPI_URL
    const token = process.env.STRAPI_API_TOKEN

    if (!baseUrl || !token) {
        throw new Error('Missing STRAPI_URL or STRAPI_API_TOKEN environment variables')
    }

    try {
        const res = await fetch(`${baseUrl}/api/categories/${documentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                data: {
                    name: name,
                    slug: slugify(name)
                }
            })
        })

        const json = await res.json()
        console.log('--- STRAPI DEBUG: updateCategory ---')
        console.log('UPDATED CATEGORY:', JSON.stringify(json.data, null, 2))
        return json.data
    } catch (error: any) {
        console.error('Error updating category:', error)
        throw error
    }
}

export async function createBlog(payload: {
    title: string
    slug: string
    content?: string
    type: 'article' | 'video'
    video_url?: string
    video_description?: string
    category?: string // documentId of category
    recommended_blogs?: string[] // array of documentIds
    tags?: string[]
    description?: string
    market: 'GLOBAL' | 'USA'
    publishedAt?: string | null
    blog_status?: 'published' | 'draft'
}) {
    const baseUrl = process.env.STRAPI_URL
    const token = process.env.STRAPI_API_TOKEN

    if (!baseUrl || !token) {
        throw new Error('Missing STRAPI_URL or STRAPI_API_TOKEN environment variables')
    }

    const res = await fetch(`${baseUrl}/api/blogs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ data: payload }),
    })

    const json = await res.json()
    console.log('--- STRAPI DEBUG: createBlog ---')
    console.log('NEW BLOG:', JSON.stringify(json.data, null, 2))
    return json.data
}

export async function updateBlog(payload: {
    documentId: string
    title: string
    slug: string
    content?: string
    type?: 'article' | 'video'
    video_url?: string
    video_description?: string
    category?: string
    recommended_blogs?: string[]
    tags?: string[]
    description?: string
    market?: 'GLOBAL' | 'USA'
    publishedAt?: string | null
    blog_status?: 'published' | 'draft'
}) {
    const baseUrl = process.env.STRAPI_URL
    const token = process.env.STRAPI_API_TOKEN

    if (!baseUrl || !token) {
        throw new Error('Missing STRAPI_URL or STRAPI_API_TOKEN environment variables')
    }

    const { documentId, ...data } = payload

    const res = await fetch(`${baseUrl}/api/blogs/${documentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ data }),
    })

    const json = await res.json()
    console.log('--- STRAPI DEBUG: updateBlog ---')
    console.log('UPDATED BLOG:', JSON.stringify(json.data, null, 2))
    return json.data
}
