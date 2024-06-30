interface UserProps {
    userId?: number;
    userName: string;
    userEmail: string;
    userPassword?: string;
    systemStatus?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export class UserDomain {
    private userId?: number;
    private userName: string;
    private userEmail: string;
    private userPassword: string;
    private createdAt: Date;
    private updatedAt: Date;
    private systemStatus: boolean;
  
    constructor(props: UserProps) {
      this.userId = props.userId;
      this.userName = props.userName;
      this.userEmail = props.userEmail;
      this.userPassword = props.userPassword;
      this.createdAt = props.createdAt || new Date();
      this.updatedAt = props.updatedAt || new Date();
      this.systemStatus = props.systemStatus || true;
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
  }
  