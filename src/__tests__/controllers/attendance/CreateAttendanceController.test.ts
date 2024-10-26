import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { CreateAttendanceService } from '../../../services/attendance/CreateAttendanceService';
import { CreateAttendanceController } from '../../../controllers/attendance/CreateAttendanceController';
import { AttendanceDomain } from '../../../domain/AttendanceDomain';
import { EventActivityDomain } from '../../../domain/EventActivityDomain';
import { isValidRequest } from '../../../utils/validations/isValidRequest';
import { createAttendanceTypes } from '../../../@types/attendance/createAttendanceTypes';
import { AppError } from '../../../utils/errors/AppError';

vi.mock('../../../utils/validations/isValidRequest');
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

describe('CreateAttendanceController', () => {
	let createAttendanceController: CreateAttendanceController;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let createAttendanceService: CreateAttendanceService;

	beforeEach(() => {
		vi.clearAllMocks();

		createAttendanceService = new CreateAttendanceService(
			{} as any,
			{} as any,
			{} as any,
			{} as any,
			{} as any
		);
		createAttendanceService.execute = vi.fn();

		createAttendanceController = new CreateAttendanceController(createAttendanceService);

		req = {
			body: {
				studentName: 'Test Student',
				studentRegistration: '12345',
				eventActivityId: 1,
				studentCpf: '12345678900',
				eventId: 1,
				latitude: 123.45,
				longitude: 678.9,
			},
		};

		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn().mockReturnThis(),
		};
	});

	it('should return 400 if request is invalid', async () => {
		(isValidRequest as any).mockReturnValue('Dados inválidos');

		await createAttendanceController.createAttendance(req as Request, res as Response);

		expect(isValidRequest).toHaveBeenCalledWith(req.body, createAttendanceTypes);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			event: undefined,
			msg: 'Dados inválidos',
		});
	});

	it('should return 201 if attendance is created successfully', async () => {
		(isValidRequest as any).mockReturnValue(true);

		const attendance = new AttendanceDomain({
			studentName: 'Test Student',
			studentRegistration: '12345',
			studentCpf: '12345678900',
			eventActivity: new EventActivityDomain({ eventActivityId: 1 }),
		});

		(createAttendanceService.execute as any).mockResolvedValue(attendance);

		await createAttendanceController.createAttendance(req as Request, res as Response);

		expect(createAttendanceService.execute).toHaveBeenCalledWith(
			expect.any(AttendanceDomain),
			req.body.eventId,
			req.body.latitude,
			req.body.longitude
		);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			event: attendance,
			msg: 'Presença registrada com sucesso',
		});
	});

	it('should return 500 if there is an internal server error', async () => {
		(isValidRequest as any).mockReturnValue(true);

		const error = new Error('Erro ao registrar presença');
		(createAttendanceService.execute as any).mockRejectedValue(error);

		await createAttendanceController.createAttendance(req as Request, res as Response);

		expect(createAttendanceService.execute).toHaveBeenCalledWith(
			expect.any(AttendanceDomain),
			req.body.eventId,
			req.body.latitude,
			req.body.longitude
		);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			event: undefined,
			msg: 'Erro interno do Servidor',
		});
	});

	it('should return specific error if AppError is thrown', async () => {
		(isValidRequest as any).mockReturnValue(true);

		const appError = new AppError('Erro específico', 400);
		(createAttendanceService.execute as any).mockRejectedValue(appError);

		await createAttendanceController.createAttendance(req as Request, res as Response);

		expect(createAttendanceService.execute).toHaveBeenCalledWith(
			expect.any(AttendanceDomain),
			req.body.eventId,
			req.body.latitude,
			req.body.longitude
		);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			event: undefined,
			msg: 'Erro específico',
		});
	});
});