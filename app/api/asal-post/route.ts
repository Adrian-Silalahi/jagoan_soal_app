import { NextResponse } from 'next/server';

export default async function POST(req: Request) {
    const request = await req.json()
    console.log('woiiiiiiiiiiiiiiiiiii');
    
    return NextResponse.json({ data: 'Hello, Next.js!', status: 200 });
}