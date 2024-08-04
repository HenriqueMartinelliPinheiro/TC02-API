import { CourseDomain } from '../../domain/CourseDomain';
import { Course } from '@prisma/client';

export interface ICourseRepository {
	//getCourseById(courseId:number) : Promise<CourseDomain | null>;
	createCourse(course: CourseDomain): Promise<CourseDomain>;
	fetchAllCourses(): Promise<Course[] | undefined>;
}
