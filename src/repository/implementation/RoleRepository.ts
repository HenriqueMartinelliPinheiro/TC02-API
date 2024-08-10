import { PrismaClient, Role } from '@prisma/client';
import { IRoleRepository } from '../interfaces/IRoleRepository';
import { RoleDomain } from '../../domain/RoleDomain';

export class RoleRepository implements IRoleRepository {
	private prismaClient: PrismaClient;

	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}

	async getRoleById(roleId: number): Promise<Role | null> {
		try {
			const role = await this.prismaClient.role.findFirst({
				where: {
					roleId: roleId,
				},
			});
			if (!role) {
				return undefined;
			}
			return role;
		} catch (error) {
			throw error;
		}
	}

	async getRoleByTitle(roleTitle: string): Promise<Role | null> {
		try {
			const role = await this.prismaClient.role.findFirst({
				where: {
					roleTitle: roleTitle,
				},
			});
			if (!role) {
				return undefined;
			}
			return role;
		} catch (error) {
			throw error;
		}
	}

	async createRole(role: RoleDomain): Promise<Role | undefined> {
		try {
			const createdRole = this.prismaClient.role.create({
				data: {
					roleTitle: role.getRoleTitle(),
				},
			});

			if (createdRole) {
				return createdRole;
			}
			return undefined;
		} catch (error) {
			throw error;
		}
	}

	async fetchAllRoles(): Promise<Role[] | undefined> {
		try {
			const roles = this.prismaClient.role.findMany();

			if ((await roles).length < 1) {
				return undefined;
			}
			return roles;
		} catch (error) {
			throw error;
		}
	}
}
