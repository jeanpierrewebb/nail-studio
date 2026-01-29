// Mock Prisma client for now - will be implemented later with proper database
export const prisma = {
  idea: {
    findMany: async () => [],
    count: async () => 0,
    create: async (data: any) => ({
      id: 'mock-id',
      ...data.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  },
  collection: {
    findMany: async () => [],
    count: async () => 0,
    create: async (data: any) => ({
      id: 'mock-id',
      ...data.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  },
  inspirationImage: {
    findFirst: async () => null,
    create: async (data: any) => ({
      id: 'mock-id',
      ...data.data,
      createdAt: new Date().toISOString(),
    }),
    update: async () => ({
      id: 'mock-id',
      saved: true,
    }),
  },
};