import { IRoleRepository } from '../../repository/interfaces/IRoleRepository';
import { Role } from '@prisma/client';
import { RoleDomain } from '../../domain/RoleDomain';

export class CreateUserService {
	private roleRepository: IRoleRepository;

	constructor(roleRepositrory: IRoleRepository) {
		this.roleRepository = roleRepositrory;
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
