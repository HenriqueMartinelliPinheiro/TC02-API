import { IUserRepository } from '../../repository/interfaces/IUserRepository';
import { UserDomain } from '../../domain/UserDomain';

export class FetchAllUsersService {
	private userRepository: IUserRepository;

	constructor(repository: IUserRepository) {
		this.userRepository = repository;
	}

	execute = async (
		skip: number,
		take: number,
		searchTerm
	): Promise<{ users: UserDomain[] | undefined; total: number }> => {
		try {
			const { users, total } = await this.userRepository.fetchAllUsers(
				skip,
				take,
				searchTerm
			);

			return { users, total };
		} catch (error) {
			throw error;
		}
	};
}
