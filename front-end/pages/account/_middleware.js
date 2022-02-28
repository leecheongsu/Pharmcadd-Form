import { NextResponse } from 'next/server'

export function middleware(req) {
    const accessToken = req.cookies && req.cookies.accessToken || ''
    if (accessToken) {
        return NextResponse.redirect(new URL('/campaigns', req.url))
    }

    return NextResponse.next()
}
