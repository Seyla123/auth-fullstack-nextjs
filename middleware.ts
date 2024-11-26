import { NextRequest, NextResponse } from 'next/server';

// Custom CORS middleware
async function corsMiddleware(req: NextRequest, res: NextResponse) {
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
    const allowedHeaders = ['Content-Type', 'Authorization'];

    if (req.method === 'OPTIONS') {
        res.headers.set('Access-Control-Allow-Methods', allowedMethods.join(','));
        res.headers.set('Access-Control-Allow-Headers', allowedHeaders.join(','));
        res.headers.set('Access-Control-Allow-Origin', '*');
        return new NextResponse(null, { status: 204 });
    } else {
        res.headers.set('Access-Control-Allow-Origin', '*');
    }
}

// Middleware function to handle requests
export async function middleware(req: NextRequest) {
    const response = NextResponse.next();
    await corsMiddleware(req, response);
    return response;
}

// Apply the middleware only to API routes
export const config = {
    matcher: '/api/:path*', // Apply middleware to all API routes
};
