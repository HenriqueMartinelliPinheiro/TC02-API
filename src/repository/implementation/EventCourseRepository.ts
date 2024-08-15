import { CourseDomain } from '../../domain/CourseDomain';
import { EventCourse, PrismaClient } from '@prisma/client';
import { IEventCourseRepository } from '../interfaces/IEventCourseRepository';

export class EventCourseRepository implements IEventCourseRepository {
	private prismaClient: PrismaClient;

	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}

	createEventCourse = async (
		eventId: number,
		courseId: number
	): Promise<EventCourse> => {
		try {
			const createdEventCourse = await this.prismaClient.eventCourse.create({
				data: {
					eventId: eventId,
					courseId: courseId,
				},
			});

			return createdEventCourse;
		} catch (error) {
			throw error;
		}
	};
}
