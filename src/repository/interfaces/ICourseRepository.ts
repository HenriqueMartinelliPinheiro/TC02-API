import { CourseDomain } from '../../domain/CourseDomain';
import { Course } from '@prisma/client';

export interface ICourseRepository {
	createCourse(course: CourseDomain): Promise<Course | undefined>;
	fetchAllCourses(): Promise<Course[] | undefined>;
	getCourseById(courseId: number): Promise<Course | null>;
	editCourse(course: CourseDomain): Promise<Course | undefined>;
}
