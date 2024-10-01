import axios from 'axios';
import { AppError } from '../../../utils/errors/AppError';
import { sigaaApiRoutes } from '../../../config/apiConfigs';

export class FetchStudentByClassService {
	async execute(classId: number) {
		try {
			const response = await axios.get(sigaaApiRoutes.FETCH_PARTICIPANTS, {
				params: { 'id-turma': classId },
			});
			return response.data;
		} catch (error) {
			throw new AppError(`Erro ao buscar participantes da turma ${classId}`, 500);
		}
	}
}
