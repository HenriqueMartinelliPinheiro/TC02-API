import Joi from 'joi';
import { GetCourseByIdService } from '../../services/course/GetCourseByIdService';
import { isValidRequest } from '../../utils/validations/isValidRequest';
import { getCourseByIdTypes } from '../../@types/course/getCourseByIdTypes';
import { Logger } from '../../loggers/Logger';
import { courseLogPath } from '../../config/logPaths';
import { AppError } from '../../utils/errors/AppError';

export class GetCourseByIdController {
	private getCourseByIdService: GetCourseByIdService;
	private logger: Logger;

	constructor(service: GetCourseByIdService) {
		this.getCourseByIdService = service;
		this.logger = new Logger('GetCourseByIdController', courseLogPath);
	}

	async getCourseById(req, res) {
		try {
			if (!isValidRequest(req.params, getCourseByIdTypes)) {
				this.logger.warn('Dados inválidos na requisição', req.requestEmail);
				return res.status(400).json({
					course: undefined,
					msg: 'Erro na requisição',
				});
			}

			const course = await this.getCourseByIdService.execute(req.params.courseId);

			if (!course) {
				this.logger.info('Sem cursos encontrados', req.requestEmail);
				return res.status(404).json({
					course: course,
					msg: 'Curso não encontrado',
				});
			}

			this.logger.info(
				`Curso retornado com sucesso, ID ${req.params.courseId}`,
				req.requestEmail
			);

			return res.status(200).json({
				course: course,
				msg: 'Curso retornado com sucesso',
			});
		} catch (error) {
			if (error instanceof AppError) {
				this.logger.error(error.message, req.requestEmail);
				res.status(error.statusCode).json({
					course: undefined,
					msg: 'Erro ao buscar curso',
				});
			}
			this.logger.error(
				`Erro ao retornar curso, ID: ${req.params.courseId}`,
				req.requestEmail
			);
			res.status(401).json({
				course: undefined,
				msg: 'Erro ao buscar curso',
			});
		}
	}
}
