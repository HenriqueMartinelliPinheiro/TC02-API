import bcrypt from "bcrypt"
import { hash } from "crypto"

export const comparePassword = async (passwordLogin: string, hashPassword: string)=> {
    const comparationResult = await bcrypt.compare(passwordLogin, hashPassword)
    return comparationResult;
}