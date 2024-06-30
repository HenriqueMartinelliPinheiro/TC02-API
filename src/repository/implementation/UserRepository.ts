import { IUserRepository } from "../interfaces/IUserRepository";
import { PrismaClient } from "@prisma/client";
import { UserDomain } from "../../domain/UserDomain";
import bcrypt from 'bcrypt';
import { error } from "console";

export class UserRepository implements IUserRepository{
    private prismaClient: PrismaClient;

    constructor(prismaClient : PrismaClient){
        this.prismaClient = prismaClient; 
    }

    private createUserInDatabase = async (user : UserDomain) : Promise<UserDomain | undefined> => {
        try{
            const userPassword = await this.generatePasswordHash(user.getUserPassword());
            if (userPassword === undefined) {
                console.error('Erro ao criar senha');
                throw new Error('Erro ao criar senha');
            }

            const createdUser = await this.prismaClient.user.create({
                data: {
                    userEmail: user.getUserEmail(),
                    userPassword: userPassword,
                    userName: user.getUserName(),
                }
            });

                return new UserDomain({
                    userId: createdUser.userId,
                    userName: createdUser.userName,
                    userEmail: createdUser.userEmail,
                    systemStatus: createdUser.systemStatus,
                    createdAt: createdUser.createdAt,
                    updatedAt: createdUser.updatedAt,
            });

        } catch(err){
            console.error('Erro ao criar usuário:', err);
            return undefined;
        }
    }

    private generatePasswordHash = async (password : string) : Promise<string|undefined> => {
        try {
            bcrypt.genSalt(11, (err, salt) => {
                if (err) {
                    console.error('Erro ao criar salt:', err);
                    throw new Error(`Erro ao criar salt: ${err}`);
                }
                bcrypt.hash(password,salt, (err, hash) => {
                    if(err){
                        console.error('Erro ao criar hash:', err);
                        throw new Error(`Erro ao criar hash: ${err}`);
                    }
                    return hash;
                });
            });
        } catch(err){
            console.error('Erro ao gerar hash:', err);        
            return undefined;
        }
    }

    createUser = async (user : UserDomain) : Promise<UserDomain | undefined> => {
        try {                    
            this.createUserInDatabase(user);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
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

            if(user){
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
            console.error('Erro ao buscar usuário:', error);
            return undefined;
        }
    }
}