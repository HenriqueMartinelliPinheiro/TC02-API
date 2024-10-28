import jwt from 'jsonwebtoken';

export class StudentTokenGenerator {
	constructor() {}

	generateStudentToken(studentCpf: string): { token: string; expiresAt: Date } {
		const payload = {
			studentCpf: studentCpf,
		};

		const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
			expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES,
		});

		const expiresAt = this.getExpirationDate(process.env.JWT_ACCESS_TOKEN_EXPIRES);

		return { token, expiresAt };
	}

	private getExpirationDate(expiresIn: string | number): Date {
		const now = new Date();
		const expiresInMs =
			typeof expiresIn === 'string' ? this.parseExpiresIn(expiresIn) : expiresIn * 1000;
		return new Date(now.getTime() + expiresInMs);
	}

	private parseExpiresIn(expiresIn: string): number {
		const timeUnit = expiresIn.slice(-1);
		const timeValue = parseInt(expiresIn.slice(0, -1), 10);

		switch (timeUnit) {
			case 's':
				return timeValue * 1000;
			case 'm':
				return timeValue * 60 * 1000;
			case 'h':
				return timeValue * 60 * 60 * 1000;
			case 'd':
				return timeValue * 24 * 60 * 60 * 1000;
			default:
				throw new Error('Invalid expiration format');
		}
	}
}
