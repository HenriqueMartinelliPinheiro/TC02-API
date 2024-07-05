import { UserDomain } from './UserDomain';

interface RoleProps {
  roleId?: number;
  roleTitle: string;
  users?: UserDomain[];
  createdAt?: Date;
  updatedAt?: Date;
  systemStatus?: boolean;
}

export class RoleDomain {
  private roleId?: number;
  private roleTitle: string;
  private users: UserDomain[];
  private createdAt: Date;
  private updatedAt: Date;
  private systemStatus: boolean;

  constructor(props: RoleProps) {
    this.roleId = props.roleId;
    this.roleTitle = props.roleTitle;
    this.users = props.users || [];
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.systemStatus = props.systemStatus !== undefined ? props.systemStatus : true;
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

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  getSystemStatus() {
    return this.systemStatus;
  }

  addUser(user: UserDomain) {
    this.users.push(user);
  }

  setRoleTitle(roleTitle: string) {
    this.roleTitle = roleTitle;
  }

  setUsers(users: UserDomain[]) {
    this.users = users;
  }

  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }

  setSystemStatus(systemStatus: boolean) {
    this.systemStatus = systemStatus;
  }
}
