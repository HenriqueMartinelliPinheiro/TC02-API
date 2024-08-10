import { Role } from '@prisma/client';
import { IRoleRepository } from '../../repository/interfaces/IRoleRepository';
import { AppError } from '../../utils/errors/AppError';

export class FetchAllRolesService {
	private roleRepository: IRoleRepository;

	constructor(repository: IRoleRepository) {
		this.roleRepository = repository;
	}

	execute = async (): Promise<Role[] | undefined> => {
		try {
			const roles = await this.roleRepository.fetchAllRoles();

			if (!roles) {
				throw new AppError('Nenhum cargo encontrado', 404);
			}

			return roles;
		} catch (error) {
			throw error;
		}
	};
}
