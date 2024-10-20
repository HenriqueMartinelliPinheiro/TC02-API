import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IEventRepository } from '../../../repository/interfaces/IEventRepository';
import { EditEventService } from '../../../services/event/EditEventService';
import { EventDomain } from '../../../domain/EventDomain';
import { EventCourseDomain } from '../../../domain/EventCourseDomain';
import { AppError } from '../../../utils/errors/AppError';
import { Event, EventStatus } from '@prisma/client';
import { afterEach } from 'node:test';
import { EventActivityDomain } from '../../../domain/EventActivityDomain';

describe('EditEventService', () => {
	let editEventService: EditEventService;
	let eventRepository: IEventRepository;

	const fixedDate = new Date('2024-08-15T00:00:00Z');

	beforeEach(() => {
		eventRepository = {
			fetchEventById: vi.fn(),
			updateEvent: vi.fn(),
			updateEventLocation: vi.fn(),
			updateEventCourses: vi.fn(),
			getEventActivitiesByEventId: vi.fn(),
			removeEventActivity: vi.fn(),
			updateEventActivity: vi.fn(),
			addEventActivity: vi.fn(),
			getAttendanceRecordsByActivityId: vi.fn(),
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

	it('should update event and related entities', async () => {
		const event = new EventDomain({
			eventId: 1,
			eventTitle: 'Test Event',
			eventStartDate: new Date('2024-09-01T00:00:00Z'),
			eventEndDate: new Date('2024-09-10T00:00:00Z'),
			eventStatus: EventStatus.NAO_INICIADO,
			eventActivities: [
				new EventActivityDomain({
					eventActivityTitle: 'Activity 1',
					eventActivityStartDate: new Date('2024-09-01T10:00:00Z'),
					eventActivityEndDate: new Date('2024-09-01T12:00:00Z'),
					eventActivityDescription: 'Description 1',
				}),
			],
		});

		const courses: EventCourseDomain[] = [
			new EventCourseDomain({ courseId: 1, courseName: 'Course 1' }),
		];

		const eventInDatabase = {
			eventId: 1,
			eventStatus: EventStatus.NAO_INICIADO,
		} as Event;

		(eventRepository.fetchEventById as any).mockResolvedValue(eventInDatabase);
		(eventRepository.getEventActivitiesByEventId as any).mockResolvedValue([]);

		await editEventService.execute(event, courses);

		expect(eventRepository.updateEvent).toHaveBeenCalledWith(event);
		expect(eventRepository.updateEventLocation).toHaveBeenCalledWith(event);
		expect(eventRepository.updateEventCourses).toHaveBeenCalledWith(event, courses);
		expect(eventRepository.addEventActivity).toHaveBeenCalledWith(
			event.getEventActivities()[0],
			event.getEventId()
		);
	});
});
