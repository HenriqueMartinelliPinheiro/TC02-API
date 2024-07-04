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
                    userPassword: user.getUserPassword(),
                    userName: user.getUserName(),
                    roleId: user.getRole().getRoleId(),
                },
                 include: {
                    role: true,
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
                    roleId: createdUser.role.roleId,
                    roleTitle: createdUser.role.roleTitle,
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
                });
            }
            return undefined;
        } catch (error) {
            throw error;
        }
    }
}
