import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({req, secret: process.env.JWT_SECRET})
    const {pathname} = req.nextUrl
    //allow if true
    // - token exists
    // - there is a request for a session
    if(pathname.includes('/api/auth') || token) {
        return NextResponse.next()
    }
    //redirect to login if no token and route is protected

    if(!token && pathname !== "/login") {
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }
}