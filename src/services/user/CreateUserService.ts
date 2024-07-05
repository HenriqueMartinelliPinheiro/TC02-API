import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import { UserDomain } from "../../domain/UserDomain";
import { generatePasswordHash } from "../../utils/generatePasswordHash";
import { userLogPath } from "../../config/logPaths";
import { IRoleRepository } from "../../repository/interfaces/IRoleRepository";

export class CreateUserService {
    private userRepository : IUserRepository;
    private roleRepository : IRoleRepository;

    constructor(userRepository : IUserRepository, roleRepositrory: IRoleRepository){
        this.userRepository = userRepository;
        this.roleRepository = roleRepositrory;
    }

    async execute(user : UserDomain) : Promise<UserDomain | undefined> {
        try {
            const userPassword = await generatePasswordHash(user.getUserPassword());
            user.setUserPassword(userPassword);

            const role = await this.roleRepository.getRoleById(user.getRole().getRoleId());
            if (!role && role.getRoleTitle()!=user.getRole().getRoleTitle()) {
                throw new Error("Error on getRole");
            } 

            const createdUser : UserDomain = await this.userRepository.createUser(user);
            if (!createdUser) {
                throw new Error(`Error when creatingUser`);
            }
            return createdUser;

        } catch (error) {
            throw error;
        }
    }
}