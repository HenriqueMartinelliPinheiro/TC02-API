import { IEventRepository } from '../interfaces/IEventRepository';
import { Event, EventStatus, Prisma, PrismaClient } from '@prisma/client';
import { EventDomain } from '../../domain/EventDomain';

export class EventRepository implements IEventRepository {
	private prismaClient: PrismaClient;

	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}

	createEvent = async (
		event: EventDomain,
		courses: number[]
	): Promise<Event | undefined> => {
		try {
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
		} catch (error) {
			throw error;
		}
	};

	createEventWithLocation = async (
		event: EventDomain,
		courses: number[]
	): Promise<Event | undefined> => {
		try {
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

				await prismaClient.eventLocation.create({
					data: {
						latitude: event.getEventLocation().getLatitude(),
						longitude: event.getEventLocation().getLongitude(),
						radius: event.getEventLocation().getRadius(),
						eventId: createdEvent.eventId,
					},
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
		} catch (error) {
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

	fetchAllEvents = async (
		skip: number,
		take: number,
		searchTerm: string
	): Promise<{ events: Event[] | undefined; total: number }> => {
		try {
			const whereClause: Prisma.EventWhereInput = searchTerm
				? {
						OR: [
							{
								eventTitle: {
									contains: searchTerm,
									mode: Prisma.QueryMode.insensitive,
								},
							},
						],
				  }
				: {};

			const adjustedTake = take === 0 ? undefined : take;

			const [events, total] = await Promise.all([
				this.prismaClient.event.findMany({
					skip: skip,
					take: adjustedTake,
					where: whereClause,
					orderBy: {
						eventTitle: 'asc',
					},
				}),
				this.prismaClient.event.count({
					where: whereClause,
				}),
			]);

			return { events, total };
		} catch (error) {
			throw error;
		}
	};
}
