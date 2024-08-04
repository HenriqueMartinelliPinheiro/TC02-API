import { CourseDomain } from '../../domain/CourseDomain';
import { ICourseRepository } from '../interfaces/ICourseRepository';
import { Course, PrismaClient } from '@prisma/client';

export class CourseRepository implements ICourseRepository {
	private prismaClient: PrismaClient;

	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}

	createCourse = async (course: CourseDomain): Promise<CourseDomain> => {
		try {
			const createdCourse = await this.prismaClient.course.create({
				data: {
					courseName: course.getCourseName(),
					courseCoordinatorEmail: course.getCourseCoordinatorEmail(),
				},
			});

			return new CourseDomain({
				courseId: createdCourse.courseId,
				courseName: createdCourse.courseName,
				courseCoordinatorEmail: createdCourse.courseCoordinatorEmail,
			});
		} catch (error) {
			throw error;
		}
	};

	fetchAllCourses = async (): Promise<Course[] | undefined> => {
		try {
			const courses = await this.prismaClient.course.findMany();

			if (courses.length === 0) {
				return undefined;
			}

			return courses;
		} catch (error) {
			throw error;
		}
	};
}
