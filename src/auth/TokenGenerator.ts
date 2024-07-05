import jwt  from "jsonwebtoken";
import { UserDomain } from "../domain/UserDomain";

export class TokenGenearator{
    constructor(){}

    generateAccessToken (user: UserDomain): string{
        const payload = {
            userId: user.getUserId(),
            userName: user.getUserName(),
            userEmail: user.getUserEmail(),
        }
        
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES,
          });
    
        return token;
    }

    generateRefreshToken(user:UserDomain) {
        const payload = {
            userId: user.getUserId(),
            userName: user.getUserName(),
            userEmail: user.getUserEmail(),
        }
        
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES,
          });
    
        return token;
    }
}
