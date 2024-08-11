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
			const { skip = 0, take = 0, searchTerm = '' } = req.query;

			const { courses, total } = await this.fetchAllCoursesService.execute(
				Number(skip),
				Number(take),
				searchTerm,
			);

			this.logger.info('Cursos retornados', req.requestEmail);
			return res.status(201).json({
				total: total,
				courses: courses,
				msg: 'Cursos Retornados com Sucesso',
			});
		} catch (error) {
			if (error instanceof AppError) {
				this.logger.error(error.message, req.requestEmail, error);
				return res.status(error.statusCode).json({
					total: 0,
					courses: null,
					msg: error.message,
				});
			}
			this.logger.error('Erro ao Buscar Cursos', req.requestEmail, error);
			return res.status(500).json({
				courses: null,
				total: 0,
				msg: 'Erro ao Buscar Cursos',
			});
		}
	}
}
