import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { GetCourseByIdController } from '../../../controllers/course/GetCourseByIdController';
import { GetCourseByIdService } from '../../../services/course/GetCourseByIdService';
import { isValidRequest } from '../../../utils/validations/isValidRequest';
import { Logger } from '../../../loggers/Logger';
import { Course } from '@prisma/client';
import { courseLogPath } from '../../../config/logPaths';

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

describe('GetCourseByIdController', () => {
	let getCourseByIdController: GetCourseByIdController;
	let getCourseByIdService: GetCourseByIdService;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let logger: Logger;

	beforeEach(() => {
		getCourseByIdService = {
			execute: vi.fn(),
		} as unknown as GetCourseByIdService;

		getCourseByIdController = new GetCourseByIdController(getCourseByIdService);

		req = {
			params: {
				courseId: '123',
			},
			requestEmail: 'test@example.com',
		};

		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn().mockReturnThis(),
		} as unknown as Response;

		logger = new Logger('GetCourseByIdController', courseLogPath);
	});

	it('should return 400 if request is invalid', async () => {
		(isValidRequest as any).mockReturnValue(false);

		await getCourseByIdController.getCourseById(req as Request, res as Response);

		expect(isValidRequest).toHaveBeenCalledWith(req.params, expect.any(Object));
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			course: undefined,
			msg: 'Erro na requisição',
		});
	});

	it('should return 404 if course is not found', async () => {
		(isValidRequest as any).mockReturnValue(true);
		(getCourseByIdService.execute as any).mockResolvedValue(undefined);

		await getCourseByIdController.getCourseById(req as Request, res as Response);

		expect(getCourseByIdService.execute).toHaveBeenCalledWith('123');
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			course: undefined,
			msg: 'Curso não encontrado',
		});
	});

	it('should return 200 with the course data if course is found', async () => {
		(isValidRequest as any).mockReturnValue(true);

		const course = {
			courseId: 123,
			courseName: 'Test Course',
			courseCoordinatorEmail: 'coordinator@example.com',
		} as Course;

		(getCourseByIdService.execute as any).mockResolvedValue(course);

		await getCourseByIdController.getCourseById(req as Request, res as Response);

		expect(getCourseByIdService.execute).toHaveBeenCalledWith('123');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			course: course,
			msg: 'Curso retornado com sucesso',
		});
	});

	it('should return 401 with an error message if an unexpected error occurs', async () => {
		(isValidRequest as any).mockReturnValue(true);

		const error = new Error('Unexpected error');
		(getCourseByIdService.execute as any).mockRejectedValue(error);

		await getCourseByIdController.getCourseById(req as Request, res as Response);

		expect(getCourseByIdService.execute).toHaveBeenCalledWith('123');
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			course: undefined,
			msg: 'Erro ao buscar curso',
		});
	});
});
