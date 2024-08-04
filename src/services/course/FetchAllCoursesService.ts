import { Course } from '@prisma/client';
import { ICourseRepository } from '../../repository/interfaces/ICourseRepository';

export class FetchAllCoursesService {
	private courseRepository: ICourseRepository;

	constructor(repository: ICourseRepository) {
		this.courseRepository = repository;
	}

	execute = async (): Promise<Course[] | undefined> => {
		try {
			const courses = await this.courseRepository.fetchAllCourses();
			if (!courses) {
				return undefined;
			}
			return courses;
		} catch (error) {
			throw error;
		}
	};
}
