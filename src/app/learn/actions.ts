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

        if (!res.ok) {
            throw new Error(`Failed to fetch blog: ${res.status}`)
        }

        const json = await res.json()
        return json.data
    } catch (error: any) {
        console.error('Error fetching blog:', error)
        throw error
    }
}

// Superseded by getBlogs with full data
// export async function getBlogsList() { ... } 

export async function getBlogs() {
    const baseUrl = process.env.STRAPI_URL
    const token = process.env.STRAPI_API_TOKEN

    if (!baseUrl || !token) {
        throw new Error('Missing STRAPI_URL or STRAPI_API_TOKEN environment variables')
    }

    try {
        // Fetch full blog data with category for the listing page
        const res = await fetch(`${baseUrl}/api/blogs?sort=createdAt:desc&populate=category`, {
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
        return json.data
    } catch (error: any) {
        console.error('Error fetching blogs list:', error)
        return []
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

        return {
            progress: progressData || [],
            partners: partnersData || [],
        }
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
        const res = await fetch(`${baseUrl}/api/categories?sort=name:asc`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        })

        if (!res.ok) {
            const text = await res.text()
            console.error('Strapi getCategories Error:', text)
            throw new Error(`Failed to fetch categories: ${res.status}`)
        }

        const json = await res.json()
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

        if (!res.ok) {
            const errorText = await res.text()
            console.error('Strapi Create Category Error:', errorText)
            throw new Error(`Failed to create category: ${res.status} ${errorText}`)
        }

        const json = await res.json()
        return json.data
    } catch (error: any) {
        console.error('Error creating category:', error)
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

    if (!res.ok) {
        const text = await res.text()
        console.error('Strapi Create Error:', text)
        throw new Error(`Failed to create blog: ${res.status} ${text}`)
    }

    const json = await res.json()
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

    if (!res.ok) {
        const text = await res.text()
        console.error('Strapi Update Error:', text)
        throw new Error(`Failed to update blog: ${res.status} ${text}`)
    }

    const json = await res.json()
    return json.data
}
