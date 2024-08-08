import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { CreateCourseService } from '../../../services/course/CreateCourseService';
import { isValidRequest } from '../../../utils/validations/isValidRequest';
import { createCourseTypes } from '../../../@types/course/createCourseTypes';
import { CreateCourseController } from '../../../controllers/course/CreateCourseController';
import { Logger } from '../../../loggers/Logger';
import { CourseDomain } from '../../../domain/CourseDomain';
import { ICourseRepository } from '../../../repository/interfaces/ICourseRepository';
import { PrismaClient } from '@prisma/client';
import { CourseRepository } from '../../../repository/implementation/CourseRepository';

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

describe('CreateCourseController', () => {
	let createCourseController: CreateCourseController;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let createCourseService: CreateCourseService;
	let courseRepository: ICourseRepository;
	let prismaClient: PrismaClient;

	beforeEach(() => {
		vi.clearAllMocks();
		prismaClient = new PrismaClient();
		courseRepository = new CourseRepository(prismaClient);

		createCourseService = new CreateCourseService(courseRepository);
		createCourseService.execute = vi.fn();

		createCourseController = new CreateCourseController(createCourseService);

		req = {
			body: {
				courseName: 'Test Course',
				courseCoordinatorEmail: 'coordinator@example.com',
				requestEmail: 'requester@example.com',
			},
		};

		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn().mockReturnThis(),
		};
	});

	it('should return 400 if request is invalid', async () => {
		(isValidRequest as any).mockReturnValue(false);

		await createCourseController.createCourse(req as Request, res as Response);

		expect(isValidRequest).toHaveBeenCalledWith(req.body, createCourseTypes);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			course: undefined,
			msg: 'Dados Inválidos',
		});
	});

	it('should return 201 if course is created successfully', async () => {
		(isValidRequest as any).mockReturnValue(true);

		const course = new CourseDomain({
			courseName: 'Test Course',
			courseCoordinatorEmail: 'coordinator@example.com',
		});

		const createdCourse = {
			courseId: '123',
			...course,
		};

		(createCourseService.execute as any).mockResolvedValue(createdCourse);

		await createCourseController.createCourse(req as Request, res as Response);

		expect(createCourseService.execute).toHaveBeenCalledWith(expect.any(CourseDomain));
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			course: createdCourse,
			msg: 'Curso criado com sucesso',
		});
	});

	it('should return 400 if there is an error during course creation', async () => {
		(isValidRequest as any).mockReturnValue(true);

		const error = new Error('Erro ao criar curso');
		(createCourseService.execute as any).mockRejectedValue(error);

		await createCourseController.createCourse(req as Request, res as Response);

		expect(createCourseService.execute).toHaveBeenCalledWith(expect.any(CourseDomain));
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			course: undefined,
			msg: 'Erro ao criar curso',
		});
	});
});
