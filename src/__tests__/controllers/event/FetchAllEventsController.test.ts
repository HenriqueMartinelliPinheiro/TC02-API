import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { FetchAllEventsService } from '../../../services/event/FetchAllEventsService';
import { FetchAllEventsController } from '../../../controllers/event/FetchAllEventsController';
import { AppError } from '../../../utils/errors/AppError';
import { IEventRepository } from '../../../repository/interfaces/IEventRepository';

vi.mock('../../../loggers/Logger', () => {
	return {
		Logger: vi.fn().mockImplementation(() => {
			return {
				info: vi.fn(),
				error: vi.fn(),
			};
		}),
	};
});

describe('FetchAllEventsController', () => {
	let fetchAllEventsController: FetchAllEventsController;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let fetchAllEventsService: FetchAllEventsService;
	let eventRepository: IEventRepository;

	beforeEach(() => {
		vi.clearAllMocks();
		eventRepository = {} as IEventRepository;

		fetchAllEventsService = new FetchAllEventsService(eventRepository);
		fetchAllEventsService.execute = vi.fn();

		fetchAllEventsController = new FetchAllEventsController(fetchAllEventsService);

		req = {
			query: {
				skip: '0',
				take: '10',
				searchTerm: 'test',
			},
		};

		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn().mockReturnThis(),
		};
	});

	it('should return 201 and fetch all events successfully', async () => {
		const mockResponse = {
			events: [
				{ id: 1, title: 'Event 1' },
				{ id: 2, title: 'Event 2' },
			],
			total: 2,
		};

		(fetchAllEventsService.execute as any).mockResolvedValue(mockResponse);

		await fetchAllEventsController.fetchAllEvents(req as Request, res as Response);

		expect(fetchAllEventsService.execute).toHaveBeenCalledWith(0, 10, 'test');
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			total: 2,
			events: mockResponse.events,
			msg: 'Eventos Retornados com Sucesso',
		});
	});

	it('should return 500 if an internal server error occurs', async () => {
		const error = new Error('Erro ao Buscar Eventos');
		(fetchAllEventsService.execute as any).mockRejectedValue(error);

		await fetchAllEventsController.fetchAllEvents(req as Request, res as Response);

		expect(fetchAllEventsService.execute).toHaveBeenCalledWith(0, 10, 'test');
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			events: null,
			total: 0,
			msg: 'Erro ao Buscar Eventos',
		});
	});

	it('should return custom error if AppError is thrown', async () => {
		const error = new AppError('Custom Error', 400);
		(fetchAllEventsService.execute as any).mockRejectedValue(error);

		await fetchAllEventsController.fetchAllEvents(req as Request, res as Response);

		expect(fetchAllEventsService.execute).toHaveBeenCalledWith(0, 10, 'test');
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			total: 0,
			events: null,
			msg: 'Custom Error',
		});
	});
});
