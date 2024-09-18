import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { CreateEventService } from '../../../services/event/CreateEventService';
import { isValidRequest } from '../../../utils/validations/isValidRequest';
import { isValidEventDate } from '../../../utils/validations/isValidEventDate';
import { EventDomain } from '../../../domain/EventDomain';
import { EventActivityDomain } from '../../../domain/EventActivityDomain';
import { EventCourseDomain } from '../../../domain/EventCourseDomain';
import { CreateEventController } from '../../../controllers/event/CreateEventController';
import { IEventRepository } from '../../../repository/interfaces/IEventRepository';
import { PrismaClient } from '@prisma/client';
import { createEventTypes } from '../../../@types/event/createEventTypes';

vi.mock('../../../utils/validations/isValidRequest');
vi.mock('../../../utils/validations/isValidEventDate');
vi.mock('../../../loggers/Logger', () => {
	return {
		Logger: vi.fn().mockImplementation(() => {
			return {
				warn: vi.fn(),
				error: vi.fn(),
				info: vi.fn(),
			};
		}),
	};
});

describe('CreateEventController', () => {
	let createEventController: CreateEventController;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let createEventService: CreateEventService;
	let prismaClient: PrismaClient;
	let eventRepository: IEventRepository;

	beforeEach(() => {
		vi.clearAllMocks();

		prismaClient = new PrismaClient();
		eventRepository = {} as IEventRepository;

		createEventService = new CreateEventService(eventRepository);
		createEventService.execute = vi.fn();

		createEventController = new CreateEventController(createEventService);

		req = {
			body: {
				eventTitle: 'Test Event',
				eventStartDate: '2024-09-01T00:00:00Z',
				eventEndDate: '2024-09-10T00:00:00Z',
				selectedCourses: [
					{ courseId: 1, courseName: 'Course 1' },
					{ courseId: 2, courseName: 'Course 2' },
				],
				eventActivities: [
					{
						eventActivityTitle: 'Activity 1',
						eventActivityStartDate: '2024-09-01T00:00:00Z',
						eventActivityEndDate: '2024-09-02T00:00:00Z',
						eventActivityDescription: 'Description 1',
					},
				],
				eventStatus: 'Not Started',
			},
		};

		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn().mockReturnThis(),
		};
	});

	it('should return 400 if request is invalid', async () => {
		(isValidRequest as any).mockReturnValue('Dados inválidos');

		await createEventController.createEvent(req as Request, res as Response);

		expect(isValidRequest).toHaveBeenCalledWith(req.body, createEventTypes);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			msg: 'Dados inválidos',
			event: undefined,
		});
	});

	it('should return 400 if event dates are invalid', async () => {
		(isValidRequest as any).mockReturnValue(true);
		(isValidEventDate as any).mockReturnValue(false);

		await createEventController.createEvent(req as Request, res as Response);

		expect(isValidEventDate).toHaveBeenCalledWith(
			new Date(req.body.eventStartDate),
			new Date(req.body.eventEndDate),
			expect.any(Array) // Verificando se a função foi chamada com a lista de atividades
		);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			msg: 'Datas Inválidas',
			event: undefined,
		});
	});

	it('should return 201 if event is created successfully', async () => {
		(isValidRequest as any).mockReturnValue(true);
		(isValidEventDate as any).mockReturnValue(true);

		const event = new EventDomain({
			eventTitle: 'Test Event',
			eventStartDate: new Date('2024-09-01T00:00:00Z'),
			eventEndDate: new Date('2024-09-10T00:00:00Z'),
			eventStatus: 'Not Started',
			eventActivities: [
				new EventActivityDomain({
					eventActivityTitle: 'Activity 1',
					eventActivityStartDate: new Date('2024-09-01T00:00:00Z'),
					eventActivityEndDate: new Date('2024-09-02T00:00:00Z'),
					eventActivityDescription: 'Description 1',
				}),
			],
		});

		(createEventService.execute as any).mockResolvedValue(event);

		await createEventController.createEvent(req as Request, res as Response);

		expect(createEventService.execute).toHaveBeenCalledWith(
			expect.any(EventDomain),
			expect.any(Array)
		);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			event,
			msg: 'Evento Criado com Sucesso',
		});
	});

	it('should return 500 if there is an internal server error', async () => {
		(isValidRequest as any).mockReturnValue(true);
		(isValidEventDate as any).mockReturnValue(true);

		const error = new Error('Erro ao criar evento');
		(createEventService.execute as any).mockRejectedValue(error);

		await createEventController.createEvent(req as Request, res as Response);

		expect(createEventService.execute).toHaveBeenCalledWith(
			expect.any(EventDomain),
			expect.any(Array)
		);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			msg: 'Erro interno do Servidor',
			event: undefined,
		});
	});
});
