// import { CourseDomain } from '../../domain/CourseDomain';
// import { ICourseRepository } from '../interfaces/ICourseRepository';
// import { Course, Prisma, PrismaClient } from '@prisma/client';

// export class CourseRepository implements ICourseRepository {
// 	private prismaClient: PrismaClient;

// 	constructor(prismaClient: PrismaClient) {
// 		this.prismaClient = prismaClient;
// 	}

// 	createCourse = async (course: CourseDomain): Promise<Course | undefined> => {
// 		try {
// 			const createdCourse = await this.prismaClient.course.create({
// 				data: {
// 					courseName: course.getCourseName(),
// 					courseCoordinatorEmail: course.getCourseCoordinatorEmail(),
// 				},
// 			});

// 			return createdCourse;
// 		} catch (error) {
// 			throw error;
// 		}
// 	};

// 	fetchAllCourses = async (
// 		skip: number,
// 		take: number,
// 		searchTerm: string
// 	): Promise<{ courses: Course[] | undefined; total: number }> => {
// 		try {
// 			const whereClause: Prisma.CourseWhereInput = searchTerm
// 				? {
// 						OR: [
// 							{
// 								courseName: {
// 									contains: searchTerm,
// 									mode: Prisma.QueryMode.insensitive,
// 								},
// 							},
// 							{
// 								courseCoordinatorEmail: {
// 									contains: searchTerm,
// 									mode: Prisma.QueryMode.insensitive,
// 								},
// 							},
// 						],
// 				  }
// 				: {};

// 			const adjustedTake = take === 0 ? undefined : take;

// 			const [courses, total] = await Promise.all([
// 				this.prismaClient.course.findMany({
// 					skip: skip,
// 					take: adjustedTake,
// 					where: whereClause,
// 					orderBy: {
// 						courseName: 'asc',
// 					},
// 				}),
// 				this.prismaClient.course.count({
// 					where: whereClause,
// 				}),
// 			]);

// 			return { courses, total };
// 		} catch (error) {
// 			throw error;
// 		}
// 	};

// 	getCourseById = async (courseId: number): Promise<Course | undefined> => {
// 		try {
// 			const course = await this.prismaClient.course.findFirst({
// 				where: {
// 					courseId: courseId,
// 				},
// 			});
// 			if (!course) {
// 				return undefined;
// 			}
// 			return course;
// 		} catch (error) {
// 			throw error;
// 		}
// 	};

// 	editCourse = async (course: CourseDomain): Promise<Course | undefined> => {
// 		try {
// 			const editedCourse = this.prismaClient.course.update({
// 				data: {
// 					courseCoordinatorEmail: course.getCourseCoordinatorEmail(),
// 					courseName: course.getCourseName(),
// 				},
// 				where: {
// 					courseId: course.getCourseId(),
// 				},
// 			});

// 			return editedCourse;
// 		} catch (error) {
// 			throw error;
// 		}
// 	};
// }
