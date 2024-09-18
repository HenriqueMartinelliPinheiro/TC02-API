import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IEventRepository } from '../../../repository/interfaces/IEventRepository';
import { GetEventByIdService } from '../../../services/event/GetEventByIdService';
import { Event, EventStatus } from '@prisma/client';

describe('GetEventByIdService', () => {
	let getEventByIdService: GetEventByIdService;
	let eventRepository: IEventRepository;

	beforeEach(() => {
		eventRepository = {
			fetchEventById: vi.fn(),
		} as unknown as IEventRepository;

		getEventByIdService = new GetEventByIdService(eventRepository);
	});

	it('should return an event if it exists', async () => {
		const mockEvent = {
			eventId: 1,
			eventTitle: 'Test Event',
			eventStatus: EventStatus.NAO_INICIADO,
			eventStartDate: new Date('2024-09-01T00:00:00Z'),
			eventEndDate: new Date('2024-09-10T00:00:00Z'),
			createdAt: new Date(),
			updatedAt: new Date(),
		} as Event;

		(eventRepository.fetchEventById as any).mockResolvedValue(mockEvent);

		const result = await getEventByIdService.execute(1);

		expect(eventRepository.fetchEventById).toHaveBeenCalledWith(1);
		expect(result).toEqual(mockEvent);
	});

	it('should return undefined if the event does not exist', async () => {
		(eventRepository.fetchEventById as any).mockResolvedValue(undefined);

		const result = await getEventByIdService.execute(999);

		expect(eventRepository.fetchEventById).toHaveBeenCalledWith(999);
		expect(result).toBeUndefined();
	});

	it('should throw an error if repository fetch fails', async () => {
		const mockError = new Error('Failed to fetch event');

		(eventRepository.fetchEventById as any).mockRejectedValue(mockError);

		await expect(getEventByIdService.execute(1)).rejects.toThrow('Failed to fetch event');
		expect(eventRepository.fetchEventById).toHaveBeenCalledWith(1);
	});
});
