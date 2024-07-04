import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import { UserDomain } from "../../domain/UserDomain";
import { Logger } from "../../loggers/Logger";
import { generatePasswordHash } from "./generatePasswordHash";
import { userLogPath } from "../../config/logPaths";
import { RoleRepository } from "../../repository/implementation/RoleRepository";
import { IRoleRepository } from "../../repository/interfaces/IRoleRepository";

export class CreateUserService {
    private userRepository : IUserRepository;
    private logger: Logger;
    private roleRepository : IRoleRepository;

    constructor(userRepository : IUserRepository, roleRepositrory: IRoleRepository){
        this.userRepository = userRepository;
        this.logger = new Logger("CreateUserService", userLogPath);
        this.roleRepository = roleRepositrory;
    }

    async execute(user : UserDomain) : Promise<UserDomain | undefined> {
        try {
            const userPassword = await generatePasswordHash(user.getUserPassword());
            user.setUserPassword(userPassword);

            const role = await this.roleRepository.getRoleById(user.getRoleId());
            if (!role) {
                throw new Error("Error on getRole");
            } 

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