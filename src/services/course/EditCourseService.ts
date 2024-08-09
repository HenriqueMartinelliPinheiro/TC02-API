import { Course } from '@prisma/client';
import { CourseDomain } from '../../domain/CourseDomain';
import { ICourseRepository } from '../../repository/interfaces/ICourseRepository';
import { AppError } from '../../utils/errors/AppError';

export class EditCourseService {
	private courseRepository: ICourseRepository;

	constructor(repository: ICourseRepository) {
		this.courseRepository = repository;
	}

	async execute(course: CourseDomain): Promise<Course> {
		try {
			const editedCourse = await this.courseRepository.editCourse(course);
			if (!editedCourse) {
				throw new AppError(`Erro ao editar Curso, ID: ${course.getCourseId()}`, 500);
			}
			return editedCourse;
		} catch (error) {
			throw error;
		}
	}
}
