import { IEventRepository } from '../../repository/interfaces/IEventRepository';
import { EventDomain } from '../../domain/EventDomain';
import { Event, EventCourse, EventStatus } from '@prisma/client';
import { AppError } from '../../utils/errors/AppError';
import { EventCourseDomain } from '../../domain/EventCourseDomain';

export class EditEventService {
	private eventRepository: IEventRepository;

	constructor(repository: IEventRepository) {
		this.eventRepository = repository;
	}

	async execute(event: EventDomain, courses: EventCourseDomain[]): Promise<Event> {
		try {
			if (event.getEventEndDate() < new Date()) {
				throw new AppError('Data Final do Evento menor do que Data Atual', 400);
			}

			if (courses.length < 1) {
				throw new AppError('Nenhum Curso Informado', 400);
			}

			const eventInDataBase = await this.eventRepository.fetchEventById(
				event.getEventId()
			);

			if (
				eventInDataBase.eventStatus === EventStatus.CANCELADO ||
				eventInDataBase.eventStatus === EventStatus.ENCERRADO
			) {
				throw new AppError('Evento Encerrado ou Cancelado não pode ser editado', 400);
			}

			if (
				eventInDataBase.eventStatus === EventStatus.EM_ANDAMENTO &&
				event.getEventStatus() === 'Nao Iniciado'
			) {
				throw new AppError(
					'Não é permitido alterar o status de Em Andamento para Não Iniciado',
					400
				);
			}

			if (
				eventInDataBase.eventStatus === EventStatus.EM_ANDAMENTO &&
				(event.getEventStatus() === 'Encerrado' || event.getEventStatus() === 'Cancelado')
			) {
				event.setEventStatus(event.getEventStatus());
			}

			await this.eventRepository.updateEvent(event);

			await this.eventRepository.updateEventLocation(event);

			await this.eventRepository.updateEventCourses(event, courses);

			const existingActivities = await this.eventRepository.getEventActivitiesByEventId(
				event.getEventId()
			);

			const activitiesToUpdate = [];
			const activitiesToAdd = [];
			const activitiesToRemove = [];

			for (const activity of event.getEventActivities()) {
				const existingActivity = existingActivities.find(
					(a) => a.eventActivityTitle === activity.getEventActivityTitle()
				);

				if (existingActivity) {
					if (
						existingActivity.eventActivityStartDate.getTime() !==
							activity.getEventActivityStartDate().getTime() ||
						existingActivity.eventActivityEndDate.getTime() !==
							activity.getEventActivityEndDate().getTime() ||
						existingActivity.eventActivityDescription !==
							activity.getEventActivityDescription()
					) {
						activitiesToUpdate.push(activity);
					}
				} else {
					activitiesToAdd.push(activity);
				}
			}

			for (const existingActivity of existingActivities) {
				const activityStillExists = event
					.getEventActivities()
					.some(
						(activity) =>
							activity.getEventActivityTitle() === existingActivity.eventActivityTitle
					);

				if (!activityStillExists) {
					if (!(await this.hasAttendanceRecords(existingActivity.eventActivityId))) {
						activitiesToRemove.push(existingActivity);
					}
				}
			}

			for (const activity of activitiesToRemove) {
				await this.eventRepository.removeEventActivity(activity.eventActivityId);
			}

			for (const activity of activitiesToUpdate) {
				await this.eventRepository.updateEventActivity(activity, event.getEventId());
			}

			for (const activity of activitiesToAdd) {
				await this.eventRepository.addEventActivity(activity, event.getEventId());
			}

			const updatedEvent = await this.eventRepository.fetchEventById(event.getEventId());

			return updatedEvent;
		} catch (error) {
			throw error;
		}
	}

	async hasAttendanceRecords(activityId: number): Promise<boolean> {
		try {
			const attendanceRecords =
				await this.eventRepository.getAttendanceRecordsByActivityId(activityId);
			const hasRecords = attendanceRecords.length > 0;
			return hasRecords;
		} catch (error) {
			throw error;
		}
	}
}
