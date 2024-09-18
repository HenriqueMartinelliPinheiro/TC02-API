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
		let updatedEvent;
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
				throw new AppError('Evento já está em andamento', 400);
			}

			if (!event.getEventLocation()) {
				updatedEvent = await this.eventRepository.editEvent(event, courses);
			} else {
				updatedEvent = await this.eventRepository.editEventWithLocation(event, courses);
			}

			if (!updatedEvent) {
				throw new AppError('Erro ao Atualizar Evento', 500);
			}
			return updatedEvent;
		} catch (error) {
			throw error;
		}
	}
}
