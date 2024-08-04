import { isValidEmail } from '../../utils/validations/isValidEmail';
import { isValidRequest } from '../../utils/validations/isValidRequest';
import { createCourseTypes } from '../../@types/course/createCourseTypes';
import { CreateCourseService } from '../../services/course/CreateCourseService';
import { CourseDomain } from '../../domain/CourseDomain';
import { Logger } from '../../loggers/Logger';
import { courseLogPath } from '../../config/logPaths';

export class CreateCourseController {
	private createCourseService: CreateCourseService;
	private logger: Logger;

	constructor(createCourseService) {
		this.createCourseService = createCourseService;
		this.logger = new Logger('CreateCourseController', courseLogPath);
		this.createCourse = this.createCourse.bind(this);
	}
	async createCourse(req, res) {
		try {
			if (!isValidRequest(req.body, createCourseTypes)) {
				this.logger.warn('Invalid data on request', req.body.requestEmail);
				return res.status(400).json({
					course: undefined,
					msg: 'Dados Inválidos',
				});
			}

			if (!isValidEmail(req.body.courseCoordinatorEmail)) {
				this.logger.warn('Invalid coordinator Email on request', req.body.requestEmail);
				return res.status(400).json({
					course: undefined,
					msg: 'Email Inválido',
				});
			}
			const course = new CourseDomain({
				courseName: req.body.courseName,
				courseCoordinatorEmail: req.body.courseCoordinatorEmail,
			});

			const createdCourse = await this.createCourseService.execute(course);
			if (createdCourse) {
				this.logger.info(`Course Created ${createdCourse}`, req.body.requestEmail);
				return res.status(201).json({
					course: createdCourse,
					msg: 'Curso criado com sucesso',
				});
			}
		} catch (error) {
			this.logger.error('Error on creating course', req.requestEmail, error);
			return res.status(400).json({
				course: undefined,
				msg: 'Erro ao criar curso',
			});
		}
	}
}
