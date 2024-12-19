/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        jwt.verify(token, secret);
        return NextResponse.next();
    } catch (err) {
        return NextResponse.redirect(new URL('/', req.url));
    }
}

export const config = {
    matcher: ['/dashboard', '/profile'],
};