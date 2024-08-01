import { TokenGenerator } from "../../auth/TokenGenerator";
import { UserDomain } from "../../domain/UserDomain";
import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import { generatePasswordHash } from "../../utils/generatePasswordHash";
import { comparePassword } from "../../utils/validations/comparePassword";

export class LoginUserService {
    private userRepository : IUserRepository;
    private tokenGenerator : TokenGenerator;

    constructor(userRepository: IUserRepository){
        this.userRepository = userRepository;
        this.tokenGenerator = new TokenGenerator();
    }

    async execute(user: UserDomain) : Promise<UserDomain>{
        try{

            const loggedUser = await this.userRepository.loginUser(user.getUserEmail());
            if (!loggedUser) {
                return null;
            }
            const comparedPassword = await comparePassword(user.getUserPassword(),loggedUser.getUserPassword());
            if (comparedPassword) {
                loggedUser.setUserPassword("");
                const { token: accessToken, expiresAt: accessTokenExpiration } = this.tokenGenerator.generateAccessToken(loggedUser);
                loggedUser.setAccessToken(accessToken);
                loggedUser.setAccessTokenExpiration(accessTokenExpiration);
                    
                this.userRepository.updateAccessToken(loggedUser);
                
                return loggedUser;
            }

            return null;
        } catch(error){
            throw error;
        }
    }
}