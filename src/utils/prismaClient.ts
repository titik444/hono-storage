import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default prisma;

export const { QueryMode } = Prisma;
