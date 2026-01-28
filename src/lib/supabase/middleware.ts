import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Protected routes logic
    // Protect all routes except public ones (auth pages, landing page, static files which are already filtered by matcher)
    const publicPaths = ['/sign-in', '/forget-password', '/reset-password', '/change-password', '/auth/callback'];
    const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path)) || request.nextUrl.pathname === '/';

    if (!user && !isPublicPath) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // Auth routes logic (redirect to dashboard if already logged in)
    if (['/sign-in', '/'].includes(request.nextUrl.pathname) && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}
