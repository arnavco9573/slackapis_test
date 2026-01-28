import { NextResponse } from 'next/server'

export async function PUT(req: Request) {
    const body = await req.json()
    const { documentId, title, content, slug } = body

    const res = await fetch(
        `${process.env.STRAPI_URL}/api/blogs/${documentId}`,
        {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    title,
                    content,
                    slug,
                },
            }),
        }
    )

    if (!res.ok) {
        const text = await res.text()
        return NextResponse.json(
            { error: text },
            { status: res.status }
        )
    }

    const json = await res.json()
    return NextResponse.json(json.data)
}
