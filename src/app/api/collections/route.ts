import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Mock data for now
  return NextResponse.json({
    collections: [],
    total: 0,
    limit: 20,
    offset: 0,
  });
}

export async function POST(request: NextRequest) {
  // Mock response
  return NextResponse.json({
    id: 'mock-id',
    name: 'Mock Collection',
    description: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inspirationImages: [],
    _count: { inspirationImages: 0 }
  }, { status: 201 });
}