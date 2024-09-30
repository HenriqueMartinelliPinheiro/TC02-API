import axios from 'axios';
import { AppError } from '../../../utils/errors/AppError';
import { sigaaApiRoutes } from '../../../config/apiConfigs';

export class GetAllClassesYearService {
	private apiUrl: string;

	constructor() {
		this.apiUrl = `${sigaaApiRoutes.FETCH_ALL_CLASSES}`;
	}

	async getAllClassesByYear(ano: number) {
		try {
			const response = await axios.get(this.apiUrl, {
				params: { ano },
			});

			if (response.data.length === 0) {
				throw new AppError('Nenhuma turma encontrada para o ano fornecido', 400);
			}

			return response.data;
		} catch (error) {
			throw new AppError(`Erro ao buscar turmas pelo ano: ${error.message}`, 500);
		}
	}
}
