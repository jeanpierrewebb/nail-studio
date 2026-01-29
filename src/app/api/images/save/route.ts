import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Mock response
  return NextResponse.json({
    id: 'mock-id',
    imageUrl: body.imageUrl,
    sourceUrl: body.sourceUrl,
    source: body.source,
    title: body.title || '',
    description: body.description || '',
    saved: true,
    createdAt: new Date().toISOString()
  }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  // Mock response
  return NextResponse.json({
    id: 'mock-id',
    saved: false
  });
}