import { NextRequest, NextResponse } from 'next/server'
import { getTurso, generateId } from '@/lib/turso'

export async function POST(request: NextRequest) {
  try {
    const { 
      imageUrl, 
      sourceUrl, 
      title, 
      description, 
      source, 
      collectionId,
      ideaId,
      saved = true 
    } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    const turso = getTurso()

    // Check if image already exists
    const existing = await turso.execute({
      sql: 'SELECT * FROM NailInspirationImage WHERE imageUrl = ?',
      args: [imageUrl]
    })

    let image

    if (existing.rows.length > 0) {
      // Update existing image
      const updates: string[] = []
      const args: (string | number | null)[] = []

      if (collectionId !== undefined) {
        updates.push('collectionId = ?')
        args.push(collectionId)
      }
      if (ideaId !== undefined) {
        updates.push('ideaId = ?')
        args.push(ideaId)
      }
      updates.push('saved = ?')
      args.push(saved ? 1 : 0)
      
      args.push(imageUrl) // WHERE clause

      if (updates.length > 0) {
        await turso.execute({
          sql: `UPDATE NailInspirationImage SET ${updates.join(', ')} WHERE imageUrl = ?`,
          args
        })
      }

      const result = await turso.execute({
        sql: 'SELECT * FROM NailInspirationImage WHERE imageUrl = ?',
        args: [imageUrl]
      })
      image = result.rows[0]
    } else {
      // Create new image
      const id = generateId()
      const now = new Date().toISOString()

      await turso.execute({
        sql: `INSERT INTO NailInspirationImage 
              (id, imageUrl, sourceUrl, title, description, source, collectionId, ideaId, saved, createdAt) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          imageUrl,
          sourceUrl || imageUrl,
          title || null,
          description || null,
          source || 'unknown',
          collectionId || null,
          ideaId || null,
          saved ? 1 : 0,
          now
        ]
      })

      image = {
        id,
        imageUrl,
        sourceUrl: sourceUrl || imageUrl,
        title: title || null,
        description: description || null,
        source: source || 'unknown',
        collectionId: collectionId || null,
        ideaId: ideaId || null,
        saved: saved ? 1 : 0,
        createdAt: now
      }
    }

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Failed to save image:', error)
    return NextResponse.json(
      { error: 'Failed to save image' },
      { status: 500 }
    )
  }
}
