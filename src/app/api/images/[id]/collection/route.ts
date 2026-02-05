import { NextRequest, NextResponse } from 'next/server'
import { getTurso } from '@/lib/turso'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const turso = getTurso()

    // Remove image from collection (set collectionId to null)
    await turso.execute({
      sql: 'UPDATE NailInspirationImage SET collectionId = NULL WHERE id = ?',
      args: [id]
    })

    const result = await turso.execute({
      sql: 'SELECT * FROM NailInspirationImage WHERE id = ?',
      args: [id]
    })

    return NextResponse.json({ success: true, image: result.rows[0] })
  } catch (error) {
    console.error('Failed to remove image from collection:', error)
    return NextResponse.json(
      { error: 'Failed to remove image from collection' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { collectionId } = await request.json()

    if (!collectionId) {
      return NextResponse.json(
        { error: 'Collection ID is required' },
        { status: 400 }
      )
    }

    const turso = getTurso()

    // Add image to collection
    await turso.execute({
      sql: 'UPDATE NailInspirationImage SET collectionId = ?, saved = 1 WHERE id = ?',
      args: [collectionId, id]
    })

    const result = await turso.execute({
      sql: 'SELECT * FROM NailInspirationImage WHERE id = ?',
      args: [id]
    })

    return NextResponse.json({ success: true, image: result.rows[0] })
  } catch (error) {
    console.error('Failed to add image to collection:', error)
    return NextResponse.json(
      { error: 'Failed to add image to collection' },
      { status: 500 }
    )
  }
}
