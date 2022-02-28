import { NextResponse } from "next/server";
import jwt_decode from "jwt-decode";

export function middleware(req) {
    const accessToken = req.cookies && req.cookies.accessToken || ''
    if (accessToken) {
        const { authorities } = jwt_decode(accessToken);
        const isAdmin = authorities.some(v => ['ADMIN', 'CAMPAIGN_ADMIN'].includes(v))
        return isAdmin
            ? NextResponse.next()
            : NextResponse.redirect(new URL('/campaigns', req.url))
    }
    const url = new URL('/account/login', req.url)
    const nextUrl = req.nextUrl.pathname

    return NextResponse.redirect(url + '?redirect=' + nextUrl)
}
