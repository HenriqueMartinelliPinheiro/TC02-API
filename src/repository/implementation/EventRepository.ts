import { IEventRepository } from '../interfaces/IEventRepository';
import { Event, EventStatus, PrismaClient } from '@prisma/client';
import { EventDomain } from '../../domain/EventDomain';

export class EventRepository implements IEventRepository {
	private prismaClient: PrismaClient;

	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}

	createEvent = async (
		event: EventDomain,
		courses: [number]
	): Promise<Event | undefined> => {
		try {
			const result = await this.prismaClient.$transaction(async (prismaClient) => {
				const createdEvent = await this.prismaClient.event.create({
					data: {
						eventTitle: event.getEventTitle(),
						eventEndDate: event.getEventEndDate(),
						eventStartDate: event.getEventStartDate(),
						eventStatus: this.getEventStatusFromString(event.getEventStatus()),
						eventActivity: {
							create: event.getEventActivities().map((activity) => ({
								eventActivityStartDate: activity.getEventActivityStartDate(),
								eventActivityEndDate: activity.getEventActivityEndDate(),
								eventActivityDescription: activity.getEventActivityDescription(),
							})),
						},
						eventCourse: {
							create: courses.map((course) => ({
								courseId: course,
								eventId: createdEvent.eventId,
							})),
						},
					},
					include: {
						eventActivity: true,
						eventCourse: {
							include: {
								course: true,
							},
						},
					},
				});
				return createdEvent;
			});

			return result;
		} catch (error) {
			throw error;
		}
	};

	private getEventStatusFromString(status: string): EventStatus {
		switch (status) {
			case 'Não Iniciado':
				return EventStatus.NAO_INICIADO;
			case 'Em Andamento':
				return EventStatus.EM_ANDAMENTO;
			case 'Encerrado':
				return EventStatus.ENCERRADO;
			case 'Cancelado':
				return EventStatus.CANCELADO;
			default:
				throw new Error(`Status inválido: ${status}`);
		}
	}
}
