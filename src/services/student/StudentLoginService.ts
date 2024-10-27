import { IStudentLoginRepository } from '../../repository/implementation/StudentLoginRepository';
import { StudentLoginDomain } from '../../domain/StudentLoginDomain';
import { AppError } from '../../utils/errors/AppError';

export class StudentLoginService {
	private studentLoginRepository: IStudentLoginRepository;

	constructor(studentLoginRepository: IStudentLoginRepository) {
		this.studentLoginRepository = studentLoginRepository;
	}

	async execute(
		studentCpf: string,
		studentRegistration: string,
		accessToken: string
	): Promise<StudentLoginDomain> {
		try {
			const existingStudent = await this.studentLoginRepository.findStudentByCpf(
				studentCpf
			);

			const accessTokenExpiration = new Date(new Date().getTime() + 60 * 60 * 1000); 

			if (existingStudent) {
				existingStudent.setAccessToken(accessToken);
				existingStudent.setAccessTokenExpiration(accessTokenExpiration);
				existingStudent.setUpdatedAt(new Date());
				await this.studentLoginRepository.updateAccessToken(existingStudent);
				return existingStudent;
			} else {
				const newStudentLogin = new StudentLoginDomain({
					studentCpf,
					accessToken,
					accessTokenExpiration,
				});
				return await this.studentLoginRepository.createStudentLogin(newStudentLogin);
			}
		} catch (error) {
			console.log(error);
			throw new AppError('Erro ao processar login do aluno', 500);
		}
	}
}
