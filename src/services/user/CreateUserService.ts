import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import { UserDomain } from "../../domain/UserDomain";

export class CreateUserService {
    private userRepository : IUserRepository;

    constructor(repository : IUserRepository){
        this.userRepository = repository;
    }

    async execute(user : UserDomain) : Promise<UserDomain | undefined> {
        try {
            const createdUser : UserDomain = await this.userRepository.createUser(user);
            if (!createdUser) {
                console.error("Erro ao criar usuário")
                throw new Error("Erro ao criar usuário");
            }
            return createdUser;

        } catch (error) {
            console.error(`Erro executar CreateUser:${error}`);
            throw error;
        }
    }
}