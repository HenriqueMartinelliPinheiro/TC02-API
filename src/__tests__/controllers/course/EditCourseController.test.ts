import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { EditCourseService } from '../../../services/course/EditCourseService';
import { isValidRequest } from '../../../utils/validations/isValidRequest';
import { editCourseTypes } from '../../../@types/course/editCourseTypes';
import { EditCourseController } from '../../../controllers/course/EditCourseController';
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

describe('EditCourseController', () => {
	let editCourseController: EditCourseController;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let editCourseService: EditCourseService;
	let courseRepository: ICourseRepository;
	let prismaClient: PrismaClient;

	beforeEach(() => {
		vi.clearAllMocks();
		prismaClient = new PrismaClient();
		courseRepository = new CourseRepository(prismaClient);

		editCourseService = new EditCourseService(courseRepository);
		editCourseService.execute = vi.fn();

		editCourseController = new EditCourseController(editCourseService);

		req = {
			body: {
				courseName: 'Test Course',
				courseCoordinatorEmail: 'coordinator@example.com',
				courseId: '123',
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

		await editCourseController.editCourse(req as Request, res as Response);

		expect(isValidRequest).toHaveBeenCalledWith(req.body, editCourseTypes);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			course: undefined,
			msg: 'Dados Inválidos',
		});
	});

	it('should return 201 if course is edited successfully', async () => {
		(isValidRequest as any).mockReturnValue(true);

		const course = new CourseDomain({
			courseName: 'Test Course',
			courseCoordinatorEmail: 'coordinator@example.com',
			courseId: 123,
		});

		const editedCourse = {
			courseId: '123',
			...course,
		};

		(editCourseService.execute as any).mockResolvedValue(editedCourse);

		await editCourseController.editCourse(req as Request, res as Response);

		expect(editCourseService.execute).toHaveBeenCalledWith(expect.any(CourseDomain));
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			course: editedCourse,
			msg: 'Curso editado com sucesso',
		});
	});

	it('should return 400 if there is an error during course editing', async () => {
		(isValidRequest as any).mockReturnValue(true);

		const error = new Error('Erro ao editar curso');
		(editCourseService.execute as any).mockRejectedValue(error);

		await editCourseController.editCourse(req as Request, res as Response);

		expect(editCourseService.execute).toHaveBeenCalledWith(expect.any(CourseDomain));
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			course: undefined,
			msg: 'Erro ao editar curso',
		});
	});
});
