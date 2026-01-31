import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        include: {
          inspirationImages: {
            select: { id: true, imageUrl: true },
            take: 4,
          },
          _count: {
            select: { inspirationImages: true },
          },
        },
      }),
      prisma.collection.count(),
    ]);

    return NextResponse.json({
      collections,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const collection = await prisma.collection.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
      include: {
        inspirationImages: {
          select: { id: true, imageUrl: true },
        },
        _count: {
          select: { inspirationImages: true },
        },
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}
