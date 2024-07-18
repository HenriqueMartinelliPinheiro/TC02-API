import {UserDomain} from "../../domain/UserDomain";

export interface IUserRepository {
    createUser(adminUser: UserDomain): Promise<UserDomain|undefined>;
    loginUser(email: string): Promise<UserDomain|undefined>;
    updateAccessToken(user:UserDomain): Promise<[string, Date]>
    updateRefreshToken(user:UserDomain): Promise<[string, Date]>
}