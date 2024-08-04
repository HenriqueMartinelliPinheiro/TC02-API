import { Logger } from '../../loggers/Logger';
import { courseLogPath } from '../../config/logPaths';
import { FetchAllCoursesService } from '../../services/course/FetchAllCoursesService';

export class FetchAllCoursesController {
	private fetchAllCoursesService: FetchAllCoursesService;
	private logger: Logger;

	constructor(fetchAllCoursesService) {
		this.fetchAllCoursesService = fetchAllCoursesService;
		this.logger = new Logger('FetchAllCoursesController', courseLogPath);
		this.fetchAllCourses = this.fetchAllCourses.bind(this);
	}
	async fetchAllCourses(req, res) {
		try {
			const courses = await this.fetchAllCoursesService.execute();
			this.logger.info('Courses Fetched', req.body.requestEmail);
			console.log(courses);
			return res.status(201).json({
				courses: courses,
				msg: 'Cursos Retornados com Sucesso',
			});
		} catch (error) {
			this.logger.error('Error on FetchAllCourses', req.requestEmail, error);
			return res.status(500).json({
				courses: null,
				msg: 'Erro ao Buscar Cursos',
			});
		}
	}
}
