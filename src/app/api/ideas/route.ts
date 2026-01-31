import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const [ideas, total] = await Promise.all([
      prisma.idea.findMany({
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        include: {
          inspirationImages: {
            select: { id: true, imageUrl: true, title: true },
          },
        },
      }),
      prisma.idea.count(),
    ]);

    return NextResponse.json({
      ideas,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, tags } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const idea = await prisma.idea.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        tags: tags || '[]',
      },
      include: {
        inspirationImages: {
          select: { id: true, imageUrl: true, title: true },
        },
      },
    });

    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error('Error creating idea:', error);
    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    );
  }
}
