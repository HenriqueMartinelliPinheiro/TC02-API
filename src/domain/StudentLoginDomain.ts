interface StudentLoginProps {
	studentLoginId?: number;
	createdAt?: Date;
	updatedAt?: Date;
	accessToken?: string;
	accessTokenExpiration?: Date;
	studentCpf: string;
}

export class StudentLoginDomain {
	private studentLoginId?: number;
	private createdAt?: Date;
	private updatedAt?: Date;
	private accessToken?: string;
	private accessTokenExpiration?: Date;
	private studentCpf: string;

	constructor(props: StudentLoginProps) {
		this.studentLoginId = props.studentLoginId;
		this.createdAt = props.createdAt || new Date();
		this.updatedAt = props.updatedAt || new Date();
		this.accessToken = props.accessToken;
		this.accessTokenExpiration = props.accessTokenExpiration;
		this.studentCpf = props.studentCpf;
	}

	getStudentLoginId(): number | undefined {
		return this.studentLoginId;
	}

	getCreatedAt(): Date | undefined {
		return this.createdAt;
	}

	getUpdatedAt(): Date | undefined {
		return this.updatedAt;
	}

	getAccessToken(): string | undefined {
		return this.accessToken;
	}

	getAccessTokenExpiration(): Date | undefined {
		return this.accessTokenExpiration;
	}

	getStudentCpf(): string {
		return this.studentCpf;
	}

	setAccessToken(accessToken: string): void {
		this.accessToken = accessToken;
	}

	setAccessTokenExpiration(accessTokenExpiration: Date): void {
		this.accessTokenExpiration = accessTokenExpiration;
	}

	setUpdatedAt(updatedAt: Date): void {
		this.updatedAt = updatedAt;
	}
}
