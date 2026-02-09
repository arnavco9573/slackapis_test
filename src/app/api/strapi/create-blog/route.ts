import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL?.trim()!
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN?.trim()!

export async function POST(req: Request) {
    try {
        const body = await req.json()

        if (!body.title || !body.slug) {
            return NextResponse.json(
                { error: 'Title and slug are required' },
                { status: 400 }
            )
        }

        const baseUrl = STRAPI_URL.endsWith('/')
            ? STRAPI_URL.slice(0, -1)
            : STRAPI_URL

        const endpoint = `${baseUrl}/api/blogs`

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            body: JSON.stringify({
                data: body,
            }),
        })

        const data = await res.json()
        return NextResponse.json(data, { status: res.status })

    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: 'Create blog failed' },
            { status: 500 }
        )
    }
}

