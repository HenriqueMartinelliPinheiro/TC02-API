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

    const privilegyAdmin = await prisma.privilegy.create({
      data: {
        privilegyType: 'All',
      },
    });

    console.log('Role e Privilegy inseridos com sucesso.');

  } catch (error) {
    console.error('Erro ao inserir Role e Privilegy:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  throw e;
});
