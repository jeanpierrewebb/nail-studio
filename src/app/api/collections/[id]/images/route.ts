import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Add image to collection
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json({ error: 'imageId is required' }, { status: 400 });
    }

    const updated = await prisma.inspirationImage.update({
      where: { id: imageId },
      data: { collectionId: id },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error adding image to collection:', error);
    return NextResponse.json({ error: 'Failed to add image to collection' }, { status: 500 });
  }
}

// Remove image from collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json({ error: 'imageId is required' }, { status: 400 });
    }

    const updated = await prisma.inspirationImage.update({
      where: { id: imageId },
      data: { collectionId: null },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error removing image from collection:', error);
    return NextResponse.json({ error: 'Failed to remove image from collection' }, { status: 500 });
  }
}
