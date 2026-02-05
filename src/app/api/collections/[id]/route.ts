import { NextRequest, NextResponse } from 'next/server'
import { getTurso } from '@/lib/turso'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const turso = getTurso()
    
    const collectionResult = await turso.execute({
      sql: 'SELECT * FROM NailCollection WHERE id = ?',
      args: [id]
    })

    if (collectionResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    const row = collectionResult.rows[0]
    
    // Get images in this collection
    const imagesResult = await turso.execute({
      sql: 'SELECT * FROM NailInspirationImage WHERE collectionId = ? ORDER BY createdAt DESC',
      args: [id]
    })

    const collection = {
      id: row.id,
      name: row.name,
      description: row.description,
      coverImageUrl: row.coverImageUrl,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      images: imagesResult.rows.map(img => ({
        id: img.id,
        sourceUrl: img.sourceUrl,
        imageUrl: img.imageUrl,
        source: img.source,
        title: img.title,
        description: img.description,
        saved: img.saved,
        createdAt: img.createdAt,
        ideaId: img.ideaId,
        collectionId: img.collectionId
      }))
    }

    return NextResponse.json({ collection })
  } catch (error) {
    console.error('Failed to fetch collection:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collection' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, description, coverImageUrl } = await request.json()
    const turso = getTurso()
    const now = new Date().toISOString()

    // Build update query dynamically
    const updates: string[] = ['updatedAt = ?']
    const args: (string | null)[] = [now]

    if (name !== undefined) {
      updates.push('name = ?')
      args.push(name)
    }
    if (description !== undefined) {
      updates.push('description = ?')
      args.push(description)
    }
    if (coverImageUrl !== undefined) {
      updates.push('coverImageUrl = ?')
      args.push(coverImageUrl)
    }

    args.push(id) // WHERE clause

    await turso.execute({
      sql: `UPDATE NailCollection SET ${updates.join(', ')} WHERE id = ?`,
      args
    })

    // Fetch updated collection
    const result = await turso.execute({
      sql: 'SELECT * FROM NailCollection WHERE id = ?',
      args: [id]
    })

    const imagesResult = await turso.execute({
      sql: 'SELECT * FROM NailInspirationImage WHERE collectionId = ?',
      args: [id]
    })

    const row = result.rows[0]
    const collection = {
      id: row.id,
      name: row.name,
      description: row.description,
      coverImageUrl: row.coverImageUrl,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      images: imagesResult.rows
    }

    return NextResponse.json(collection)
  } catch (error) {
    console.error('Failed to update collection:', error)
    return NextResponse.json(
      { error: 'Failed to update collection' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const turso = getTurso()
    
    // Remove collection reference from images first
    await turso.execute({
      sql: 'UPDATE NailInspirationImage SET collectionId = NULL WHERE collectionId = ?',
      args: [id]
    })
    
    // Delete the collection
    await turso.execute({
      sql: 'DELETE FROM NailCollection WHERE id = ?',
      args: [id]
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete collection:', error)
    return NextResponse.json(
      { error: 'Failed to delete collection' },
      { status: 500 }
    )
  }
}
