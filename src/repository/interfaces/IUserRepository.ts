import {UserDomain} from "../../domain/UserDomain";

export interface IUserRepository {
    createUser(adminUser: UserDomain): Promise<UserDomain|undefined>;
    loginUser(email: string, password: string): Promise<UserDomain|undefined>;
}