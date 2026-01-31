import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        inspirationImages: {
          select: {
            id: true,
            imageUrl: true,
            title: true,
            description: true,
            source: true,
            sourceUrl: true,
            saved: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { inspirationImages: true },
        },
      },
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { name, description, coverImageUrl } = body;

    const collection = await prisma.collection.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description }),
        ...(coverImageUrl !== undefined && { coverImageUrl }),
      },
    });

    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    // Unlink images from collection first
    await prisma.inspirationImage.updateMany({
      where: { collectionId: id },
      data: { collectionId: null },
    });

    await prisma.collection.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
  }
}
