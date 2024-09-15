import axios from 'axios';
import { AppError } from '../../utils/errors/AppError';

export class FetchStudentByCpfService {
	private apiUrl: string;

	constructor() {
		this.apiUrl = 'http://localhost:3000/discentes';
	}

	async fetchStudentByCpf(cpf: string) {
		try {
			const response = await axios.get(this.apiUrl, {
				params: { 'cpf-cnpj': cpf },
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
