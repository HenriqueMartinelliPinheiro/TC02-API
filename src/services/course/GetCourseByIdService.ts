// import { Course } from '@prisma/client';
// import { ICourseRepository } from '../../repository/interfaces/ICourseRepository';

// export class GetCourseByIdService {
// 	private courseRepository: ICourseRepository;

// 	constructor(courseRepository: ICourseRepository) {
// 		this.courseRepository = courseRepository;
// 	}

// 	async execute(courseId: number): Promise<Course | undefined> {
// 		try {
// 			const course = await this.courseRepository.getCourseById(courseId);
// 			return course;
// 		} catch (error) {
// 			throw error;
// 		}
// 	}
// }
