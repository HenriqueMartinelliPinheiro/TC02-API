import axios from 'axios';
import { sigaaApiRoutes } from '../../../config/apiConfigs';

export class FetchTeacherById {
	private apiUrl: string;

	constructor() {
		this.apiUrl = `${sigaaApiRoutes.FETCH_TEACHERS}`;
	}

	public async getTeacherById(idDocente: number): Promise<any | null> {
		try {
			const response = await axios.get(sigaaApiRoutes.FETCH_TEACHERS(idDocente));
			return response.data;
		} catch (error) {
			if (error.response && error.response.status === 404) {
				console.error('Docente não encontrado');
				return null;
			} else {
				console.error('Erro ao buscar o docente:', error);
				throw error;
			}
		}
	}
}
