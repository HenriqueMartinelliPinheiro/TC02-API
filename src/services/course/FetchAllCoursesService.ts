import { Course } from '@prisma/client';
import { ICourseRepository } from '../../repository/interfaces/ICourseRepository';

export class FetchAllCoursesService {
	private courseRepository: ICourseRepository;

	constructor(repository: ICourseRepository) {
		this.courseRepository = repository;
	}

	execute = async (
		skip: number,
		take: number,
		searchTerm
	): Promise<{ courses: Course[] | undefined; total: number }> => {
		try {
			const { courses, total } = await this.courseRepository.fetchAllCourses(
				skip,
				take,
				searchTerm
			);

			return { courses, total };
		} catch (error) {
			throw error;
		}
	};
}
