import { NextRequest, NextResponse } from 'next/server'
import { getTurso, generateId } from '@/lib/turso'

export async function GET() {
  try {
    const turso = getTurso()
    
    const ideasResult = await turso.execute(
      'SELECT * FROM NailIdea ORDER BY createdAt DESC'
    )

    // Get images for each idea
    const ideas = await Promise.all(
      ideasResult.rows.map(async (row) => {
        const imagesResult = await turso.execute({
          sql: 'SELECT * FROM NailInspirationImage WHERE ideaId = ?',
          args: [row.id as string]
        })

        return {
          id: row.id,
          title: row.title,
          description: row.description,
          tags: row.tags,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          images: imagesResult.rows
        }
      })
    )

    return NextResponse.json({ ideas })
  } catch (error) {
    console.error('Failed to fetch ideas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, tags } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const turso = getTurso()
    const id = generateId()
    const now = new Date().toISOString()

    await turso.execute({
      sql: 'INSERT INTO NailIdea (id, title, description, tags, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
      args: [id, title, description || null, JSON.stringify(tags || []), now, now]
    })

    const idea = {
      id,
      title,
      description: description || null,
      tags: JSON.stringify(tags || []),
      createdAt: now,
      updatedAt: now,
      images: []
    }

    return NextResponse.json(idea, { status: 201 })
  } catch (error) {
    console.error('Failed to create idea:', error)
    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    )
  }
}
