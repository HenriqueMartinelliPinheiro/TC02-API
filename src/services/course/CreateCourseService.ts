import { Course } from '@prisma/client';
import { CourseDomain } from '../../domain/CourseDomain';
import { ICourseRepository } from '../../repository/interfaces/ICourseRepository';

export class CreateCourseService {
	private courseRepository: ICourseRepository;

	constructor(repository: ICourseRepository) {
		this.courseRepository = repository;
	}

	async execute(course: CourseDomain): Promise<Course> {
		try {
			const createdCourse = await this.courseRepository.createCourse(course);
			if (!createdCourse) {
				throw new Error('Error on creating Course');
			}
			return createdCourse;
		} catch (error) {
			throw error;
		}
	}
}
