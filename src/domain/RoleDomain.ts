// RoleDomain.ts

import { UserDomain } from './UserDomain';

interface RoleProps {
  roleId: number;
  roleTitle: string;
  users?: UserDomain[];
}

export class RoleDomain {
  private roleId?: number;
  private roleTitle: string;
  private users: UserDomain[];

  constructor(props: RoleProps) {
    this.roleId = props.roleId;
    this.roleTitle = props.roleTitle;
    this.users = props.users || [];
  }

  getRoleId() {
    return this.roleId;
  }

  getRoleTitle() {
    return this.roleTitle;
  }

  getUsers() {
    return this.users;
  }

  addUser(user: UserDomain) {
    this.users.push(user);
  }
}
