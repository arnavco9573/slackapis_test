import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL?.trim()!
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN?.trim()!

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { title, slug, content } = body

        if (!title || !slug) {
            return NextResponse.json(
                { error: 'Title and slug are required' },
                { status: 400 }
            )
        }

        // Ensure STRAPI_URL doesn't end with a slash to avoid double slashes
        const baseUrl = STRAPI_URL.endsWith('/') ? STRAPI_URL.slice(0, -1) : STRAPI_URL
        const endpoint = `${baseUrl}/api/blogs`
        console.log('Posting to:', endpoint)

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            body: JSON.stringify({
                data: {
                    title,
                    slug,
                    content,
                    publishedAt: new Date().toISOString(),
                },
            }),
        })

        if (!res.ok) {
            const text = await res.text()
            console.error('Strapi Error:', res.status, text)
            return NextResponse.json({ error: text }, { status: res.status })
        }

        const data = await res.json()

        return NextResponse.json(data, { status: res.status })
    } catch (err) {
        console.error('Create blog exception:', err)
        return NextResponse.json(
            { error: 'Create blog failed' },
            { status: 500 }
        )
    }
}
