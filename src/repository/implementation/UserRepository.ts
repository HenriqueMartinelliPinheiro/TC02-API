import { IUserRepository } from '../interfaces/IUserRepository';
import { PrismaClient } from '@prisma/client';
import { UserDomain } from '../../domain/UserDomain';
import { RoleDomain } from '../../domain/RoleDomain';

export class UserRepository implements IUserRepository {
	private prismaClient: PrismaClient;

	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}

	private createUserInDatabase = async (user: UserDomain): Promise<UserDomain> => {
		try {
			const createdUser = await this.prismaClient.user.create({
				data: {
					userEmail: user.getUserEmail(),
					userName: user.getUserName(),
					roleId: user.getRole().getRoleId(),
					login: {
						create: {
							userEmail: user.getUserEmail(),
							userPassword: user.getUserPassword(),
						},
					},
				},
				include: {
					role: true,
					login: true,
				},
			});

			if (!createdUser) {
				throw new Error('Error on creating User');
			}

			return new UserDomain({
				userId: createdUser.userId,
				userName: createdUser.userName,
				userEmail: createdUser.userEmail,
				systemStatus: createdUser.systemStatus,
				createdAt: createdUser.createdAt,
				updatedAt: createdUser.updatedAt,
				role: new RoleDomain({
					roleTitle: createdUser.role.roleTitle,
					roleId: createdUser.role.roleId,
				}),
			});
		} catch (error) {
			throw error;
		}
	};

	createUser = async (user: UserDomain): Promise<UserDomain> => {
		try {
			const createdUser = await this.createUserInDatabase(user);
			if (!createdUser) {
				throw new Error('Error on create User');
			}
			return createdUser;
		} catch (error) {
			throw error;
		}
	};

	loginUser = async (email: string): Promise<UserDomain | undefined> => {
		try {
			const user = await this.prismaClient.user.findFirst({
				where: {
					userEmail: email,
				},
				include: {
					login: true,
					role: true,
				},
			});

			if (user) {
				return new UserDomain({
					userId: user.userId,
					userName: user.userName,
					userEmail: user.userEmail,
					systemStatus: user.systemStatus,
					createdAt: user.createdAt,
					updatedAt: user.updatedAt,
					userPassword: user.login.userPassword,
					role: new RoleDomain({
						roleTitle: user.role.roleTitle,
						roleId: user.role.roleId,
					}),
				});
			}
			return undefined;
		} catch (error) {
			throw error;
		}
	};

	updateAccessToken = async (user: UserDomain): Promise<[string, Date]> => {
		try {
			const updatedUser = await this.prismaClient.login.update({
				where: {
					userId: user.getUserId(),
				},
				data: {
					accessToken: user.getAccessToken(),
					accessTokenExpiration: user.getAccessTokenExpiration(),
				},
				include: {
					user: true,
				},
			});

			return [updatedUser.accessToken, updatedUser.accessTokenExpiration];
		} catch (error) {
			throw error;
		}
	};

	getUserByEmail = async (userEmail: string): Promise<UserDomain> => {
		try {
			const user = await this.prismaClient.user.findFirst({
				where: {
					userEmail: userEmail,
				},
			});

			if (user) {
				return new UserDomain({
					userId: user.userId,
					userName: user.userName,
					userEmail: user.userEmail,
					systemStatus: user.systemStatus,
					createdAt: user.createdAt,
					updatedAt: user.updatedAt,
				});
			}
			return undefined;
		} catch (error) {
			throw error;
		}
	};
}
