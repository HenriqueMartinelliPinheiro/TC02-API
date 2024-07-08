import { RoleDomain } from './RoleDomain';

interface UserProps {
  userId?: number;
  userName?: string;
  userEmail: string;
  userPassword?: string;
  systemStatus?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  role?: RoleDomain;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiration?: Date;
  refreshTokenExpiration?: Date;
}

export class UserDomain {
  private userId?: number;
  private userName: string;
  private userEmail: string;
  private userPassword: string;
  private createdAt: Date;
  private updatedAt: Date;
  private systemStatus: boolean;
  private role?: RoleDomain;
  private accessToken?: string;
  private refreshToken?: string;
  private accessTokenExpiration?: Date;
  private refreshTokenExpiration?: Date;

  constructor(props: UserProps) {
    this.userId = props.userId;
    this.userName = props.userName;
    this.userEmail = props.userEmail;
    this.userPassword = props.userPassword || '';
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.systemStatus = props.systemStatus !== undefined ? props.systemStatus : true;
    this.role = props.role;
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
    this.accessTokenExpiration = props.accessTokenExpiration;
    this.refreshTokenExpiration = props.refreshTokenExpiration;
  }

  getUserId() {
    return this.userId;
  }

  getUserName() {
    return this.userName;
  }

  getUserEmail() {
    return this.userEmail;
  }

  getUserPassword() {
    return this.userPassword;
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

  getRole() {
    return this.role;
  }

  getAccessToken() {
    return this.accessToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  getAccessTokenExpiration() {
    return this.accessTokenExpiration;
  }

  getRefreshTokenExpiration() {
    return this.refreshTokenExpiration;
  }


  setUserName(userName: string) {
    this.userName = userName;
  }

  setUserEmail(userEmail: string) {
    this.userEmail = userEmail;
  }

  setUserPassword(userPassword: string) {
    this.userPassword = userPassword;
  }

  setSystemStatus(systemStatus: boolean) {
    this.systemStatus = systemStatus;
  }

  setRole(role: RoleDomain) {
    this.role = role;
  }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  setAccessTokenExpiration(tokenExpiration: Date) {
    this.accessTokenExpiration = tokenExpiration;
  }

  setRefreshTokenExpiration(tokenExpiration: Date) {
    this.refreshTokenExpiration = tokenExpiration;
  }

  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }
}