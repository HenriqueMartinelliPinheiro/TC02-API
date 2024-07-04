import { PrismaClient } from "@prisma/client";
import { IRoleRepository } from "../interfaces/IRoleRepository";
import { RoleDomain } from "../../domain/RoleDomain";
import { Logger } from "../../loggers/Logger";
import { roleLogPath } from "../../config/logPaths";

export class RoleRepository implements IRoleRepository{
    private prismaClient : PrismaClient;
    private logger : Logger;

    constructor(prismaClient : PrismaClient){
        this.prismaClient = prismaClient;
        this.logger = new Logger("RoleRepository", roleLogPath);
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
            this.logger.error("Error on getRoleById",0, error);
        }
    }    
}