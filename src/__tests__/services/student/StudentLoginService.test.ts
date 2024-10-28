import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StudentLoginService } from '../../../services/student/StudentLoginService';
import { IStudentLoginRepository } from '../../../repository/implementation/StudentLoginRepository';
import { StudentTokenGenerator } from '../../../auth/generateStudentToken';
import { StudentLoginDomain } from '../../../domain/StudentLoginDomain';
import { AppError } from '../../../utils/errors/AppError';

vi.mock('../../../auth/generateStudentToken');

describe('StudentLoginService', () => {
	let studentLoginService: StudentLoginService;
	let studentLoginRepository: IStudentLoginRepository;
	let tokenGenerator: StudentTokenGenerator;

	beforeEach(() => {
		vi.clearAllMocks();
		studentLoginRepository = {
			findStudentByCpf: vi.fn(),
			updateAccessToken: vi.fn(),
			createStudentLogin: vi.fn(),
		} as any;

		tokenGenerator = new StudentTokenGenerator();
		tokenGenerator.generateStudentToken = vi.fn().mockReturnValue({
			token: 'jwt_token',
			expiresAt: new Date(),
		});

		studentLoginService = new StudentLoginService(studentLoginRepository);
		(studentLoginService as any).tokenGenerator = tokenGenerator;
	});

	it('should login an existing student and update the token', async () => {
		const existingStudent = new StudentLoginDomain({
			studentCpf: 'studentCpf',
			accessToken: 'old_token',
			accessTokenExpiration: new Date(),
		});
		studentLoginRepository.findStudentByCpf = vi.fn().mockResolvedValue(existingStudent);

		const result = await studentLoginService.execute('studentCpf', 'new_access_token');

		expect(studentLoginRepository.updateAccessToken).toHaveBeenCalledWith(
			existingStudent
		);
		expect(result).toBe(existingStudent);
	});

	it('should create a new student login if student does not exist', async () => {
		studentLoginRepository.findStudentByCpf = vi.fn().mockResolvedValue(undefined);
		const newStudentLogin = new StudentLoginDomain({
			studentCpf: 'studentCpf',
			accessToken: 'jwt_token',
			accessTokenExpiration: new Date(),
		});
		studentLoginRepository.createStudentLogin = vi
			.fn()
			.mockResolvedValue(newStudentLogin);

		const result = await studentLoginService.execute('studentCpf', 'new_access_token');

		expect(studentLoginRepository.createStudentLogin).toHaveBeenCalledWith(
			expect.any(StudentLoginDomain)
		);
		expect(result).toBe(newStudentLogin);
	});

	it('should throw AppError if login process fails', async () => {
		const error = new Error('Erro ao acessar repositório');
		studentLoginRepository.findStudentByCpf = vi.fn().mockRejectedValue(error);

		await expect(
			studentLoginService.execute('studentCpf', 'new_access_token')
		).rejects.toThrow(AppError);
		await expect(
			studentLoginService.execute('studentCpf', 'new_access_token')
		).rejects.toThrow('Erro ao processar login do aluno');
	});
});
