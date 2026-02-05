import { createClient } from '@libsql/client'

// Create Turso client for serverless (lazy init)
let _turso: ReturnType<typeof createClient> | null = null

export function getTurso() {
  if (!_turso) {
    _turso = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  }
  return _turso
}

// Helper types matching Turso schema
export interface NailIdea {
  id: string
  title: string
  description: string | null
  tags: string | null
  createdAt: string
  updatedAt: string
}

export interface NailCollection {
  id: string
  name: string
  description: string | null
  coverImageUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface NailInspirationImage {
  id: string
  sourceUrl: string
  imageUrl: string
  source: string
  title: string | null
  description: string | null
  saved: number
  createdAt: string
  ideaId: string | null
  collectionId: string | null
}

export interface NailTrendItem {
  id: string
  imageUrl: string
  sourceUrl: string
  source: string
  title: string | null
  trendScore: number
  scrapedAt: string
}

// Generate cuid-like ID
export function generateId(): string {
  return 'c' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}
