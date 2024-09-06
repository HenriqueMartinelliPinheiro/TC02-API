// import { GetCourseByIdService } from '../../services/course/GetCourseByIdService';
// import { isValidRequest } from '../../utils/validations/isValidRequest';
// import { getCourseByIdTypes } from '../../@types/course/getCourseByIdTypes';
// import { Logger } from '../../loggers/Logger';
// import { courseLogPath } from '../../config/logPaths';
// import { AppError } from '../../utils/errors/AppError';

// export class GetCourseByIdController {
// 	private getCourseByIdService: GetCourseByIdService;
// 	private logger: Logger;

// 	constructor(service: GetCourseByIdService) {
// 		this.getCourseByIdService = service;
// 		this.logger = new Logger('GetCourseByIdController', courseLogPath);
// 		this.getCourseById = this.getCourseById.bind(this);
// 	}

// 	async getCourseById(req, res) {
// 		try {
// 			const courseId = parseInt(req.params.courseId);
// 			const error = isValidRequest({ courseId }, getCourseByIdTypes);
// 			if (typeof error === 'string') {
// 				this.logger.warn(error, req.requestEmail);
// 				return res.status(400).json({
// 					course: undefined,
// 					msg: error,
// 				});
// 			}

// 			const course = await this.getCourseByIdService.execute(courseId);

// 			if (!course) {
// 				this.logger.info('Curso não encontrado', req.requestEmail);
// 				return res.status(404).json({
// 					course: undefined,
// 					msg: 'Curso não encontrado',
// 				});
// 			}

// 			this.logger.info(`Curso retornado com sucesso, ID ${courseId}`, req.requestEmail);

// 			return res.status(200).json({
// 				course: course,
// 				msg: 'Curso retornado com sucesso',
// 			});
// 		} catch (error) {
// 			if (error instanceof AppError) {
// 				this.logger.error(error.message, req.requestEmail);
// 				return res.status(error.statusCode).json({
// 					course: undefined,
// 					msg: error.message,
// 				});
// 			}
// 			this.logger.error(
// 				`Erro ao retornar curso, ID: ${req.params.courseId}`,
// 				req.requestEmail,
// 				error
// 			);
// 			return res.status(500).json({
// 				course: undefined,
// 				msg: 'Erro ao buscar curso',
// 			});
// 		}
// 	}
// }
