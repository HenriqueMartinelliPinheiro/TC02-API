import { isValidRequest } from '../../utils/validations/isValidRequest';
import { editCourseTypes } from '../../@types/course/editCourseTypes';
import { EditCourseService } from '../../services/course/EditCourseService';
import { CourseDomain } from '../../domain/CourseDomain';
import { Logger } from '../../loggers/Logger';
import { courseLogPath } from '../../config/logPaths';

export class EditCourseController {
	private editCourseService: EditCourseService;
	private logger: Logger;

	constructor(editCourseService) {
		this.editCourseService = editCourseService;
		this.logger = new Logger('EditCourseController', courseLogPath);
		this.editCourse = this.editCourse.bind(this);
	}
	async editCourse(req, res) {
		try {
			if (!isValidRequest(req.body, editCourseTypes)) {
				this.logger.warn('Invalid data on request', req.requestEmail);
				return res.status(400).json({
					course: undefined,
					msg: 'Dados Inválidos',
				});
			}

			const course = new CourseDomain({
				courseName: req.body.courseName,
				courseCoordinatorEmail: req.body.courseCoordinatorEmail,
				courseId: req.body.courseId,
			});

			const editedCourse = await this.editCourseService.execute(course);
			if (editedCourse) {
				this.logger.info(`Course Edited Id:${editedCourse.courseId}`, req.requestEmail);
				return res.status(201).json({
					course: editedCourse,
					msg: 'Curso editado com sucesso',
				});
			}
		} catch (error) {
			this.logger.error('Error on editing course', req.requestEmail, error);
			return res.status(400).json({
				course: undefined,
				msg: 'Erro ao editar curso',
			});
		}
	}
}
