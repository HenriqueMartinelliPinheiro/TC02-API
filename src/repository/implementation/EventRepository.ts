import { IEventRepository } from '../interfaces/IEventRepository';
import { Event, EventCourse, EventStatus, Prisma, PrismaClient } from '@prisma/client';
import { EventDomain } from '../../domain/EventDomain';
import { EventCourseDomain } from '../../domain/EventCourseDomain';
import { EventActivityDomain } from '../../domain/EventActivityDomain';

export class EventRepository implements IEventRepository {
	private prismaClient: PrismaClient;

	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}

	createEvent = async (
		event: EventDomain,
		courses: EventCourseDomain[]
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
						courseId: course.getCourseId(),
						courseName: course.getCourseName(),
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
		courses: EventCourseDomain[]
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
						courseId: course.getCourseId(),
						courseName: course.getCourseName(),
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

	fetchEventById = async (
		eventId: number
	): Promise<Prisma.EventGetPayload<{
		include: { eventActivity: true; eventCourse: true; eventLocation: true };
	}> | null> => {
		try {
			const event = await this.prismaClient.event.findUnique({
				where: { eventId: eventId },
				include: {
					eventActivity: true,
					eventCourse: true,
					eventLocation: true,
				},
			});

			if (!event) {
				throw new Error('Evento não encontrado');
			}

			return event;
		} catch (error) {
			throw error;
		}
	};

	getEventActivitiesByEventId = async (eventId: number) => {
		return await this.prismaClient.eventActivity.findMany({
			where: {
				eventId: eventId,
			},
		});
	};

	removeEventActivity = async (activityId: number) => {
		return await this.prismaClient.eventActivity.delete({
			where: {
				eventActivityId: activityId,
			},
		});
	};

	updateEventActivity = async (activity: EventActivityDomain, eventId: number) => {
		const existingActivity = await this.prismaClient.eventActivity.findMany({
			where: {
				eventActivityTitle: activity.getEventActivityTitle(),
				eventId: eventId,
			},
		});

		if (existingActivity.length === 0) {
			throw new Error(
				`Atividade com título "${activity.getEventActivityTitle()}" não encontrada no evento ${eventId}.`
			);
		}

		const activityToUpdate = existingActivity[0];

		return await this.prismaClient.eventActivity.update({
			where: {
				eventActivityId: activityToUpdate.eventActivityId,
			},
			data: {
				eventActivityTitle: activity.getEventActivityTitle(),
				eventActivityStartDate: activity.getEventActivityStartDate(),
				eventActivityEndDate: activity.getEventActivityEndDate(),
				eventActivityDescription: activity.getEventActivityDescription(),
			},
		});
	};

	addEventActivity = async (activity: EventActivityDomain, eventId: number) => {
		return await this.prismaClient.eventActivity.create({
			data: {
				eventActivityTitle: activity.getEventActivityTitle(),
				eventActivityStartDate: activity.getEventActivityStartDate(),
				eventActivityEndDate: activity.getEventActivityEndDate(),
				eventActivityDescription: activity.getEventActivityDescription(),
				eventId: eventId,
			},
		});
	};

	getAttendanceRecordsByActivityId = async (activityId: number) => {
		return await this.prismaClient.attendance.findMany({
			where: {
				eventActivityId: activityId,
			},
		});
	};

	fetchAllEvents = async (
		skip: number,
		take: number,
		searchTerm: string
	): Promise<{ events: EventDomain[] | undefined; total: number }> => {
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
						eventCourse: true,
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
}
