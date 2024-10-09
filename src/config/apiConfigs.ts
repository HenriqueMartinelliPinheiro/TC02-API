export const API_BASE_URL = 'http://localhost:3000';
const idUnidade = 1; //supostamente id do IFC Videira
export const sigaaApiRoutes = {
	FETCH_ALL_COURSES: `${API_BASE_URL}/cursos?idUnidade=${idUnidade}`,
	FETCH_STUDENTS: `${API_BASE_URL}/discentes`,
	FETCH_ALL_CLASSES: `${API_BASE_URL}/turmas?idUnidade=${idUnidade}`,
	FETCH_PARTICIPANTS: `${API_BASE_URL}/participantes`,
	FETCH_TEACHERS: (id) => `${API_BASE_URL}/docentes/${id}`,
};
