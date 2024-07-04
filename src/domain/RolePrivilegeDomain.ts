// RolePrivilegeDomain.ts

import { RoleDomain } from './RoleDomain';
import { PrivilegeDomain } from './PrivilegyDomain';

interface RolePrivilegeProps {
  rolePrivilegeId?: number;
  roleId: number;
  privilegeId: number;
  privilege: PrivilegeDomain;
  role: RoleDomain;
}

export class RolePrivilegeDomain {
  private rolePrivilegeId?: number;
  private roleId: number;
  private privilegeId: number;
  private privilege: PrivilegeDomain;
  private role: RoleDomain;

  constructor(props: RolePrivilegeProps) {
    this.rolePrivilegeId = props.rolePrivilegeId;
    this.roleId = props.roleId;
    this.privilegeId = props.privilegeId;
    this.privilege = props.privilege;
    this.role = props.role;
  }

  getRolePrivilegeId() {
    return this.rolePrivilegeId;
  }

  getRoleId() {
    return this.roleId;
  }

  getPrivilegeId() {
    return this.privilegeId;
  }

  getPrivilege() {
    return this.privilege;
  }

  getRole() {
    return this.role;
  }
}
