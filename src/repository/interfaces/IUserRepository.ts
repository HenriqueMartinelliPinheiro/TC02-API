import { UserDomain } from '../../domain/UserDomain';

export interface IUserRepository {
	createUser(adminUser: UserDomain): Promise<UserDomain | undefined>;
	loginUser(email: string): Promise<UserDomain | undefined>;
	updateAccessToken(user: UserDomain): Promise<[string, Date]>;
	getUserByEmail(userEmail: string): Promise<UserDomain | undefined>;
	fetchAllUsers(
		skip: number,
		take: number,
		searchTerm: string
	): Promise<{ users: UserDomain[]; total: number }>;
}
