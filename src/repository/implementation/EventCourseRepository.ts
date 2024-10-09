import { CourseDomain } from '../../domain/CourseDomain';
import { EventCourse, PrismaClient } from '@prisma/client';
import { IEventCourseRepository } from '../interfaces/IEventCourseRepository';

export class EventCourseRepository implements IEventCourseRepository {
	private prismaClient: PrismaClient;

	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}

	createEventCourse = async (eventId: number, courseId: number): Promise<EventCourse> => {
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

	findEventCourse = async (
		eventId: number,
		courseId: number
	): Promise<EventCourse | null> => {
		try {
			const eventCourse = await this.prismaClient.eventCourse.findFirst({
				where: {
					eventId: eventId,
					courseId: courseId,
				},
			});

			return eventCourse;
		} catch (error) {
			throw new Error('Erro ao buscar o curso associado ao evento');
		}
	};
}
