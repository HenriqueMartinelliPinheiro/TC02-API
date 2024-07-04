// PrivilegeDomain.ts

import { RolePrivilegeDomain } from "./RolePrivilegeDomain";

interface PrivilegeProps {
  privilegeId?: number;
  privilegeType: string;
  roles?: RolePrivilegeDomain[];
}

export class PrivilegeDomain {
  private privilegeId?: number;
  private privilegeType: string;
  private roles: RolePrivilegeDomain[];

  constructor(props: PrivilegeProps) {
    this.privilegeId = props.privilegeId;
    this.privilegeType = props.privilegeType;
    this.roles = props.roles || [];
  }

  getPrivilegeId() {
    return this.privilegeId;
  }

  getPrivilegeType() {
    return this.privilegeType;
  }

  getRoles() {
    return this.roles;
  }

  addRole(role: RolePrivilegeDomain) {
    this.roles.push(role);
  }
}
