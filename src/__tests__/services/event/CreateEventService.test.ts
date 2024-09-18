import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IEventRepository } from '../../../repository/interfaces/IEventRepository';
import { CreateEventService } from '../../../services/event/CreateEventService';
import { EventDomain } from '../../../domain/EventDomain';
import { EventCourseDomain } from '../../../domain/EventCourseDomain';
import { AppError } from '../../../utils/errors/AppError';
import { Event, EventStatus } from '@prisma/client';
import { EventLocationDomain } from '../../../domain/EventLocationDomain';
import { afterEach } from 'node:test';

describe('CreateEventService', () => {
	let createEventService: CreateEventService;
	let eventRepository: IEventRepository;

	const fixedDate = new Date('2024-08-15T00:00:00Z');

	beforeEach(() => {
		eventRepository = {
			createEvent: vi.fn(),
			createEventWithLocation: vi.fn(),
		} as unknown as IEventRepository;

		createEventService = new CreateEventService(eventRepository);

		vi.setSystemTime(fixedDate);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should create an event with location if location is provided', async () => {
		const event = new EventDomain({
			eventTitle: 'Test Event',
			eventStartDate: new Date('2024-09-01T00:00:00Z'),
			eventEndDate: new Date('2024-09-10T00:00:00Z'),
			eventStatus: EventStatus.NAO_INICIADO,
			eventActivities: [],
			eventLocation: new EventLocationDomain({
				latitude: 123.45,
				longitude: 678.9,
				radius: 100,
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
		});

		const courses: EventCourseDomain[] = [
			new EventCourseDomain({ courseId: 1, courseName: 'Course 1' }),
		];

		const createdEvent = {
			eventId: 1,
			eventTitle: 'Test Event',
			eventStatus: EventStatus.NAO_INICIADO,
			eventStartDate: new Date('2024-09-01T00:00:00Z'),
			eventEndDate: new Date('2024-09-10T00:00:00Z'),
			createdAt: new Date(),
			updatedAt: new Date(),
		} as Event;

		(eventRepository.createEventWithLocation as any).mockResolvedValue(createdEvent);

		const result = await createEventService.execute(event, courses);

		expect(eventRepository.createEventWithLocation).toHaveBeenCalledWith(event, courses);
		expect(result).toEqual(createdEvent);
	});

	it('should throw an error if event end date is in the past', async () => {
		const event = new EventDomain({
			eventTitle: 'Test Event',
			eventStartDate: new Date('2024-09-01T00:00:00Z'),
			eventEndDate: new Date('2023-09-10T00:00:00Z'),
			eventStatus: EventStatus.NAO_INICIADO,
			eventActivities: [],
		});

		const courses: EventCourseDomain[] = [
			new EventCourseDomain({ courseId: 1, courseName: 'Course 1' }),
		];

		await expect(createEventService.execute(event, courses)).rejects.toThrow(
			new AppError('Data Final do Evento menor do que Data Atual', 400)
		);
	});
});
