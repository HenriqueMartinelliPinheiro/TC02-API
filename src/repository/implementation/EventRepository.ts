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
						eventStatus: EventStatus.NAO_INICIADO,
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
						eventStatus: EventStatus.NAO_INICIADO,
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

	public static getEventStatusDisplay(status: EventStatus): string {
		switch (status) {
			case EventStatus.NAO_INICIADO:
				return 'Nao Iniciado';
			case EventStatus.EM_ANDAMENTO:
				return 'Em Andamento';
			case EventStatus.ENCERRADO:
				return 'Encerrado';
			case EventStatus.CANCELADO:
				return 'Cancelado';
			default:
				return 'Status desconhecido';
		}
	}

	private async getEventStatusFromString(status: string): Promise<EventStatus> {
		switch (status) {
			case 'Nao Iniciado':
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

	fetchEventById = async (eventId: number): Promise<Event> => {
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
					eventLocation: true,
				},
			});

			if (event) {
				return event;
			}
			throw new Error('Evento não encontrado');
		} catch (error) {
			throw error;
		}
	};

	fetchAllEvents = async (
		skip: number,
		take: number,
		searchTerm: string
	): Promise<{ events: EventDomain[]; total: number }> => {
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
					include: {
						eventActivity: true,
						eventCourse: {
							include: {
								course: true,
							},
						},
						eventLocation: true,
					},
				}),
				this.prismaClient.event.count({
					where: whereClause,
				}),
			]);

			const formattedEvents = events.map((event) => {
				const eventStatusDisplay = EventRepository.getEventStatusDisplay(
					event.eventStatus
				);
				return new EventDomain({
					eventId: event.eventId,
					eventTitle: event.eventTitle,
					eventStatus: eventStatusDisplay,
					eventStartDate: event.eventStartDate,
					eventEndDate: event.eventEndDate,
					createdAt: event.createdAt,
					updatedAt: event.updatedAt,
				});
			});

			return { events: formattedEvents, total };
		} catch (error) {
			throw error;
		}
	};

	editEventWithLocation = async (
		event: EventDomain,
		courses: number[]
	): Promise<Event | undefined> => {
		try {
			const result = await this.prismaClient.$transaction(async (prismaClient) => {
				await prismaClient.event.update({
					where: { eventId: event.getEventId() },
					data: {
						eventTitle: event.getEventTitle(),
						eventEndDate: event.getEventEndDate(),
						eventStartDate: event.getEventStartDate(),
						// Valida se o status é do tipo EventStatus; se for, usa diretamente, senão converte
						eventStatus:
							typeof event.getEventStatus() === 'string'
								? await this.getEventStatusFromString(event.getEventStatus())
								: (event.getEventStatus() as EventStatus),
					},
				});

				await prismaClient.eventActivity.deleteMany({
					where: {
						eventId: event.getEventId(),
					},
				});

				await prismaClient.eventActivity.createMany({
					data: event.getEventActivities().map((activity) => ({
						eventActivityTitle: activity.getEventActivityTitle(),
						eventActivityStartDate: activity.getEventActivityStartDate(),
						eventActivityEndDate: activity.getEventActivityEndDate(),
						eventActivityDescription: activity.getEventActivityDescription(),
						eventId: event.getEventId(),
					})),
				});

				await prismaClient.eventLocation.deleteMany({
					where: {
						eventId: event.getEventId(),
					},
				});

				await prismaClient.eventLocation.create({
					data: {
						latitude: event.getEventLocation().getLatitude(),
						longitude: event.getEventLocation().getLongitude(),
						radius: event.getEventLocation().getRadius(),
						eventId: event.getEventId(),
					},
				});

				await prismaClient.eventCourse.deleteMany({
					where: {
						eventId: event.getEventId(),
					},
				});

				await prismaClient.eventCourse.createMany({
					data: courses.map((course) => ({
						courseId: course,
						eventId: event.getEventId(),
					})),
				});

				return await this.fetchEventById(event.getEventId());
			});

			return result;
		} catch (error) {
			throw error;
		}
	};

	editEvent = async (
		event: EventDomain,
		courses: number[]
	): Promise<Event | undefined> => {
		try {
			const result = await this.prismaClient.$transaction(async (prismaClient) => {
				await prismaClient.event.update({
					where: { eventId: event.getEventId() },
					data: {
						eventTitle: event.getEventTitle(),
						eventEndDate: event.getEventEndDate(),
						eventStartDate: event.getEventStartDate(),
						eventStatus:
							typeof event.getEventStatus() === 'string'
								? await this.getEventStatusFromString(event.getEventStatus())
								: (event.getEventStatus() as EventStatus),
					},
				});

				await prismaClient.eventActivity.deleteMany({
					where: {
						eventId: event.getEventId(),
					},
				});

				await prismaClient.eventActivity.createMany({
					data: event.getEventActivities().map((activity) => ({
						eventActivityTitle: activity.getEventActivityTitle(),
						eventActivityStartDate: activity.getEventActivityStartDate(),
						eventActivityEndDate: activity.getEventActivityEndDate(),
						eventActivityDescription: activity.getEventActivityDescription(),
						eventId: event.getEventId(),
					})),
				});

				await prismaClient.eventCourse.deleteMany({
					where: {
						eventId: event.getEventId(),
					},
				});

				await prismaClient.eventCourse.createMany({
					data: courses.map((course) => ({
						courseId: course,
						eventId: event.getEventId(),
					})),
				});

				return await this.fetchEventById(event.getEventId());
			});

			return result;
		} catch (error) {
			throw error;
		}
	};
}
