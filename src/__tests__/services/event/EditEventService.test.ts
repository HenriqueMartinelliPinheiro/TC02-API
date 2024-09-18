import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IEventRepository } from '../../../repository/interfaces/IEventRepository';
import { EditEventService } from '../../../services/event/EditEventService';
import { EventDomain } from '../../../domain/EventDomain';
import { EventCourseDomain } from '../../../domain/EventCourseDomain';
import { AppError } from '../../../utils/errors/AppError';
import { Event, EventStatus } from '@prisma/client';
import { afterEach } from 'node:test';

describe('EditEventService', () => {
	let editEventService: EditEventService;
	let eventRepository: IEventRepository;

	const fixedDate = new Date('2024-08-15T00:00:00Z');

	beforeEach(() => {
		eventRepository = {
			fetchEventById: vi.fn(),
			editEvent: vi.fn(),
			editEventWithLocation: vi.fn(),
		} as unknown as IEventRepository;

		editEventService = new EditEventService(eventRepository);

		vi.setSystemTime(fixedDate);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should throw an error if event end date is in the past', async () => {
		const event = new EventDomain({
			eventId: 1,
			eventTitle: 'Test Event',
			eventStartDate: new Date('2024-09-01T00:00:00Z'),
			eventEndDate: new Date('2023-09-10T00:00:00Z'),
			eventStatus: EventStatus.NAO_INICIADO,
			eventActivities: [],
		});

		const courses: EventCourseDomain[] = [
			new EventCourseDomain({ courseId: 1, courseName: 'Course 1' }),
		];

		await expect(editEventService.execute(event, courses)).rejects.toThrow(
			new AppError('Data Final do Evento menor do que Data Atual', 400)
		);
	});

	it('should throw an error if no courses are provided', async () => {
		const event = new EventDomain({
			eventId: 1,
			eventTitle: 'Test Event',
			eventStartDate: new Date('2024-09-01T00:00:00Z'),
			eventEndDate: new Date('2024-09-10T00:00:00Z'),
			eventStatus: EventStatus.NAO_INICIADO,
			eventActivities: [],
		});

		const courses: EventCourseDomain[] = [];
		await expect(editEventService.execute(event, courses)).rejects.toThrow(
			new AppError('Nenhum Curso Informado', 400)
		);
	});

	it('should throw an error if event is canceled or closed', async () => {
		const event = new EventDomain({
			eventId: 1,
			eventTitle: 'Test Event',
			eventStartDate: new Date('2024-09-01T00:00:00Z'),
			eventEndDate: new Date('2024-09-10T00:00:00Z'),
			eventStatus: EventStatus.NAO_INICIADO,
			eventActivities: [],
		});

		const courses: EventCourseDomain[] = [
			new EventCourseDomain({ courseId: 1, courseName: 'Course 1' }),
		];

		const eventInDatabase = {
			eventId: 1,
			eventStatus: EventStatus.CANCELADO,
		} as Event;

		(eventRepository.fetchEventById as any).mockResolvedValue(eventInDatabase);

		await expect(editEventService.execute(event, courses)).rejects.toThrow(
			new AppError('Evento Encerrado ou Cancelado não pode ser editado', 400)
		);
	});

	it('should update event without location if location is not provided', async () => {
		const event = new EventDomain({
			eventId: 1,
			eventTitle: 'Test Event',
			eventStartDate: new Date('2024-09-01T00:00:00Z'),
			eventEndDate: new Date('2024-09-10T00:00:00Z'),
			eventStatus: EventStatus.NAO_INICIADO,
			eventActivities: [],
			eventLocation: undefined,
		});

		const courses: EventCourseDomain[] = [
			new EventCourseDomain({ courseId: 1, courseName: 'Course 1' }),
		];

		const updatedEvent = {
			eventId: 1,
			eventTitle: 'Updated Event',
			eventStatus: EventStatus.NAO_INICIADO,
			eventStartDate: new Date('2024-09-01T00:00:00Z'),
			eventEndDate: new Date('2024-09-10T00:00:00Z'),
			createdAt: new Date(),
			updatedAt: new Date(),
		} as Event;

		(eventRepository.fetchEventById as any).mockResolvedValue(updatedEvent);
		(eventRepository.editEvent as any).mockResolvedValue(updatedEvent);

		const result = await editEventService.execute(event, courses);

		expect(eventRepository.editEvent).toHaveBeenCalledWith(event, courses);
		expect(result).toEqual(updatedEvent);
	});

	it('should update event with location if location is provided', async () => {
		const event = new EventDomain({
			eventId: 1,
			eventTitle: 'Test Event',
			eventStartDate: new Date('2024-09-01T00:00:00Z'),
			eventEndDate: new Date('2024-09-10T00:00:00Z'),
			eventStatus: EventStatus.NAO_INICIADO,
			eventActivities: [],
			eventLocation: {
				getLatitude: () => 123.45,
				getLongitude: () => 678.9,
				getRadius: () => 100,
			} as any,
		});

		const courses: EventCourseDomain[] = [
			new EventCourseDomain({ courseId: 1, courseName: 'Course 1' }),
		];

		const updatedEvent = {
			eventId: 1,
			eventTitle: 'Updated Event',
			eventStatus: EventStatus.NAO_INICIADO,
			eventStartDate: new Date('2024-09-01T00:00:00Z'),
			eventEndDate: new Date('2024-09-10T00:00:00Z'),
			createdAt: new Date(),
			updatedAt: new Date(),
		} as Event;

		(eventRepository.fetchEventById as any).mockResolvedValue(updatedEvent);
		(eventRepository.editEventWithLocation as any).mockResolvedValue(updatedEvent);

		const result = await editEventService.execute(event, courses);

		expect(eventRepository.editEventWithLocation).toHaveBeenCalledWith(event, courses);
		expect(result).toEqual(updatedEvent);
	});
});
