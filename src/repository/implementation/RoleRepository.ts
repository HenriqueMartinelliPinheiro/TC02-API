import { PrismaClient } from "@prisma/client";
import { IRoleRepository } from "../interfaces/IRoleRepository";
import { RoleDomain } from "../../domain/RoleDomain";

export class RoleRepository implements IRoleRepository{
    private prismaClient : PrismaClient;

    constructor(prismaClient : PrismaClient){
        this.prismaClient = prismaClient;
    }

    async getRoleById(roleId: number): Promise<RoleDomain | null> {
        try{
            const role = await this.prismaClient.role.findFirst({
                where: {
                    roleId: roleId,
                }
            });
            if(!role){
                return null;
            }
            return new RoleDomain({
                roleId: role.roleId,
                roleTitle: role.roleTitle
            });

        } catch(error){
            throw error;
        }
    }    
}