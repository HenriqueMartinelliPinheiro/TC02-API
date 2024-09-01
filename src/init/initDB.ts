// initDB.ts

import { PrismaClient } from '@prisma/client';
import { generatePasswordHash } from '../utils/generatePasswordHash';

const prisma = new PrismaClient();

async function main() {
	console.log('Iniciando inserção de dados...');
	try {
		const roleAdmin = await prisma.role.create({
			data: {
				roleTitle: 'Admin',
			},
		});

		const roleOrganzador = await prisma.role.create({
			data: {
				roleTitle: 'Organizador',
			},
		});

		const user = await prisma.user.create({
			data: {
				userEmail: 'henriquepinheiro18@gmail.com',
				userName: 'Henrique',
				roleId: roleAdmin.roleId,
				login: {
					create: {
						userEmail: 'henriquepinheiro18@gmail.com',
						userPassword: await generatePasswordHash('Abcd1234@'),
					},
				},
			},
		});
		console.log('User:', user);
	} catch (error) {
		console.error('Erro ao inserir Role:', error);
	} finally {
		await prisma.$disconnect();
	}
}

main().catch((e) => {
	throw e;
});
