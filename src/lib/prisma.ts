// HOLOGRAPHIC MODE: Mocking Prisma Client to avoid 'prisma generate' build errors on Vercel
// import { PrismaClient } from '@prisma/client'

const prismaClientMock = new Proxy({}, {
    get: (_target, prop) => {
        return () => Promise.resolve([]); // Return empty promise for any call
    }
});

declare const globalThis: {
    prismaGlobal: any;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientMock;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
