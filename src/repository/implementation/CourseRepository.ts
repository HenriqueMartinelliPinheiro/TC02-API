import { CourseDomain } from '../../domain/CourseDomain';
import { ICourseRepository } from '../interfaces/ICourseRepository';
import { Course, PrismaClient } from '@prisma/client';

export class CourseRepository implements ICourseRepository {
	private prismaClient: PrismaClient;

	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}

	createCourse = async (course: CourseDomain): Promise<Course | undefined> => {
		try {
			const createdCourse = await this.prismaClient.course.create({
				data: {
					courseName: course.getCourseName(),
					courseCoordinatorEmail: course.getCourseCoordinatorEmail(),
				},
			});

			return createdCourse;
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

	getCourseById = async (courseId: number): Promise<Course | undefined> => {
		try {
			const course = await this.prismaClient.course.findFirst({
				where: {
					courseId: courseId,
				},
			});
			if (!course) {
				return undefined;
			}
			return course;
		} catch (error) {
			throw error;
		}
	};

	editCourse = async (course: CourseDomain): Promise<Course | undefined> => {
		try {
			const editedCourse = this.prismaClient.course.update({
				data: {
					courseCoordinatorEmail: course.getCourseCoordinatorEmail(),
					courseName: course.getCourseName(),
				},
				where: {
					courseId: course.getCourseId(),
				},
			});

			return editedCourse;
		} catch (error) {
			throw error;
		}
	};
}
