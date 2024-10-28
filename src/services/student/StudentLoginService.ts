import { IStudentLoginRepository } from '../../repository/implementation/StudentLoginRepository';
import { StudentLoginDomain } from '../../domain/StudentLoginDomain';
import { AppError } from '../../utils/errors/AppError';
import { StudentTokenGenerator } from '../../auth/generateStudentToken';

export class StudentLoginService {
	private studentLoginRepository: IStudentLoginRepository;
	private tokenGenerator: StudentTokenGenerator;

	constructor(studentLoginRepository: IStudentLoginRepository) {
		this.studentLoginRepository = studentLoginRepository;
		this.tokenGenerator = new StudentTokenGenerator();
	}

	async execute(studentCpf: string, accessToken: string): Promise<StudentLoginDomain> {
		try {
			const existingStudent = await this.studentLoginRepository.findStudentByCpf(
				studentCpf
			);
			const { token, expiresAt } = this.tokenGenerator.generateStudentToken(studentCpf);

			if (existingStudent) {
				existingStudent.setAccessToken(token);
				existingStudent.setAccessTokenExpiration(expiresAt);
				existingStudent.setStudentCPF(studentCpf);
				existingStudent.setUpdatedAt(new Date());
				await this.studentLoginRepository.updateAccessToken(existingStudent);
				return existingStudent;
			} else {
				const newStudentLogin = new StudentLoginDomain({
					studentCpf,
					accessToken,
					accessTokenExpiration: expiresAt,
				});
				return await this.studentLoginRepository.createStudentLogin(newStudentLogin);
			}
		} catch (error) {
			console.log(error);
			throw new AppError('Erro ao processar login do aluno', 500);
		}
	}
}
