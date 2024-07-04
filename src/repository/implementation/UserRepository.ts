import { IUserRepository } from "../interfaces/IUserRepository";
import { PrismaClient } from "@prisma/client";
import { UserDomain } from "../../domain/UserDomain";
import { Logger } from "../../loggers/Logger";
import { userLogPath } from "../../config/logPaths";

export class UserRepository implements IUserRepository {
    private prismaClient: PrismaClient;
    private logger: Logger;

    constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient;
        this.logger = new Logger("UserRepository", userLogPath);
    }

    private createUserInDatabase = async (user: UserDomain): Promise<UserDomain | undefined> => {
        try {
            const createdUser = await this.prismaClient.user.create({
                data: {
                    userEmail: user.getUserEmail(),
                    userPassword: user.getUserPassword(),
                    userName: user.getUserName(),
                    roleId: user.getRoleId(),
                }
            });

            return new UserDomain({
                userId: createdUser.userId,
                userName: createdUser.userName,
                userEmail: createdUser.userEmail,
                systemStatus: createdUser.systemStatus,
                createdAt: createdUser.createdAt,
                updatedAt: createdUser.updatedAt,
                roleId : createdUser.roleId,
            });

        } catch (err) {
            this.logger.error('Error when creating user', 0, err); // Passando o erro capturado para o logger
            return undefined;
        }
    }

    createUser = async (user: UserDomain): Promise<UserDomain | undefined> => {
        try {
            return await this.createUserInDatabase(user);
        } catch (err) {
            this.logger.error('Error when calling createUserInDatabase', 0, err); // Passando o erro capturado para o logger
            return undefined;
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
                    roleId: user.roleId,
                });
            }
            return undefined;
        } catch (err) {
            this.logger.error('Error when searching user', 0, err); // Passando o erro capturado para o logger
            return undefined;
        }
    }
}
