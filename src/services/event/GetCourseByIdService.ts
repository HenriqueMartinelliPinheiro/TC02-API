import { Event } from '@prisma/client';
import { IEventRepository } from '../../repository/interfaces/IEventRepository';

export class GetEventByIdService {
	private eventRepository: IEventRepository;

	constructor(repository: IEventRepository) {
		this.eventRepository = repository;
	}

	async execute(eventId: number): Promise<Event | undefined> {
		try {
			const event = await this.eventRepository.fetchEventById(eventId);
			return event;
		} catch (error) {
			throw error;
		}
	}
}
