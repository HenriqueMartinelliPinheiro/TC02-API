import Joi from 'joi';
import { GetCourseByIdService } from '../../services/course/GetCourseByIdService';
import { isValidRequest } from '../../utils/validations/isValidRequest';
import { getCourseByIdTypes } from '../../@types/course/getCourseByIdTypes';
import { Logger } from '../../loggers/Logger';
import { courseLogPath } from '../../config/logPaths';

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
				this.logger.warn('Invalid Data on request', req.requestEmail);
				return res.status(400).json({
					course: undefined,
					msg: 'Erro na requisição',
				});
			}

			const course = await this.getCourseByIdService.execute(req.params.courseId);

			if (!course) {
				this.logger.info('No Courses Found', req.requestEmail);
				return res.status(200).json({
					course: course,
					msg: 'Curso não encontrado',
				});
			}

			this.logger.info('Courses returned', req.requestEmail);

			return res.status(200).json({
				course: course,
				msg: 'Curso Retornado com sucesso',
			});
		} catch (error) {
			res.status(401).json({
				course: undefined,
				msg: 'Error on getCourseById',
			});
		}
	}
}
