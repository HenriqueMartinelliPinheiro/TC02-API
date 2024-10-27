import axios from 'axios';
import { AppError } from '../../../utils/errors/AppError';
import { sigaaApiRoutes } from '../../../config/apiConfigs';

export class FetchStudentByCpfService {
	private apiUrl: string;

	constructor() {
		this.apiUrl = sigaaApiRoutes.FETCH_STUDENTS;
	}

	async fetchStudentByCpf(cpf: string) {
		try {
			const response = await axios.get(this.apiUrl, {
				params: { cpf: cpf },
			});

			if (response.data.length === 0) {
				throw new AppError('Estudante não encontrado com o CPF fornecido', 400);
			}

			return response.data;
		} catch (error) {
			throw new AppError(`Erro ao buscar estudante por CPF: ${error.message}`, 500);
		}
	}
}
