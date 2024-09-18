import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { EditEventService } from '../../../services/event/EditEventService';
import { isValidRequest } from '../../../utils/validations/isValidRequest';
import { isValidEventDate } from '../../../utils/validations/isValidEventDate';
import { EventDomain } from '../../../domain/EventDomain';
import { EventActivityDomain } from '../../../domain/EventActivityDomain';
import { EditEventController } from '../../../controllers/event/EditEventController';
import { IEventRepository } from '../../../repository/interfaces/IEventRepository';
import { PrismaClient } from '@prisma/client';
import { editEventTypes } from '../../../@types/event/editEventTypes';

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

describe('EditEventController', () => {
	let editEventController: EditEventController;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let editEventService: EditEventService;
	let prismaClient: PrismaClient;
	let eventRepository: IEventRepository;

	beforeEach(() => {
		vi.clearAllMocks();

		prismaClient = new PrismaClient();
		eventRepository = {} as IEventRepository;

		editEventService = new EditEventService(eventRepository);
		editEventService.execute = vi.fn();

		editEventController = new EditEventController(editEventService);

		req = {
			body: {
				eventId: 1,
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

		await editEventController.editEvent(req as Request, res as Response);

		expect(isValidRequest).toHaveBeenCalledWith(req.body, editEventTypes);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			msg: 'Dados inválidos',
			event: undefined,
		});
	});

	it('should return 400 if event dates are invalid', async () => {
		(isValidRequest as any).mockReturnValue(true);
		(isValidEventDate as any).mockReturnValue(false);

		await editEventController.editEvent(req as Request, res as Response);

		expect(isValidEventDate).toHaveBeenCalledWith(
			new Date(req.body.eventStartDate),
			new Date(req.body.eventEndDate),
			expect.any(Array)
		);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			msg: 'Datas Inválidas',
			event: undefined,
		});
	});

	it('should return 200 if event is updated successfully', async () => {
		(isValidRequest as any).mockReturnValue(true);
		(isValidEventDate as any).mockReturnValue(true);

		const event = new EventDomain({
			eventId: 1,
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

		(editEventService.execute as any).mockResolvedValue(event);

		await editEventController.editEvent(req as Request, res as Response);

		expect(editEventService.execute).toHaveBeenCalledWith(
			expect.any(EventDomain),
			expect.any(Array)
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			event,
			msg: 'Evento Atualizado com Sucesso',
		});
	});

	it('should return 500 if there is an internal server error', async () => {
		(isValidRequest as any).mockReturnValue(true);
		(isValidEventDate as any).mockReturnValue(true);

		const error = new Error('Erro ao atualizar evento');
		(editEventService.execute as any).mockRejectedValue(error);

		await editEventController.editEvent(req as Request, res as Response);

		expect(editEventService.execute).toHaveBeenCalledWith(
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
