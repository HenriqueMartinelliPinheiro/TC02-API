import { IRoleRepository } from '../../repository/interfaces/IRoleRepository';
import { Role } from '@prisma/client';
import { RoleDomain } from '../../domain/RoleDomain';

export class CreateRoleService {
	private roleRepository: IRoleRepository;

	constructor(roleRepository: IRoleRepository) {
		this.roleRepository = roleRepository;
	}

	async execute(role: RoleDomain): Promise<Role | undefined> {
		try {
			if (this.roleRepository.getRoleByTitle(role.getRoleTitle())) {
				throw new Error('Role already exists');
			}
			return await this.roleRepository.createRole(role);
		} catch (error) {
			throw error;
		}
	}
}
