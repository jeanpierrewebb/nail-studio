import { NextRequest, NextResponse } from 'next/server'
import { getTurso, generateId } from '@/lib/turso'

export async function GET() {
  try {
    const turso = getTurso()
    
    // Get all collections
    const collectionsResult = await turso.execute(
      'SELECT * FROM NailCollection ORDER BY createdAt DESC'
    )
    
    // Get image counts and cover images for each collection
    const collections = await Promise.all(
      collectionsResult.rows.map(async (row) => {
        const countResult = await turso.execute({
          sql: 'SELECT COUNT(*) as count FROM NailInspirationImage WHERE collectionId = ?',
          args: [row.id as string]
        })
        
        const coverResult = await turso.execute({
          sql: 'SELECT imageUrl FROM NailInspirationImage WHERE collectionId = ? LIMIT 1',
          args: [row.id as string]
        })
        
        return {
          id: row.id,
          name: row.name,
          description: row.description,
          coverImageUrl: row.coverImageUrl || (coverResult.rows[0]?.imageUrl as string) || null,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          _count: {
            images: Number(countResult.rows[0]?.count || 0)
          }
        }
      })
    )

    return NextResponse.json({ collections })
  } catch (error) {
    console.error('Failed to fetch collections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const turso = getTurso()
    const id = generateId()
    const now = new Date().toISOString()

    await turso.execute({
      sql: 'INSERT INTO NailCollection (id, name, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
      args: [id, name, description || null, now, now]
    })

    const collection = {
      id,
      name,
      description: description || null,
      coverImageUrl: null,
      createdAt: now,
      updatedAt: now,
      _count: { images: 0 }
    }

    return NextResponse.json(collection, { status: 201 })
  } catch (error) {
    console.error('Failed to create collection:', error)
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    )
  }
}
