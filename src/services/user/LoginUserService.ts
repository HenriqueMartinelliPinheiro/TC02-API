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

            if (comparePassword(user.getUserPassword(),loggedUser.getUserPassword())) {
                loggedUser.setUserPassword("");
                const { token: accessToken, expiresAt: accessTokenExpiration } = this.tokenGenerator.generateAccessToken(loggedUser);
                loggedUser.setAccessToken(accessToken);
                loggedUser.setAccessTokenExpiration(accessTokenExpiration);
        
                const { token: refreshToken, expiresAt: refreshTokenExpiration } = this.tokenGenerator.generateRefreshToken(loggedUser);
                loggedUser.setRefreshToken(refreshToken);
                loggedUser.setRefreshTokenExpiration(refreshTokenExpiration);

                this.userRepository.updateAccessToken(loggedUser);
                this.userRepository.updateRefreshToken(loggedUser);
                
                return loggedUser;
            }

            return null;
        } catch(error){
            throw error;
        }
    }
}