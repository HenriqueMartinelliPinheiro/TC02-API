import { EventDomain } from '../../domain/EventDomain';
import { CourseDomain } from '../../domain/CourseDomain';
import { EventCourse } from '@prisma/client';

export interface IEventCourseRepository {
	createEventCourse(eventId: number, courseId: number): Promise<EventCourse>;
}
