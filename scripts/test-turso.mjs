import { createClient } from '@libsql/client';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log('URL:', url);
console.log('Token:', authToken?.substring(0, 20) + '...');

// Test 1: Direct libsql
console.log('\n--- Direct libsql test ---');
try {
  const client = createClient({ url, authToken });
  const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('Tables:', result.rows.map(r => r.name));
  
  // Try inserting
  await client.execute({
    sql: "INSERT INTO NailCollection (id, name, description, createdAt, updatedAt) VALUES (?, ?, ?, datetime('now'), datetime('now'))",
    args: ['test-direct-1', 'Direct Test', 'Testing direct insert'],
  });
  console.log('Direct insert: ✅');
  
  // Clean up
  await client.execute({ sql: "DELETE FROM NailCollection WHERE id = ?", args: ['test-direct-1'] });
  console.log('Direct delete: ✅');
} catch (err) {
  console.error('Direct error:', err.message);
}

// Test 2: Prisma with adapter
console.log('\n--- Prisma adapter test ---');
try {
  const libsql = createClient({ url, authToken });
  const adapter = new PrismaLibSql(libsql);
  const prisma = new PrismaClient({ adapter });
  
  const collections = await prisma.collection.findMany();
  console.log('Prisma findMany: ✅', collections.length, 'collections');
  
  const newCol = await prisma.collection.create({
    data: { name: 'Prisma Test', description: 'Testing Prisma' },
  });
  console.log('Prisma create: ✅', newCol.id);
  
  await prisma.collection.delete({ where: { id: newCol.id } });
  console.log('Prisma delete: ✅');
} catch (err) {
  console.error('Prisma error:', err.message);
  console.error('Full:', err);
}
