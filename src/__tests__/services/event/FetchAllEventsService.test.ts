import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IEventRepository } from '../../../repository/interfaces/IEventRepository';
import { FetchAllEventsService } from '../../../services/event/FetchAllEventsService';

describe('FetchAllEventsService', () => {
	let fetchAllEventsService: FetchAllEventsService;
	let eventRepository: IEventRepository;

	beforeEach(() => {
		eventRepository = {
			fetchAllEvents: vi.fn(),
		} as unknown as IEventRepository;

		fetchAllEventsService = new FetchAllEventsService(eventRepository);
	});

	it('should fetch events with pagination and search term', async () => {
		const mockEvents = [
			{ eventId: 1, eventTitle: 'Event 1' },
			{ eventId: 2, eventTitle: 'Event 2' },
		];
		const mockTotal = 2;

		(eventRepository.fetchAllEvents as any).mockResolvedValue({
			events: mockEvents,
			total: mockTotal,
		});

		const skip = 0;
		const take = 10;
		const searchTerm = 'test';

		const result = await fetchAllEventsService.execute(skip, take, searchTerm);

		expect(eventRepository.fetchAllEvents).toHaveBeenCalledWith(skip, take, searchTerm);
		expect(result).toEqual({
			events: mockEvents,
			total: mockTotal,
		});
	});

	it('should throw an error if the repository fetch fails', async () => {
		const mockError = new Error('Failed to fetch events');

		(eventRepository.fetchAllEvents as any).mockRejectedValue(mockError);

		const skip = 0;
		const take = 10;
		const searchTerm = 'test';

		await expect(fetchAllEventsService.execute(skip, take, searchTerm)).rejects.toThrow(
			'Failed to fetch events'
		);

		expect(eventRepository.fetchAllEvents).toHaveBeenCalledWith(skip, take, searchTerm);
	});
});
