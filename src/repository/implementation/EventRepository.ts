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

	updateEvent = async (eventDomain: EventDomain): Promise<Event | null> => {
		try {
			console.log(
				'Status do evento antes de atualizar no banco:',
				eventDomain.getEventStatus()
			);

			const statusUpperCase = eventDomain
				.getEventStatus()
				.replace(/\s+/g, '_')
				.toUpperCase();
			const eventStatus = EventStatus[statusUpperCase as keyof typeof EventStatus];

			console.log('Status do evento após conversão:', eventStatus);

			const updatedEvent = await this.prismaClient.event.update({
				where: {
					eventId: eventDomain.getEventId(),
				},
				data: {
					eventTitle: eventDomain.getEventTitle(),
					eventStartDate: eventDomain.getEventStartDate(),
					eventEndDate: eventDomain.getEventEndDate(),
					eventStatus: eventStatus,
				},
			});

			console.log('Evento atualizado com sucesso:', updatedEvent);
			return updatedEvent;
		} catch (error) {
			console.error('Erro ao atualizar evento:', error);
			throw error;
		}
	};

	async updateEventLocation(eventDomain: EventDomain): Promise<void> {
		const eventId = eventDomain.getEventId();

		if (!eventId) {
			throw new Error('ID do evento não fornecido');
		}

		try {
			const existingLocation = await this.prismaClient.eventLocation.findUnique({
				where: {
					eventId: eventId,
				},
			});

			const newLocation = eventDomain.getEventLocation();

			if (existingLocation) {
				if (
					newLocation &&
					newLocation.getLatitude() !== 0 &&
					newLocation.getLongitude() !== 0 &&
					newLocation.getRadius() !== 0
				) {
					await this.prismaClient.eventLocation.update({
						where: {
							eventId: eventId,
						},
						data: {
							latitude: newLocation.getLatitude(),
							longitude: newLocation.getLongitude(),
							radius: newLocation.getRadius(),
						},
					});
				} else {
					await this.prismaClient.eventLocation.delete({
						where: {
							eventId: eventId,
						},
					});
				}
			} else if (
				newLocation &&
				newLocation.getLatitude() !== 0 &&
				newLocation.getLongitude() !== 0 &&
				newLocation.getRadius() !== 0
			) {
				await this.prismaClient.eventLocation.create({
					data: {
						latitude: newLocation.getLatitude(),
						longitude: newLocation.getLongitude(),
						radius: newLocation.getRadius(),
						eventId: eventId,
					},
				});
			}
		} catch (error) {
			throw error;
		}
	}

	async updateEventCourses(
		eventDomain: EventDomain,
		courses: EventCourseDomain[]
	): Promise<void> {
		const eventId = eventDomain.getEventId();

		if (!eventId) {
			throw new Error('ID do evento não fornecido');
		}

		try {
			const existingCourses = await this.prismaClient.eventCourse.findMany({
				where: {
					eventId: eventId,
				},
			});

			const coursesToAdd: EventCourseDomain[] = [];
			const coursesToRemove: number[] = [];

			for (const course of courses) {
				const existingCourse = existingCourses.find(
					(ec) => ec.courseId === course.getCourseId()
				);

				if (!existingCourse) {
					coursesToAdd.push(course);
				}
			}

			for (const existingCourse of existingCourses) {
				const courseStillExists = courses.some(
					(course) => course.getCourseId() === existingCourse.courseId
				);

				if (!courseStillExists) {
					coursesToRemove.push(existingCourse.eventCourseId);
				}
			}

			for (const courseId of coursesToRemove) {
				await this.prismaClient.eventCourse.delete({
					where: {
						eventCourseId: courseId,
					},
				});
			}

			for (const course of coursesToAdd) {
				await this.prismaClient.eventCourse.create({
					data: {
						courseId: course.getCourseId(),
						courseName: course.getCourseName(),
						eventId: eventId,
					},
				});
			}
		} catch (error) {
			throw error;
		}
	}
}
