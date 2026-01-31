import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl && tursoToken) {
    // Use Turso (remote)
    const libsql = createClient({ url: tursoUrl, authToken: tursoToken });
    const adapter = new PrismaLibSql(libsql as any);
    return new PrismaClient({ adapter } as any);
  }

  // Use local SQLite via libsql file adapter
  const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
  const libsql = createClient({ url: dbUrl });
  const adapter = new PrismaLibSql(libsql as any);
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
