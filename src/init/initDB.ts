// initDB.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const roleAdmin = await prisma.role.create({
      data: {
        roleTitle: 'Admin',
      },
    });

  } catch (error) {
    console.error('Erro ao inserir Role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  throw e;
});
