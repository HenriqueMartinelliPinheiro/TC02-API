import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { FetchAllCoursesService } from '../../../services/course/FetchAllCoursesService';
import { FetchAllCoursesController } from '../../../controllers/course/FetchAllCoursesController';
import { PrismaClient } from '@prisma/client';
import { CourseRepository } from '../../../repository/implementation/CourseRepository';
import { ICourseRepository } from '../../../repository/interfaces/ICourseRepository';

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

describe('FetchAllCoursesController', () => {
	let fetchAllCoursesController: FetchAllCoursesController;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let fetchAllCoursesService: FetchAllCoursesService;
	let courseRepository: ICourseRepository;
	let prismaClient: PrismaClient;

	beforeEach(() => {
		vi.clearAllMocks();
		prismaClient = new PrismaClient();
		courseRepository = new CourseRepository(prismaClient);

		fetchAllCoursesService = new FetchAllCoursesService(courseRepository);
		fetchAllCoursesService.execute = vi.fn();

		fetchAllCoursesController = new FetchAllCoursesController(fetchAllCoursesService);

		req = {
			query: {
				skip: '0',
				take: '10',
				searchTerm: '',
			},
			requestEmail: 'requester@example.com',
		};

		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn().mockReturnThis(),
		} as unknown as Response;
	});

	it('should return 201 if courses are fetched successfully', async () => {
		const courses = [
			{
				courseId: '1',
				courseName: 'Course 1',
				courseCoordinatorEmail: 'coordinator1@example.com',
			},
			{
				courseId: '2',
				courseName: 'Course 2',
				courseCoordinatorEmail: 'coordinator2@example.com',
			},
		];

		const total = courses.length;

		(fetchAllCoursesService.execute as any).mockResolvedValue({ courses, total });

		await fetchAllCoursesController.fetchAllCourses(req as Request, res as Response);

		expect(fetchAllCoursesService.execute).toHaveBeenCalledWith(0, 10, '');
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			total: total,
			courses: courses,
			msg: 'Cursos Retornados com Sucesso',
		});
	});

	it('should return 500 if there is an error while fetching courses', async () => {
		const error = new Error('Erro ao Buscar Cursos');
		(fetchAllCoursesService.execute as any).mockRejectedValue(error);

		await fetchAllCoursesController.fetchAllCourses(req as Request, res as Response);

		expect(fetchAllCoursesService.execute).toHaveBeenCalledWith(0, 10, '');
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			total: 0,
			courses: null,
			msg: 'Erro ao Buscar Cursos',
		});
	});
});
