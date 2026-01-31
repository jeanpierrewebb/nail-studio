import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const statements = [
  `CREATE TABLE IF NOT EXISTS "NailIdea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "NailCollection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "NailInspirationImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceUrl" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "saved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ideaId" TEXT,
    "collectionId" TEXT,
    CONSTRAINT "NailInspirationImage_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "NailIdea" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "NailInspirationImage_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "NailCollection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "NailTrendItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageUrl" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "title" TEXT,
    "trendScore" INTEGER NOT NULL DEFAULT 0,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
];

async function main() {
  console.log('Creating tables in Turso...');
  for (const sql of statements) {
    const tableName = sql.match(/"(\w+)"/)?.[1];
    try {
      await client.execute(sql);
      console.log(`✅ ${tableName}`);
    } catch (err) {
      console.error(`❌ ${tableName}:`, err.message);
    }
  }
  
  // Verify
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('\nTables in Turso:', tables.rows.map(r => r.name).join(', '));
}

main().catch(console.error);
