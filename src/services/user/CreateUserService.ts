import { IUserRepository } from '../../repository/interfaces/IUserRepository';
import { UserDomain } from '../../domain/UserDomain';
import { generatePasswordHash } from '../../utils/generatePasswordHash';
import { IRoleRepository } from '../../repository/interfaces/IRoleRepository';
import { AppError } from '../../utils/errors/AppError';

export class CreateUserService {
	private userRepository: IUserRepository;
	private roleRepository: IRoleRepository;

	constructor(userRepository: IUserRepository, roleRepository: IRoleRepository) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
	}

	async execute(user: UserDomain): Promise<UserDomain> {
		try {
			const userPassword = await generatePasswordHash(user.getUserPassword());
			user.setUserPassword(userPassword);

			const role = await this.roleRepository.getRoleById(user.getRole().getRoleId());
			if (!role || role.roleTitle != user.getRole().getRoleTitle()) {
				throw new AppError('Cargo não encontrado ao criar usuário', 400);
			}

			const userExists = await this.userRepository.getUserByEmail(user.getUserEmail());

			if (userExists) {
				throw new AppError(`O email ${user.getUserEmail()} já está registrado.`, 409);
			}

			const createdUser: UserDomain = await this.userRepository.createUser(user);
			if (!createdUser) {
				throw new AppError(`Erro ao criar usuário`, 500);
			}
			return createdUser;
		} catch (error) {
			throw error;
		}
	}
}
