import { NextRequest, NextResponse } from 'next/server'
import { getTurso } from '@/lib/turso'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const turso = getTurso()

    const ideaResult = await turso.execute({
      sql: 'SELECT * FROM NailIdea WHERE id = ?',
      args: [id]
    })

    if (ideaResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      )
    }

    const row = ideaResult.rows[0]

    const imagesResult = await turso.execute({
      sql: 'SELECT * FROM NailInspirationImage WHERE ideaId = ?',
      args: [id]
    })

    const idea = {
      id: row.id,
      title: row.title,
      description: row.description,
      tags: row.tags,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      images: imagesResult.rows
    }

    return NextResponse.json({ idea })
  } catch (error) {
    console.error('Failed to fetch idea:', error)
    return NextResponse.json(
      { error: 'Failed to fetch idea' },
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
    const { title, description, tags } = await request.json()
    const turso = getTurso()
    const now = new Date().toISOString()

    const updates: string[] = ['updatedAt = ?']
    const args: (string | null)[] = [now]

    if (title !== undefined) {
      updates.push('title = ?')
      args.push(title)
    }
    if (description !== undefined) {
      updates.push('description = ?')
      args.push(description)
    }
    if (tags !== undefined) {
      updates.push('tags = ?')
      args.push(JSON.stringify(tags))
    }

    args.push(id)

    await turso.execute({
      sql: `UPDATE NailIdea SET ${updates.join(', ')} WHERE id = ?`,
      args
    })

    const result = await turso.execute({
      sql: 'SELECT * FROM NailIdea WHERE id = ?',
      args: [id]
    })

    const imagesResult = await turso.execute({
      sql: 'SELECT * FROM NailInspirationImage WHERE ideaId = ?',
      args: [id]
    })

    const row = result.rows[0]
    const idea = {
      id: row.id,
      title: row.title,
      description: row.description,
      tags: row.tags,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      images: imagesResult.rows
    }

    return NextResponse.json(idea)
  } catch (error) {
    console.error('Failed to update idea:', error)
    return NextResponse.json(
      { error: 'Failed to update idea' },
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

    // Remove idea reference from images first
    await turso.execute({
      sql: 'UPDATE NailInspirationImage SET ideaId = NULL WHERE ideaId = ?',
      args: [id]
    })

    // Delete the idea
    await turso.execute({
      sql: 'DELETE FROM NailIdea WHERE id = ?',
      args: [id]
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete idea:', error)
    return NextResponse.json(
      { error: 'Failed to delete idea' },
      { status: 500 }
    )
  }
}
