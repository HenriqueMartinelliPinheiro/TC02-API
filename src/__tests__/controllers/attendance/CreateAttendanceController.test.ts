import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { CreateAttendanceService } from '../../../services/attendance/CreateAttendanceService';
import { FetchStudentByCpfService } from '../../../services/sigaa/sigaaStudent/FetchStudentByCpfService';
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
vi.mock('../../../services/sigaa/sigaaStudent/FetchStudentByCpfService');

describe('CreateAttendanceController', () => {
	let createAttendanceController: CreateAttendanceController;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let createAttendanceService: CreateAttendanceService;
	let fetchStudentByCpfService: FetchStudentByCpfService;

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

		fetchStudentByCpfService = new FetchStudentByCpfService();
		fetchStudentByCpfService.fetchStudentByCpf = vi.fn();

		createAttendanceController = new CreateAttendanceController(createAttendanceService);
		(createAttendanceController as any).fetchStudentByCpfService =
			fetchStudentByCpfService;

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

	it('should return 404 if student is not found', async () => {
		(isValidRequest as any).mockReturnValue(true);
		(fetchStudentByCpfService.fetchStudentByCpf as any).mockResolvedValue([]);

		await createAttendanceController.createAttendance(req as Request, res as Response);

		expect(fetchStudentByCpfService.fetchStudentByCpf).toHaveBeenCalledWith(
			req.body.studentCpf
		);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			event: undefined,
			msg: 'Aluno não encontrado',
		});
	});

	it('should return 201 if attendance is created successfully', async () => {
		(isValidRequest as any).mockReturnValue(true);

		const studentData = [
			{
				'nome-discente': 'Test Student',
				matricula: 12345,
			},
		];
		(fetchStudentByCpfService.fetchStudentByCpf as any).mockResolvedValue(studentData);

		const attendance = new AttendanceDomain({
			studentName: 'Test Student',
			studentRegistration: '12345',
			studentCpf: '12345678900',
			eventActivity: new EventActivityDomain({ eventActivityId: 1 }),
		});

		(createAttendanceService.execute as any).mockResolvedValue(attendance);

		await createAttendanceController.createAttendance(req as Request, res as Response);

		expect(fetchStudentByCpfService.fetchStudentByCpf).toHaveBeenCalledWith(
			req.body.studentCpf
		);
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
		(fetchStudentByCpfService.fetchStudentByCpf as any).mockResolvedValue([
			{
				'nome-discente': 'Test Student',
				matricula: 12345,
			},
		]);

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
		(fetchStudentByCpfService.fetchStudentByCpf as any).mockResolvedValue([
			{
				'nome-discente': 'Test Student',
				matricula: 12345,
			},
		]);

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
