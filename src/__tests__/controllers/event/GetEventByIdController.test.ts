import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { GetEventByIdService } from '../../../services/event/GetEventByIdService';
import { GetEventByIdController } from '../../../controllers/event/GetEventByIdController';
import { isValidRequest } from '../../../utils/validations/isValidRequest';
import { AppError } from '../../../utils/errors/AppError';
import { IEventRepository } from '../../../repository/interfaces/IEventRepository';

vi.mock('../../../loggers/Logger', () => {
	return {
		Logger: vi.fn().mockImplementation(() => {
			return {
				info: vi.fn(),
				warn: vi.fn(),
				error: vi.fn(),
			};
		}),
	};
});

vi.mock('../../../utils/validations/isValidRequest');

describe('GetEventByIdController', () => {
	let getEventByIdController: GetEventByIdController;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let getEventByIdService: GetEventByIdService;
	let eventRepository: IEventRepository;

	beforeEach(() => {
		vi.clearAllMocks();

		eventRepository = {} as IEventRepository;
		getEventByIdService = new GetEventByIdService(eventRepository);
		getEventByIdService.execute = vi.fn();

		getEventByIdController = new GetEventByIdController(getEventByIdService);

		req = {
			params: {
				eventId: '1',
			},
		};

		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn().mockReturnThis(),
		};
	});

	it('should return 400 if request is invalid', async () => {
		(isValidRequest as any).mockReturnValue('Invalid request');

		await getEventByIdController.getEventById(req as Request, res as Response);

		expect(isValidRequest).toHaveBeenCalledWith({ eventId: 1 }, expect.anything());
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			event: undefined,
			msg: 'Invalid request',
		});
	});

	it('should return 404 if event is not found', async () => {
		(isValidRequest as any).mockReturnValue(true);
		(getEventByIdService.execute as any).mockResolvedValue(null);

		await getEventByIdController.getEventById(req as Request, res as Response);

		expect(getEventByIdService.execute).toHaveBeenCalledWith(1);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			event: undefined,
			msg: 'Evento não encontrado',
		});
	});

	it('should return 200 if event is found', async () => {
		const mockEvent = { id: 1, title: 'Test Event' };

		(isValidRequest as any).mockReturnValue(true);
		(getEventByIdService.execute as any).mockResolvedValue(mockEvent);

		await getEventByIdController.getEventById(req as Request, res as Response);

		expect(getEventByIdService.execute).toHaveBeenCalledWith(1);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			event: mockEvent,
			msg: 'Evento retornado com sucesso',
		});
	});

	it('should return 500 if an internal server error occurs', async () => {
		const error = new Error('Internal Server Error');

		(isValidRequest as any).mockReturnValue(true);
		(getEventByIdService.execute as any).mockRejectedValue(error);

		await getEventByIdController.getEventById(req as Request, res as Response);

		expect(getEventByIdService.execute).toHaveBeenCalledWith(1);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			msg: 'Erro Interno do Servidor',
			event: undefined,
		});
	});

	it('should return custom error if AppError is thrown', async () => {
		const error = new AppError('Custom Error', 400);

		(isValidRequest as any).mockReturnValue(true);
		(getEventByIdService.execute as any).mockRejectedValue(error);

		await getEventByIdController.getEventById(req as Request, res as Response);

		expect(getEventByIdService.execute).toHaveBeenCalledWith(1);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			event: undefined,
			msg: 'Custom Error',
		});
	});
});
