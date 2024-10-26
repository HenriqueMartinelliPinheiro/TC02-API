import { PrismaClient } from '@prisma/client';
import { StudentLoginDomain } from '../../domain/StudentLoginDomain';
import { AppError } from '../../utils/errors/AppError';

export interface IStudentLoginRepository {
	findStudentByCpf(studentCpf: string): Promise<StudentLoginDomain | undefined>;
	createStudentLogin(studentLogin: StudentLoginDomain): Promise<StudentLoginDomain>;
	updateAccessToken(studentLogin: StudentLoginDomain): Promise<void>;
}
