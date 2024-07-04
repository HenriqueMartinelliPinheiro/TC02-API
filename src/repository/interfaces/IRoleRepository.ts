import { RoleDomain } from "../../domain/RoleDomain";

export interface IRoleRepository{
    getRoleById(roleId:number) : Promise<RoleDomain | null>;
}
