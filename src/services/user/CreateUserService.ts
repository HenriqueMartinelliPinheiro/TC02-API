import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import { UserDomain } from "../../domain/UserDomain";
import { userLogger } from "../../logs/user/userLogger";
import { generatePasswordHash } from "./generatePasswordHash";

export class CreateUserService {
    private userRepository : IUserRepository;
    private logger: userLogger;
    constructor(repository : IUserRepository){
        this.userRepository = repository;
        this.logger = new userLogger("CreateUserService");
    }

    async execute(user : UserDomain) : Promise<UserDomain | undefined> {
        try {
            const userPassword = await generatePasswordHash(user.getUserPassword());
            user.setUserPassword(userPassword);
            const createdUser : UserDomain = await this.userRepository.createUser(user);
            if (!createdUser) {
                this.logger.error(`Error when creatingUser`, 1);
                throw new Error("Erro ao criar usuário");
            }
            return createdUser;

        } catch (error) {
            this.logger.error(`Error when executing createUser, Error: ${error}`, 1);
            throw error;
        }
    }
}