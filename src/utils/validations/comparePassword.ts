import bcrypt from "bcrypt"

export const comparePassword = async (passwordLogin: string, hashPassword: string)=> {
   return await bcrypt.compare(passwordLogin, hashPassword)
}