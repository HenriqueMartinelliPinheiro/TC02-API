// import { Course } from '@prisma/client';
// import { CourseDomain } from '../../domain/CourseDomain';
// import { ICourseRepository } from '../../repository/interfaces/ICourseRepository';
// import { AppError } from '../../utils/errors/AppError';

// export class CreateCourseService {
// 	private courseRepository: ICourseRepository;

// 	constructor(repository: ICourseRepository) {
// 		this.courseRepository = repository;
// 	}

// 	async execute(course: CourseDomain): Promise<Course> {
// 		try {
// 			const createdCourse = await this.courseRepository.createCourse(course);
// 			if (!createdCourse) {
// 				throw new AppError(`Erro ao criar Curso, ID: ${course.getCourseId()}`, 500);
// 			}
// 			return createdCourse;
// 		} catch (error) {
// 			throw error;
// 		}
// 	}
// }
