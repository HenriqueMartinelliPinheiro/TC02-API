import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { GetCourseByIdService } from '../../../services/course/GetCourseByIdService';
import { isValidRequest } from '../../../utils/validations/isValidRequest';
import { getCourseByIdTypes } from '../../../@types/course/getCourseByIdTypes';
import { GetCourseByIdController } from '../../../controllers/course/GetCourseByIdController';
import { PrismaClient } from '@prisma/client';
import { CourseRepository } from '../../../repository/implementation/CourseRepository';
import { ICourseRepository } from '../../../repository/interfaces/ICourseRepository';

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
	let req: Partial<Request>;
	let res: Partial<Response>;
	let getCourseByIdService: GetCourseByIdService;
	let courseRepository: ICourseRepository;
	let prismaClient: PrismaClient;

	beforeEach(() => {
		vi.clearAllMocks();
		prismaClient = new PrismaClient();
		courseRepository = new CourseRepository(prismaClient);

		getCourseByIdService = new GetCourseByIdService(courseRepository);
		getCourseByIdService.execute = vi.fn();

		getCourseByIdController = new GetCourseByIdController(getCourseByIdService);

		req = {
			params: {
				courseId: '123',
			},
			requestEmail: 'requester@example.com',
		};

		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn().mockReturnThis(),
		};
	});

	it('should return 400 if request is invalid', async () => {
		(isValidRequest as any).mockReturnValue(false);

		await getCourseByIdController.getCourseById(req as Request, res as Response);

		expect(isValidRequest).toHaveBeenCalledWith(req.params, getCourseByIdTypes);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			course: undefined,
			msg: 'Erro na requisição',
		});
	});

	it('should return 200 if course is not found', async () => {
		(isValidRequest as any).mockReturnValue(true);

		(getCourseByIdService.execute as any).mockResolvedValue(null);

		await getCourseByIdController.getCourseById(req as Request, res as Response);

		expect(getCourseByIdService.execute).toHaveBeenCalledWith(req.params.courseId);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			course: null,
			msg: 'Curso não encontrado',
		});
	});

	it('should return 200 if course is found', async () => {
		(isValidRequest as any).mockReturnValue(true);

		const course = {
			courseId: '123',
			courseName: 'Test Course',
			courseCoordinatorEmail: 'coordinator@example.com',
		};

		(getCourseByIdService.execute as any).mockResolvedValue(course);

		await getCourseByIdController.getCourseById(req as Request, res as Response);

		expect(getCourseByIdService.execute).toHaveBeenCalledWith(req.params.courseId);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			course: course,
			msg: 'Curso Retornado com sucesso',
		});
	});

	it('should return 401 if there is an error during fetching course', async () => {
		(isValidRequest as any).mockReturnValue(true);

		const error = new Error('Erro ao buscar curso');
		(getCourseByIdService.execute as any).mockRejectedValue(error);

		await getCourseByIdController.getCourseById(req as Request, res as Response);

		expect(getCourseByIdService.execute).toHaveBeenCalledWith(req.params.courseId);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			course: undefined,
			msg: 'Error on getCourseById',
		});
	});
});
