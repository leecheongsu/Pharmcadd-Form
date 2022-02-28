import { NextResponse } from 'next/server'

export function middleware(req) {
    const accessToken = req.cookies && req.cookies.accessToken || ''
    if (!accessToken) {
        const url = new URL('/account/login', req.url)
        const nextUrl = req.nextUrl.pathname
        return NextResponse.redirect(url + '?redirect=' + nextUrl)
    }

    return NextResponse.next()
}
