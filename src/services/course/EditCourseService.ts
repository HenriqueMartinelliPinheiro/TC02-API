import { Course } from '@prisma/client';
import { CourseDomain } from '../../domain/CourseDomain';
import { ICourseRepository } from '../../repository/interfaces/ICourseRepository';

export class EditCourseService {
	private courseRepository: ICourseRepository;

	constructor(repository: ICourseRepository) {
		this.courseRepository = repository;
	}

	async execute(course: CourseDomain): Promise<Course> {
		try {
			const editedCourse = await this.courseRepository.editCourse(course);
			if (!editedCourse) {
				throw new Error('Error on edit Course');
			}
			return editedCourse;
		} catch (error) {
			throw error;
		}
	}
}
