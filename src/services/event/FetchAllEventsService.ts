import { IEventRepository } from '../../repository/interfaces/IEventRepository';

export class FetchAllEventsService {
	private eventRepository: IEventRepository;

	constructor(repository: IEventRepository) {
		this.eventRepository = repository;
	}

	execute = async (skip: number, take: number, searchTerm: string) => {
		try {
			const { events, total } = await this.eventRepository.fetchAllEvents(
				skip,
				take,
				searchTerm
			);

			return { events, total };
		} catch (error) {
			throw error;
		}
	};
}
