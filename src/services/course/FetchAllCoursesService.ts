import { CourseInterface } from '../../apis/sigaa/CourseInterface';
import { SigaaCourseData } from '../../apis/sigaa/CourseInterface';
import { API_BASE_URL, sigaaApiRoutes } from '../../config/apiConfigs';
import { AxiosInstance } from 'axios';
import { ApiService } from '../../apis/sigaa/axiosConfig';

export class FetchAllCoursesService {
	private axiosInstance: AxiosInstance;

	constructor() {
		this.axiosInstance = new ApiService(API_BASE_URL).axiosInstance;
	}

	execute = async (): Promise<{
		courses: CourseInterface[] | undefined;
		total: number;
	}> => {
		try {
			const { data } = await this.axiosInstance.get<SigaaCourseData[]>(
				sigaaApiRoutes.FETCH_ALL_COURSES
			);

			const courses: CourseInterface[] = data.map((courseData) => ({
				courseId: Number(courseData['id-curso']),
				courseName: courseData.curso,
			}));

			return { courses, total: courses.length };
		} catch (error) {
			console.error('Erro ao buscar cursos:', error);
			throw error;
		}
	};
}
