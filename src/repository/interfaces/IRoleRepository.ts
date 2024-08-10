import { Role } from '@prisma/client';
import { RoleDomain } from '../../domain/RoleDomain';

export interface IRoleRepository {
	getRoleById(roleId: number): Promise<Role | undefined>;
	createRole(role: RoleDomain): Promise<Role | undefined>;
	getRoleByTitle(roleTitle: string): Promise<Role | undefined>;
	fetchAllRoles(): Promise<Role[] | undefined>;
}
