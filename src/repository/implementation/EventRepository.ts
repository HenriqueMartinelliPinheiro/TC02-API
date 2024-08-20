import { IEventRepository } from '../interfaces/IEventRepository';
import { Event, EventStatus, PrismaClient } from '@prisma/client';
import { EventDomain } from '../../domain/EventDomain';
import { create } from 'domain';

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
			console.log(event.getEventEndDate());
			const result = await this.prismaClient.$transaction(async (prismaClient) => {
				const createdEvent = await prismaClient.event.create({
					data: {
						eventTitle: event.getEventTitle(),
						eventEndDate: event.getEventEndDate(),
						eventStartDate: event.getEventStartDate(),
						eventStatus: await this.getEventStatusFromString(event.getEventStatus()),
					},
				});

				await prismaClient.eventActivity.createMany({
					data: event.getEventActivities().map((activity) => ({
						eventActivityTitle: activity.getEventActivityTitle(),
						eventActivityStartDate: activity.getEventActivityStartDate(),
						eventActivityEndDate: activity.getEventActivityEndDate(),
						eventActivityDescription: activity.getEventActivityDescription(),
						eventId: createdEvent.eventId,
					})),
				});

				await prismaClient.eventCourse.createMany({
					data: courses.map((course) => ({
						courseId: course,
						eventId: createdEvent.eventId,
					})),
				});
				return createdEvent;
			});
			return await this.fetchEventById(result.eventId);

			return result;
		} catch (error) {
			console.log('Erro', error);
			throw error;
		}
	};

	private async getEventStatusFromString(status: string): Promise<EventStatus> {
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

	fetchEventById = async (eventId: number) => {
		try {
			const event = await this.prismaClient.event.findUnique({
				where: { eventId: eventId },
				include: {
					eventActivity: true,
					eventCourse: {
						include: {
							course: true,
						},
					},
				},
			});

			return event;
		} catch (error) {
			throw error;
		}
	};
}
