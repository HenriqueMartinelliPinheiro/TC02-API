import { IUserRepository } from "../interfaces/IUserRepository";
import { PrismaClient } from "@prisma/client";
import { UserDomain } from "../../domain/UserDomain";
import { RoleDomain } from "../../domain/RoleDomain";

export class UserRepository implements IUserRepository {
    private prismaClient: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient;
    }

    private createUserInDatabase = async (user: UserDomain): Promise<UserDomain | undefined> => {
        try {
            const createdUser = await this.prismaClient.user.create({
                data: {
                    userEmail: user.getUserEmail(),
                    userName: user.getUserName(),
                    roleId: user.getRole().getRoleId(),

                    login:{
                        create: {
                            userEmail: user.getUserEmail(),
                            userPassword: user.getUserPassword(),
                            createdAt: user.getCreatedAt(),
                            updatedAt: user.getUpdatedAt(),
                            accessToken: user.getAccessToken(),
                            refreshToken: user.getRefreshToken(),
                            tokenExpiration: user.getTokenExpiration(),
                        }

                    }
                },
                 include: {
                    role: true,
                    login: true,
                },
            });

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
    }

    createUser = async (user: UserDomain): Promise<UserDomain | undefined> => {
        try {
            return await this.createUserInDatabase(user);
        } catch (error) {
            throw error;
        }
    }

    loginUser = async (email: string, password: string): Promise<UserDomain | undefined> => {
        try {
            const user = await this.prismaClient.user.findFirst({
                where: {
                    userEmail: email,
                    login: {
                        userPassword: password,
                    }
                },
                include:{
                    login: true
                }
            });

            if (user) {
                return new UserDomain({
                    userId: user.userId,
                    userName: user.userName,
                    userEmail: user.userEmail,
                    systemStatus: user.systemStatus,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    accessToken: user.login.accessToken,
                    refreshToken: user.login.refreshToken,
                });
            }
            return undefined;
        } catch (error) {
            throw error;
        }
    }
}
