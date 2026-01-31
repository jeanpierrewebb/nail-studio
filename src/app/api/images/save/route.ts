import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, sourceUrl, source, title, description, collectionId, ideaId } = body;

    if (!imageUrl || !sourceUrl) {
      return NextResponse.json(
        { error: 'imageUrl and sourceUrl are required' },
        { status: 400 }
      );
    }

    // Check if image already exists (by imageUrl)
    const existing = await prisma.inspirationImage.findFirst({
      where: { imageUrl },
    });

    if (existing) {
      // Update it to saved
      const updated = await prisma.inspirationImage.update({
        where: { id: existing.id },
        data: { saved: true },
      });
      return NextResponse.json(updated);
    }

    // Create new saved image
    const image = await prisma.inspirationImage.create({
      data: {
        imageUrl,
        sourceUrl,
        source: source || 'Web',
        title: title || null,
        description: description || null,
        saved: true,
        collectionId: collectionId || null,
        ideaId: ideaId || null,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error saving image:', error);
    return NextResponse.json(
      { error: 'Failed to save image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const imageUrl = searchParams.get('imageUrl');

    if (!id && !imageUrl) {
      return NextResponse.json(
        { error: 'id or imageUrl is required' },
        { status: 400 }
      );
    }

    if (id) {
      const updated = await prisma.inspirationImage.update({
        where: { id },
        data: { saved: false },
      });
      return NextResponse.json(updated);
    }

    // Find by imageUrl
    const existing = await prisma.inspirationImage.findFirst({
      where: { imageUrl: imageUrl! },
    });

    if (existing) {
      const updated = await prisma.inspirationImage.update({
        where: { id: existing.id },
        data: { saved: false },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  } catch (error) {
    console.error('Error unsaving image:', error);
    return NextResponse.json(
      { error: 'Failed to unsave image' },
      { status: 500 }
    );
  }
}
