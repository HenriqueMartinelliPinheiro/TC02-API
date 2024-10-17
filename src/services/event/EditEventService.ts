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
			console.log(`Iniciando edição do evento ID: ${event.getEventId()}`);

			if (event.getEventEndDate() < new Date()) {
				throw new AppError('Data Final do Evento menor do que Data Atual', 400);
			}

			if (courses.length < 1) {
				throw new AppError('Nenhum Curso Informado', 400);
			}

			const eventInDataBase = await this.eventRepository.fetchEventById(
				event.getEventId()
			);
			console.log(`Evento encontrado: ${eventInDataBase.eventId}`);

			if (
				eventInDataBase.eventStatus === EventStatus.CANCELADO ||
				eventInDataBase.eventStatus === EventStatus.ENCERRADO
			) {
				throw new AppError('Evento Encerrado ou Cancelado não pode ser editado', 400);
			}

			const existingActivities = await this.eventRepository.getEventActivitiesByEventId(
				event.getEventId()
			);
			console.log(`Atividades existentes encontradas: ${existingActivities.length}`);

			const activitiesToUpdate = [];
			const activitiesToAdd = [];
			const activitiesToRemove = [];

			for (const activity of event.getEventActivities()) {
				const existingActivity = existingActivities.find(
					(a) => a.eventActivityTitle === activity.getEventActivityTitle()
				);

				if (existingActivity) {
					console.log(
						`Atividade encontrada para o título "${activity.getEventActivityTitle()}"`
					);

					if (
						existingActivity.eventActivityStartDate.getTime() !==
							activity.getEventActivityStartDate().getTime() ||
						existingActivity.eventActivityEndDate.getTime() !==
							activity.getEventActivityEndDate().getTime() ||
						existingActivity.eventActivityDescription !==
							activity.getEventActivityDescription()
					) {
						activitiesToUpdate.push(activity);
						console.log(
							`Atividade "${activity.getEventActivityTitle()}" será atualizada`
						);
					} else {
						console.log(
							`Nenhuma alteração detectada para a atividade "${activity.getEventActivityTitle()}"`
						);
					}
				} else {
					activitiesToAdd.push(activity);
					console.log(`Atividade "${activity.getEventActivityTitle()}" será adicionada`);
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
						console.log(
							`Atividade "${existingActivity.eventActivityTitle}" será removida`
						);
					} else {
						console.log(
							`Atividade "${existingActivity.eventActivityTitle}" não será removida pois possui presenças registradas`
						);
					}
				}
			}

			for (const activity of activitiesToRemove) {
				await this.eventRepository.removeEventActivity(activity.eventActivityId);
				console.log(`Atividade "${activity.eventActivityTitle}" removida com sucesso`);
			}

			for (const activity of activitiesToUpdate) {
				await this.eventRepository.updateEventActivity(activity, event.getEventId());
				console.log(
					`Atividade "${activity.getEventActivityTitle()}" atualizada com sucesso`
				);
			}

			for (const activity of activitiesToAdd) {
				await this.eventRepository.addEventActivity(activity, event.getEventId());
				console.log(
					`Atividade "${activity.getEventActivityTitle()}" adicionada com sucesso`
				);
			}

			const updatedEvent = await this.eventRepository.fetchEventById(event.getEventId());
			console.log(`Edição do evento ID: ${event.getEventId()} concluída`);

			return updatedEvent;
		} catch (error) {
			console.error(`Erro ao editar evento: ${error.message}`);
			throw error;
		}
	}

	async hasAttendanceRecords(activityId: number): Promise<boolean> {
		const attendanceRecords = await this.eventRepository.getAttendanceRecordsByActivityId(
			activityId
		);
		return attendanceRecords.length > 0;
	}
}
