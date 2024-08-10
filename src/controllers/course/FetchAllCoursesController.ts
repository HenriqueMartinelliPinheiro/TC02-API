import { Logger } from '../../loggers/Logger';
import { courseLogPath } from '../../config/logPaths';
import { FetchAllCoursesService } from '../../services/course/FetchAllCoursesService';
import { AppError } from '../../utils/errors/AppError';

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
			this.logger.info('Cursos retornados', req.requestEmail);
			return res.status(201).json({
				courses: courses,
				msg: 'Cursos Retornados com Sucesso',
			});
		} catch (error) {
			if (error instanceof AppError) {
				this.logger.error(error.message, req.requestEmail, error);
				return res.status(error.statusCode).json({
					courses: null,
					msg: error.message,
				});
			}
			this.logger.error('Erro ao Buscar Cursos', req.requestEmail, error);
			return res.status(500).json({
				courses: null,
				msg: 'Erro ao Buscar Cursos',
			});
		}
	}
}
